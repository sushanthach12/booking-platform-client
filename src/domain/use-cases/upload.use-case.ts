import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";
import type { IUploadRepository } from "../interfaces/upload.repository.interface";
import { UploadEmitter } from "@/lib/uploadEmitter";

@injectable()
export class UploadUseCase {
  constructor(
    @inject(TOKENS.IUploadRepository)
    private repo: IUploadRepository
  ) {}

  async execute(file: File): Promise<UploadEmitter> {
    const emitter = new UploadEmitter();

    // Start the upload process in the background
    this.processUpload(file, emitter).catch((error) => {
      emitter.error(error);
    });

    return emitter;
  }

  private async processUpload(file: File, emitter: UploadEmitter) {
    try {
      // 1. Get presigned URL
      const { uploadUrl, publicUrl } = await this.repo.getPresignedUrl({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      });

      // 2. Perform upload to R2
      await this.repo.uploadFile(
        uploadUrl,
        file,
        (progress) => {
          emitter.progress(progress);
        }
      );

      // 3. Signal completion
      emitter.done(publicUrl);
    } catch (error: any) {
      emitter.error(error);
    }
  }
}
