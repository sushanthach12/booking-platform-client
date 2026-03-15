export interface PresignedUrlParams {
  filename: string;
  contentType: string;
}

export interface PresignedUrlResult {
  /** The S3-presigned PUT URL to upload directly to R2. */
  uploadUrl: string;
  /** The final public URL of the file after upload. */
  publicUrl: string;
}

export interface IUploadRepository {
  /**
   * Ask the backend to generate a presigned PUT URL for a single file.
   * No R2 credentials are needed in the frontend.
   */
  getPresignedUrl(params: PresignedUrlParams): Promise<PresignedUrlResult>;

  /**
   * Upload a file directly to R2 using the presigned URL.
   *
   * @param uploadUrl - Presigned PUT URL from getPresignedUrl()
   * @param file      - The File object to upload
   * @param onProgress - Called with 0–100 as bytes are sent
   * @param signal    - Optional AbortSignal to cancel the upload
   */
  uploadFile(
    uploadUrl: string,
    file: File,
    onProgress: (percentage: number) => void,
    signal?: AbortSignal
  ): Promise<void>;
}
