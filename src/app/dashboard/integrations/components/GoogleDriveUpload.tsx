import { ManageGoogleDrivePanel } from './ManageGoogleDrivePanel';
import {
  useFileUpload,
  FileUploadRootProvider,
  FileUpload,
  FileUploadDropzoneContent,
  Box,
} from '@chakra-ui/react';
import {
  ACCEPTED_TYPES,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
  TYPES_FILES,
} from '_components/custom/drag-drop/constant/constants';
import { BaseText, TextVariant } from '_components/custom';
import React from 'react';
import { useThemeColors } from '_theme/useThemeColors';

export const GoogleDriveUpload = ({ status }: { status: boolean }) => {
  const { hexToRGB } = useThemeColors();
  const fileUpload = useFileUpload({
    maxFiles: 5,
    maxFileSize: MAX_FILE_SIZE,
    accept: [...ACCEPTED_TYPES, 'application/pdf'],
  });

  return (
    <FileUploadRootProvider value={fileUpload}>
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone
        width={'full'}
        p={'3'}
        border={'none'}
        _hover={{ bg: 'none' }}
        _dragging={{
          borderColor: hexToRGB(500, 0.1),
          borderWidth: 0.1,
          border: 'dashed',
          bg: hexToRGB(500, 0.3),
          pointerEvents: 'auto',
        }}
        _dark={{
          _hover: {
            bg: 'none',
          },
        }}
      >
        <ManageGoogleDrivePanel clearFiles={() => fileUpload.clearFiles()} status={status} />
      </FileUpload.Dropzone>
    </FileUploadRootProvider>
  );
};
