import { uploadPresignUrl } from "@/domain/constants/api.constant";
import type { PresignedUrlParams, PresignedUrlResult } from "@/domain/entities";
import type { IUploadRepository } from "@/domain/interfaces";
import { request } from "@/domain/http";
import { COOKIE_KEYS, getCookie } from "@/lib/utils/cookies";
import "reflect-metadata";
import { injectable } from "tsyringe";

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
    const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // The presign endpoint returns the result un-enveloped. `request` already
    // re-throws AbortError untouched so the saga can identify cancellations.
    return request<PresignedUrlResult>(uploadPresignUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify({
        fileName: params.fileName,
        contentType: params.contentType,
        ...(params.folder ? { folder: params.folder } : {}),
      }),
      signal, // abort propagates to the presign fetch too
      auth: false,
      fallbackMessage: "Failed to get presigned URL",
    });
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

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
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

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new DOMException("Upload aborted", "AbortError"));
      });

      if (signal) {
        if (signal.aborted) {
          reject(new DOMException("Upload aborted", "AbortError"));
          return;
        }
        signal.addEventListener("abort", () => xhr.abort(), { once: true });
      }

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  }
}
