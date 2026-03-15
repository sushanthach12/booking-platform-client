import { createSlice } from '@reduxjs/toolkit';
import { uploadActions } from '../actions/upload.actions';

interface UploadState {
  progress: number | null;
  key: string | null;
  error: string | null;
  status: 'idle' | 'uploading' | 'done' | 'failed';
}

const initialState: UploadState = {
  progress: null,
  key: null,
  error: null,
  status: 'idle',
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadActions.start, (s) => {
        s.status = 'uploading';
        s.progress = 0;
        s.error = null;
        s.key = null;
      })
      .addCase(uploadActions.progress, (s, a) => {
        s.progress = a.payload;
      })
      .addCase(uploadActions.success, (s, a) => {
        s.status = 'done';
        s.key = a.payload;
        s.progress = 100;
      })
      .addCase(uploadActions.failure, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
        s.progress = null;
      })
      .addCase(uploadActions.abort, (s) => {
        s.status = 'idle';
        s.progress = null;
        s.error = null;
      });
  },
});

export default uploadSlice.reducer;
