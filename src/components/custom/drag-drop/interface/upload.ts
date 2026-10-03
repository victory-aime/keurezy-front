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
  /** Proportions de l'aperçu (16/9 par défaut ; 1 pour un logo) */
  ratio?: number;
  /** Image entière, sans recadrage (logo) */
  contain?: boolean;
  showBorder?: boolean;
}

export type { MultipleFilesUploadProps, BaseUploadFilesProps, UploadImageFileProps };
