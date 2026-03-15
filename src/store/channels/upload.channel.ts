import { UploadEmitter } from '@/lib/uploadEmitter';
import { eventChannel, END, EventChannel } from 'redux-saga';

type UploadEvent =
  | { type: 'progress'; payload: number }
  | { type: 'done';     payload: string }
  | { type: 'error';    payload: string };

export function createUploadChannel(emitter: UploadEmitter): EventChannel<UploadEvent> {
  return eventChannel((emit) => {
    emitter.addEventListener('progress', (e) =>
      emit({ type: 'progress', payload: (e as CustomEvent<number>).detail })
    );

    emitter.addEventListener('done', (e) => {
      emit({ type: 'done', payload: (e as CustomEvent<string>).detail });
      emit(END);
    });

    emitter.addEventListener('error', (e) => {
      emit({ type: 'error', payload: (e as CustomEvent<Error>).detail.message });
      emit(END);
    });

    return () => {
      // Teardown logic if needed
    };
  });
}
