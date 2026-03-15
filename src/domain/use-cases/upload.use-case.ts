import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";
import type { IUploadRepository } from "../interfaces/upload.repository.interface";

export interface UploadCallbacks {
  onProgress?: (percent: number) => void;
}

@injectable()
export class UploadUseCase {
  constructor(
    @inject(TOKENS.IUploadRepository)
    private repo: IUploadRepository,
  ) {}

  async execute(
    file: File,
    callbacks?: UploadCallbacks,
    signal?: AbortSignal,
  ): Promise<string> {
    const { uploadUrl, publicUrl } = await this.repo.getPresignedUrl({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
    });

    await this.repo.uploadFile(
      uploadUrl,
      file,
      (progress) => callbacks?.onProgress?.(progress),
      signal,
    );

    return publicUrl;
  }
}
