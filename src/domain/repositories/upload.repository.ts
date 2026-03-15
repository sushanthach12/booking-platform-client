import 'reflect-metadata';
import { injectable } from 'tsyringe';
import type {
  IUploadRepository,
  PresignedUrlParams,
  PresignedUrlResult,
} from '../interfaces/upload.repository.interface';

// Backend API base — set NEXT_PUBLIC_API_URL in your .env.local
// e.g. http://localhost:8000
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

@injectable()
export class UploadRepository implements IUploadRepository {
  /**
   * POST {API_BASE}/upload/presign
   * Body: { filename, contentType }
   * Response: { uploadUrl, publicUrl }
   *
   * The backend holds R2 credentials and generates the presigned PUT URL.
   * No secrets are needed in the frontend.
   */
  async getPresignedUrl(
    params: PresignedUrlParams,
  ): Promise<PresignedUrlResult> {
    try {
      const res = await fetch(`${API_BASE}/upload/presign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: params.filename,
          contentType: params.contentType,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to get presigned URL: ${text}`);
      }

      return res.json() as Promise<PresignedUrlResult>;
    } catch (error) {
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

      // Track upload progress
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

      // Wire AbortSignal to xhr.abort()
      if (signal) {
        if (signal.aborted) {
          reject(new DOMException('Upload aborted', 'AbortError'));
          return;
        }
        signal.addEventListener('abort', () => xhr.abort(), { once: true });
      }

      xhr.open('PUT', uploadUrl);
      // R2 presigned URLs expect the exact Content-Type that was used when signing
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }
}
