import { uploadPresignUrl } from "@/domain/constants/api.constant";
import type { PresignedUrlParams, PresignedUrlResult } from "@/domain/entities";
import type { IUploadRepository } from "@/domain/interfaces";
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
    try {
      const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(uploadPresignUrl(), {
        method: "POST",
        headers,
        body: JSON.stringify({
          fileName: params.fileName,
          contentType: params.contentType,
          ...(params.folder ? { folder: params.folder } : {}),
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
      if (error instanceof DOMException && error.name === "AbortError") {
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
