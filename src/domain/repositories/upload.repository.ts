import 'reflect-metadata';
import { injectable } from 'tsyringe';
import type {
  IUploadRepository,
  PresignedUrlParams,
  PresignedUrlResult,
} from '../interfaces/upload.repository.interface';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

@injectable()
export class UploadRepository implements IUploadRepository {
  /**
   * POST {API_BASE}/upload/presign
   * Body: { filename, contentType }
   * Response: { uploadUrl, publicUrl }
   *
   * Added: optional AbortSignal so the presign fetch can be cancelled
   * if the user aborts before the XHR even starts.
   */
  async getPresignedUrl(
    params: PresignedUrlParams,
    signal?: AbortSignal,
  ): Promise<PresignedUrlResult> {
    try {
      const res = await fetch(`${API_BASE}/upload/presign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: params.filename,
          contentType: params.contentType,
        }),
        signal, // abort propagates to the presign fetch too
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to get presigned URL: ${text}`);
      }

      return res.json() as Promise<PresignedUrlResult>;
    } catch (error) {
      // Re-throw AbortError as-is so the saga can identify it
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      throw new Error(`Failed to get presigned URL: ${error}`);
    }
  }

  /**
   * PUT the file directly to R2 using the presigned URL.
   *
   * Uses XMLHttpRequest instead of fetch so we get real byte-level
   * upload progress events (fetch does not expose upload progress).
   * Supports AbortSignal so in-flight uploads can be cancelled cleanly.
   */
  uploadFile(
    uploadUrl: string,
    file: File,
    onProgress: (percentage: number) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(100);
          resolve();
        } else {
          reject(
            new Error(
              `Upload failed with status ${xhr.status}: ${xhr.statusText}`,
            ),
          );
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new DOMException('Upload aborted', 'AbortError'));
      });

      if (signal) {
        if (signal.aborted) {
          reject(new DOMException('Upload aborted', 'AbortError'));
          return;
        }
        signal.addEventListener('abort', () => xhr.abort(), { once: true });
      }

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }
}
