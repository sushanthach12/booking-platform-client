import { all, fork } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { uploadWatcher } from "./upload.saga";

export function* rootSaga(): SagaIterator {
  yield all([fork(uploadWatcher)]);
}
