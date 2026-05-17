import type { IImageUploadMetadata } from "@/domain/entities/become-host.entity";
import { createSlice } from "@reduxjs/toolkit";
import { uploadActions } from "../actions/upload.actions";

interface UploadState {
  completedImages: IImageUploadMetadata[];
  /** @deprecated Use completedImages. Kept for backward compat with ImageUploader. */
  completedUrls: string[];
  /** Total files in the CURRENT batch only */
  totalCount: number | null;
  /** How many files in the current batch have succeeded or failed */
  batchSettledCount: number;
  /** Upload progress of the file currently being transferred (0–100) */
  progress: number | null;
  error: string | null;
  status: "idle" | "uploading" | "done" | "failed";
}

const initialState: UploadState = {
  completedImages: [],
  completedUrls: [],
  totalCount: null,
  batchSettledCount: 0,
  progress: null,
  error: null,
  status: "idle",
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── Start new batch ──────────────────────────────────────────────────
      .addCase(uploadActions.startBulk, (s, a) => {
        s.status = "uploading";
        s.progress = 0;
        s.error = null;
        // FIX: only count the current batch — not cumulative across sessions.
        // Original was: s.totalCount = s.completedUrls.length + newCount
        // which inflated totalCount and prevented status from ever reaching "done".
        s.totalCount = a.payload.length;
        s.batchSettledCount = 0;
        // completedUrls intentionally preserved across batches
      })

      // ── Per-file progress (current file only, 0–100) ─────────────────────
      .addCase(uploadActions.progress, (s, a) => {
        s.progress = Math.min(100, Math.max(0, a.payload));
      })

      // ── Single file succeeded ────────────────────────────────────────────
      .addCase(uploadActions.success, (s, a) => {
        s.completedImages.push(a.payload);
        s.completedUrls.push(a.payload.url);
        s.batchSettledCount += 1;
        s.progress = 100;
        // Mark done only when every file in this batch has settled
        if (s.totalCount !== null && s.batchSettledCount >= s.totalCount) {
          s.status = "done";
        }
      })

      // ── Single file failed ───────────────────────────────────────────────
      .addCase(uploadActions.failure, (s, a) => {
        s.batchSettledCount += 1;
        s.status = "failed";
        s.error = a.payload;
        s.progress = null;
      })

      // ── User aborted ─────────────────────────────────────────────────────
      .addCase(uploadActions.abort, (s) => {
        s.status = "idle";
        s.progress = null;
        s.error = null;
        s.totalCount = null;
        s.batchSettledCount = 0;
        // completedImages / completedUrls preserved — user keeps what already succeeded
      })

      // ── Remove a single URL (e.g. user deletes from preview) ─────────────
      .addCase(uploadActions.removeImage, (s, a) => {
        s.completedImages = s.completedImages.filter(
          (img) => img.url !== a.payload,
        );
        s.completedUrls = s.completedUrls.filter((url) => url !== a.payload);
      })

      // ── Seed with pre-existing images (edit page load) ────────────────────
      .addCase(uploadActions.preload, (s, a) => {
        const existingUrls = new Set(s.completedUrls);
        const fresh = a.payload.filter((img) => !existingUrls.has(img.url));
        s.completedImages = [...fresh, ...s.completedImages];
        s.completedUrls = [...fresh.map((img) => img.url), ...s.completedUrls];
      });
  },
});

export default uploadSlice.reducer;
