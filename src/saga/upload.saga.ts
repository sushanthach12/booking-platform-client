import {
  call,
  put,
  take,
  fork,
  join,
  race,
  all,
  getContext,
  cancel,
} from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Store } from "@reduxjs/toolkit";
import { container } from "@/domain/di/container";
import { UploadUseCase } from "@/domain/use-cases/upload.use-case";
import { uploadActions } from "../store/actions/upload.actions";

const BATCH_SIZE = 3;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

function* runUpload(
  file: File,
  signal: AbortSignal,
  dispatch: Store["dispatch"],
): SagaIterator {
  const uploadUseCase = container.resolve(UploadUseCase);
  try {
    const url: string = yield call(
      [uploadUseCase, uploadUseCase.execute],
      file,
      {
        onProgress: (p: number) => dispatch(uploadActions.progress(p)),
      },
      signal,
    );
    yield put(uploadActions.success(url));
  } catch (err: unknown) {
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    if (!isAbort) {
      const message = err instanceof Error ? err.message : "Upload failed";
      yield put(uploadActions.failure(message));
    }
  }
}

function* runBulkUpload(
  files: File[],
  signal: AbortSignal,
  dispatch: Store["dispatch"],
): SagaIterator {
  const batches = chunk(files, BATCH_SIZE);
  for (const batch of batches) {
    yield all(batch.map((file) => call(runUpload, file, signal, dispatch)));
  }
}

function* handleBulkUpload(files: File[]): SagaIterator {
  if (files.length === 0) return;

  const dispatch: Store["dispatch"] = yield getContext("dispatch");
  const controller = new AbortController();
  const task = yield fork(runBulkUpload, files, controller.signal, dispatch);

  const { aborted } = yield race({
    completed: join(task),
    aborted: take(uploadActions.abort.match),
  });

  if (aborted) {
    controller.abort();
    yield cancel(task);
  }
}

export function* uploadWatcher(): SagaIterator {
  while (true) {
    const action: PayloadAction<File[]> = yield take(
      uploadActions.startBulk.match,
    );
    yield call(handleBulkUpload, action.payload);
  }
}
