export interface PresignedUrlParams {
  /** Matches backend DTO field `fileName`. */
  fileName: string;
  contentType: string;
  /** Optional key prefix, e.g. "properties/123". Defaults to "general" on the backend. */
  folder?: string;
}

export interface PresignedUrlResult {
  /** The S3-presigned PUT URL to upload directly to R2. */
  uploadUrl: string;
  /** The object key in the R2 bucket. */
  key: string;
  /** The public URL of the uploaded file. */
  publicUrl: string;
  /** Presign expiry in seconds. */
  expiresIn: number;
}
