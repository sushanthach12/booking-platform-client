import { createAction } from "@reduxjs/toolkit";

export const uploadActions = {
  startBulk: createAction<File[]>("upload/startBulk"),
  progress: createAction<number>("upload/progress"),
  success: createAction<string>("upload/success"),
  failure: createAction<string>("upload/failure"),
  abort: createAction("upload/abort"),
  removeImage: createAction<string>("upload/removeImage"),
};
