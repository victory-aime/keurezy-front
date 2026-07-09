import {
  Alert,
  Box,
  FileUpload,
  FileUploadItemPreviewImage,
  Float,
  HStack,
  useFileUploadContext,
} from '@chakra-ui/react';
import { useFileUploadErrors } from './useFileUploadErrors';
import { useEffect } from 'react';
import { convertUrlsToFiles } from 'rise-core-frontend';
import { HiX } from 'react-icons/hi';
import { VariablesColors } from '_theme/variables';
import { BaseUploadFilesProps } from './interface/upload';
import { useTranslation } from 'react-i18next';

export const MultipleFileImageList = ({
  getFilesUploaded,
  initialImageUrls,
}: BaseUploadFilesProps) => {
  const { acceptedFiles, setFiles } = useFileUploadContext();
  const { t } = useTranslation();
  const { error, errorType } = useFileUploadErrors({
    onValidFiles: getFilesUploaded,
  });

  useEffect(() => {
    if (initialImageUrls && initialImageUrls.length > 0 && acceptedFiles.length === 0) {
      convertUrlsToFiles(initialImageUrls).then((files) => {
        setFiles([...files]);
      });
    }
  }, [initialImageUrls]);

  return (
    <Box w={'full'}>
      <HStack width={'full'} justifyContent={'flex-start'} wrap="wrap" gap="3">
        {acceptedFiles.map((file, index) => (
          <FileUpload.ItemGroup key={index} asChild>
            <FileUpload.Item p="2" width="auto" key={file.name} file={file} pos="relative">
              <Float>
                <FileUpload.ItemDeleteTrigger p="0.5" rounded="l1" bg="red.500" borderWidth="1px">
                  <HiX color={VariablesColors.white} />
                </FileUpload.ItemDeleteTrigger>
              </Float>
              <FileUploadItemPreviewImage boxSize="120px" objectFit="cover" />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        ))}
      </HStack>
      {error && (
        <Alert.Root status="error" mt={5} p={4} width={'full'}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              {errorType === 'max_file'
                ? t('DRAG_DROP.ERROR.MAX_FILES_TITLE')
                : errorType === 'size'
                  ? t('DRAG_DROP.ERROR.MAX_SIZES_TITLE')
                  : t('DRAG_DROP.ERROR.TYPE_FILES_TITLE')}
            </Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </Box>
  );
};
