export class UploadEmitter extends EventTarget {
  progress(percent: number) {
    this.dispatchEvent(new CustomEvent('progress', { detail: percent }));
  }

  done(url: string) {
    this.dispatchEvent(new CustomEvent('done', { detail: url }));
  }

  error(err: Error) {
    this.dispatchEvent(new CustomEvent('error', { detail: err }));
  }
}
