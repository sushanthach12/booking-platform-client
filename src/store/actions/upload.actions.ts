import type { IImageUploadMetadata } from "@/domain/entities/become-host.entity";
import { createAction } from "@reduxjs/toolkit";

export const uploadActions = {
  startBulk: createAction<File[]>("upload/startBulk"),
  progress: createAction<number>("upload/progress"),
  success: createAction<IImageUploadMetadata>("upload/success"),
  failure: createAction<string>("upload/failure"),
  abort: createAction("upload/abort"),
  removeImage: createAction<string>("upload/removeImage"),
  /** Seed Redux with pre-existing images (e.g. loaded from the edit page). */
  preload: createAction<IImageUploadMetadata[]>("upload/preload"),
};
