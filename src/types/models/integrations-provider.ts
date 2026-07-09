interface ListedFileResult {
  fileId: string;
  name: string;
  webViewLink: string;
  mimeType?: string;
  size?: string;
  modifiedTime?: string;
}

export type { ListedFileResult };
