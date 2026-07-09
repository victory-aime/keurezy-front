import React from 'react';

interface BaseUploadFilesProps {
  getFilesUploaded: (files: File[]) => void;
  label?: string | React.ReactNode;
  initialImageUrls?: string[];
  maxFiles?: number;
  maxFileSize?: number;
  messageInfo?: string;
}

interface MultipleFilesUploadProps extends BaseUploadFilesProps {
  showFilesList?: boolean;
}

interface UploadImageFileProps {
  getFileUploaded: (file: File | undefined) => void;
  avatarImage?: string;
  handleDeleteAvatar?: () => void;
  isReadOnly?: boolean;
  isLoading?: boolean;
  messageInfo?: string;
}

export type { MultipleFilesUploadProps, BaseUploadFilesProps, UploadImageFileProps };
