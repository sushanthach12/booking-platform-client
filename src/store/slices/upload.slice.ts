import { createSlice } from "@reduxjs/toolkit";
import { uploadActions } from "../actions/upload.actions";

interface UploadState {
  completedUrls: string[];
  totalCount: number | null;
  progress: number | null;
  error: string | null;
  status: "idle" | "uploading" | "done" | "failed";
}

const initialState: UploadState = {
  completedUrls: [],
  totalCount: null,
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
      .addCase(uploadActions.startBulk, (s, a) => {
        const newCount = a.payload.length;
        s.status = "uploading";
        s.progress = 0;
        s.error = null;
        s.totalCount = s.completedUrls.length + newCount;
      })
      .addCase(uploadActions.progress, (s, a) => {
        s.progress = a.payload;
      })
      .addCase(uploadActions.success, (s, a) => {
        s.completedUrls.push(a.payload);
        s.progress = 100;
        if (s.totalCount !== null && s.completedUrls.length >= s.totalCount) {
          s.status = "done";
        }
      })
      .addCase(uploadActions.failure, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
        s.progress = null;
      })
      .addCase(uploadActions.abort, (s) => {
        s.status = "idle";
        s.progress = null;
        s.error = null;
        s.totalCount = null;
      })
      .addCase(uploadActions.removeImage, (s, a) => {
        s.completedUrls = s.completedUrls.filter((url) => url !== a.payload);
      });
  },
});

export default uploadSlice.reducer;
