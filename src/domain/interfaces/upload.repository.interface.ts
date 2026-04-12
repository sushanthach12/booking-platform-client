import type { PresignedUrlParams, PresignedUrlResult } from "@/domain/entities";

export interface IUploadRepository {
  getPresignedUrl(params: PresignedUrlParams, signal?: AbortSignal): Promise<PresignedUrlResult>;
  uploadFile(
    uploadUrl: string,
    file: File,
    onProgress: (percentage: number) => void,
    signal?: AbortSignal,
  ): Promise<void>;
}
