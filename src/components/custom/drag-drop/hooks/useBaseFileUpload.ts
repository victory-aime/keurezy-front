import { useFileUpload, type UseFileUploadProps } from '@chakra-ui/react';
import { ACCEPTED_TYPES, MAX_FILES, MAX_FILE_SIZE } from '../constant/constants';

const DEFAULT_FILE_UPLOAD_OPTIONS: UseFileUploadProps = {
  maxFiles: MAX_FILES,
  maxFileSize: MAX_FILE_SIZE,
  accept: [...ACCEPTED_TYPES, 'application/pdf', 'application/octet-stream'],
};

export const useBaseFileUpload = (options?: Partial<UseFileUploadProps>) => {
  return useFileUpload({
    ...DEFAULT_FILE_UPLOAD_OPTIONS,
    ...options,
  });
};
