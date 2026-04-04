import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { UploadRepository } from "../../data/repositories/upload.repository";

@injectable()
export class UploadUseCase {
  constructor(
    @inject(UploadRepository)
    private readonly uploadRepository: UploadRepository,
  ) {}

  /**
   * Executes the full two-step upload for a single file:
   *  1. getPresignedUrl  → NestJS  → R2 presigned PUT URL
   *  2. uploadFile       → R2      → direct byte stream
   *
   * Returns the public URL to persist (e.g. store in DB / Redux state).
   *
   * NOTE: if you are calling this from a saga, prefer calling the
   * repository methods directly from the saga instead — it avoids this
   * extra layer. This use case is useful if you need to reuse the same
   * two-step logic outside of Redux (e.g. a standalone form, a hook, etc.)
   */
  async execute(
    file: File,
    onProgress: (percent: number) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    const { uploadUrl, publicUrl } =
      await this.uploadRepository.getPresignedUrl(
        { filename: file.name, contentType: file.type },
        signal,
      );

    await this.uploadRepository.uploadFile(uploadUrl, file, onProgress, signal);

    return publicUrl;
  }
}
