import { call, put, take, race, cancelled } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { PayloadAction } from '@reduxjs/toolkit';
import { container } from '@/domain/di/container';
import { UploadUseCase } from '@/domain/use-cases/upload.use-case';
import { uploadActions } from '../store/actions/upload.actions';
import { createUploadChannel } from '../store/channels/upload.channel';
import { UploadEmitter } from '@/lib/uploadEmitter';

function* handleUpload(file: File): SagaIterator {
  // Resolve the UseCase from the container
  const uploadUseCase = container.resolve(UploadUseCase);

  // 1. Kick off upload via UseCase
  const emitter: UploadEmitter = yield call([uploadUseCase, uploadUseCase.execute], file);

  // 2. Bridge emitter → saga channel
  const channel: ReturnType<typeof createUploadChannel> = yield call(createUploadChannel, emitter);

  try {
    while (true) {
      // 3. Race between channel events and an abort action
      const { event, abort } = yield race({
        event: take(channel),
        abort: take(uploadActions.abort),
      });

      if (abort) {
        channel.close();
        // Note: The UseCase should ideally handle cancellation if we passed an AbortSignal
        // For now, we close the channel which stops the saga loop
        return;
      }

      if (event.type === 'progress') {
        yield put(uploadActions.progress(event.payload));
      }
      if (event.type === 'done') {
        yield put(uploadActions.success(event.payload));
        break;
      }
      if (event.type === 'error') {
        yield put(uploadActions.failure(event.payload));
        break;
      }
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

export function* uploadWatcher(): SagaIterator {
  while (true) {
    const action: PayloadAction<File> = yield take(uploadActions.start);
    yield call(handleUpload, action.payload);
  }
}
