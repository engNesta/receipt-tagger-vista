
export interface UploadRequest {
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileData: string; // base64 encoded
}

export interface AzureConfig {
  accountName: string;
  accountKey: string;
  endpointSuffix: string;
}
