/**
 * upload.saga.ts
 *
 * Orchestrates the two-step R2 upload flow via UploadRepository:
 *  1. repo.getPresignedUrl()  → POST /upload/presign  (NestJS)
 *  2. repo.uploadFile()       → PUT <presignedUrl>    (direct to R2, XHR)
 *
 * No upload mechanics live here — that's the repository's job.
 * This saga only orchestrates: batching, aborting, and action dispatching.
 */

import { UploadRepository } from "@/data/repositories/upload.repository";
import { container } from "@/domain/di/container";
import type { PayloadAction, Store } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import {
  all,
  call,
  cancel,
  fork,
  getContext,
  join,
  put,
  race,
  take,
} from "redux-saga/effects";
import { uploadActions } from "../store/actions/upload.actions";

const BATCH_SIZE = 3;

// ── Helpers ───────────────────────────────────────────────────────────────────

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

// ── Per-file upload ───────────────────────────────────────────────────────────

function* runUpload(
  file: File,
  index: number,
  _totalCount: number,
  signal: AbortSignal,
  dispatch: Store["dispatch"],
): SagaIterator {
  const repo: UploadRepository = container.resolve(UploadRepository);

  try {
    // Step 1 — ask NestJS for a presigned PUT URL
    const {
      uploadUrl,
      publicUrl,
    }: Awaited<ReturnType<UploadRepository["getPresignedUrl"]>> = yield call(
      [repo, repo.getPresignedUrl],
      {
        filename: file.name,
        contentType: file.type,
      },
    );

    // Step 2 — stream the file directly to R2
    // onProgress dispatches directly because it fires inside an XHR callback —
    // we can't yield put() from a plain callback.
    yield call(
      [repo, repo.uploadFile],
      uploadUrl,
      file,
      (p: number) => dispatch(uploadActions.progress(p)),
      signal,
    );

    yield put(
      uploadActions.success({
        url: publicUrl,
        altText: file.name,
        displayOrder: index,
        isPrimary: index === 0,
        fileSize: file.size,
        mimeType: file.type,
      }),
    );
  } catch (err: unknown) {
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    if (!isAbort) {
      const message = err instanceof Error ? err.message : "Upload failed";
      yield put(uploadActions.failure(message));
    }
    // Abort errors are intentionally swallowed —
    // handleBulkUpload tears down the saga tree via cancel().
  }
}

// ── Batch runner ──────────────────────────────────────────────────────────────

function* runBulkUpload(
  files: File[],
  signal: AbortSignal,
  dispatch: Store["dispatch"],
): SagaIterator {
  const totalCount = files.length;
  // Chunk the files into batches but keep original indices for metadata
  const indexed = files.map((file, index) => ({ file, index }));
  const batches = chunk(indexed, BATCH_SIZE);

  for (const batch of batches) {
    if (signal.aborted) return; // bail early if aborted between batches
    yield all(
      batch.map(({ file, index }) =>
        call(runUpload, file, index, totalCount, signal, dispatch),
      ),
    );
  }
}

// ── Orchestrator ──────────────────────────────────────────────────────────────

function* handleBulkUpload(files: File[]): SagaIterator {
  if (files.length === 0) return;

  // Requires saga middleware configured with:
  // createSagaMiddleware({ context: { dispatch: store.dispatch } })
  const dispatch: Store["dispatch"] = yield getContext("dispatch");
  const controller = new AbortController();

  const task = yield fork(runBulkUpload, files, controller.signal, dispatch);

  const { aborted } = yield race({
    completed: join(task),
    aborted: take(uploadActions.abort.match),
  });

  if (aborted) {
    controller.abort(); // signals XHR inside repo.uploadFile to abort
    yield cancel(task); // tears down the saga tree
  }
}

// ── Root watcher ──────────────────────────────────────────────────────────────

export function* uploadWatcher(): SagaIterator {
  while (true) {
    const action: PayloadAction<File[]> = yield take(
      uploadActions.startBulk.match,
    );
    yield call(handleBulkUpload, action.payload);
  }
}
