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
