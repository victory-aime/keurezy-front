import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Circle,
  FileUpload,
  Float,
  For,
  useFileUploadContext,
  VStack,
} from '@chakra-ui/react';
import { useFileUploadErrors } from './useFileUploadErrors';
import { convertUrlsToFiles } from 'rise-core-frontend';
import { BaseRatio } from '_components/custom';
import { HiX } from 'react-icons/hi';
import { UploadImageFileProps } from './interface/upload';

export const UploadImageFile = ({
  getFileUploaded,
  avatarImage,
  handleDeleteAvatar,
  isReadOnly,
}: UploadImageFileProps) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const fileUpload = useFileUploadContext();
  const { error, errorType } = useFileUploadErrors({
    onValidFiles: (files) => getFileUploaded(files[0] || undefined),
  });

  useEffect(() => {
    if (avatarImage && fileUpload.acceptedFiles.length === 0) {
      convertUrlsToFiles(avatarImage).then((file) => {
        fileUpload.setFiles([...file]);
      });
    }
  }, [avatarImage]);

  useEffect(() => {
    if (fileUpload.acceptedFiles.length > 0) {
      setIsImageDeleted(false);
      const file = fileUpload.acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(undefined);
    }
  }, [fileUpload.acceptedFiles]);

  const handleDeleteImage = () => {
    fileUpload.setFiles([]);
    getFileUploaded(undefined);
    setPreviewUrl(undefined);
    setIsImageDeleted(true);
    handleDeleteAvatar?.();
  };

  return (
    <VStack w="full" align="center" justify="center">
      <Box pos="relative" width="full" overflow="hidden">
        <FileUpload.Trigger asChild>
          <BaseRatio
            _disabled={{
              opacity: isReadOnly ? 0.6 : 1,
              cursor: isReadOnly ? 'not-allowed' : 'none',
            }}
            cursor="pointer"
            colorPalette={(previewUrl || avatarImage) && !isImageDeleted ? 'green' : 'none'}
            image={
              !isImageDeleted
                ? previewUrl ||
                  (avatarImage?.trim() ? avatarImage : '/assets/images/placeholder-image.png')
                : '/assets/images/placeholder-image.png'
            }
          />
        </FileUpload.Trigger>

        {!isImageDeleted && fileUpload?.acceptedFiles?.length > 0 && (
          <For each={fileUpload?.acceptedFiles}>
            {(file, index) => (
              <FileUpload.ItemGroup key={index}>
                {isReadOnly ? null : (
                  <Float placement="bottom-end" offsetX="3" offsetY="3" key={file.name}>
                    <FileUpload.Item
                      rounded="full"
                      bg="red.500"
                      p="1"
                      borderColor="none"
                      width="auto"
                      file={file}
                      pos="relative"
                    >
                      <FileUpload.ItemDeleteTrigger>
                        <HiX color="white" />
                      </FileUpload.ItemDeleteTrigger>
                    </FileUpload.Item>
                  </Float>
                )}
              </FileUpload.ItemGroup>
            )}
          </For>
        )}
        {(previewUrl || avatarImage) && !isImageDeleted && (
          <>
            {isReadOnly ? null : (
              <Float
                placement="bottom-end"
                offsetX="3"
                offsetY="3"
                key={'image'}
                cursor={'pointer'}
              >
                <Circle
                  bg="red.500"
                  p="1"
                  borderColor="none"
                  width="auto"
                  onClick={handleDeleteImage}
                >
                  <HiX color="white" />
                </Circle>
              </Float>
            )}
          </>
        )}
      </Box>

      {error && (
        <Alert.Root status="error" mt={5} p={4} width="full">
          <Alert.Indicator />
          <Alert.Content>
            {errorType === 'max_file'
              ? t('DRAG_DROP.ERROR.MAX_FILES_TITLE')
              : errorType === 'size'
                ? t('DRAG_DROP.ERROR.MAX_SIZES_TITLE')
                : t('DRAG_DROP.ERROR.TYPE_FILES_TITLE')}
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </VStack>
  );
};
