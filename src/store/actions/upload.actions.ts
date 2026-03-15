import { createAction } from '@reduxjs/toolkit';

export const uploadActions = {
  start:    createAction<File>('upload/start'),
  progress: createAction<number>('upload/progress'),
  success:  createAction<string>('upload/success'),
  failure:  createAction<string>('upload/failure'),
  abort:    createAction('upload/abort'),
};
