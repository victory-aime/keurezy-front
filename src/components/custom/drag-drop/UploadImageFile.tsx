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
import { BaseRatio } from '_components/custom';
import { HiX } from 'react-icons/hi';
import { UploadImageFileProps } from './interface/upload';

export const UploadImageFile = ({
  getFileUploaded,
  avatarImage,
  handleDeleteAvatar,
  isReadOnly,
  ratio,
  contain,
}: UploadImageFileProps) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const fileUpload = useFileUploadContext();
  const { error, errorType } = useFileUploadErrors({
    onValidFiles: (files) => getFileUploaded(files[0] || undefined),
  });

  // L'image enregistrée (`avatarImage`) s'affiche telle quelle : la convertir en fichier la
  // ferait renvoyer comme un nouveau fichier à chaque enregistrement.
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
            ratio={ratio}
            bg={contain ? 'bg.subtle' : undefined}
            rounded="7px"
            transition="box-shadow 0.2s, transform 0.2s"
            _hover={{ boxShadow: 'md' }}
            _motionReduce={{ transition: 'none' }}
            style={contain ? { objectFit: 'contain', padding: '12px' } : undefined}
            colorPalette={(previewUrl || avatarImage) && !isImageDeleted ? 'success' : 'none'}
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
                      bg="danger.solid"
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
        {/* Retrait de l'image enregistrée : seulement si l'écran sait la supprimer */}
        {(previewUrl || (avatarImage && handleDeleteAvatar)) && !isImageDeleted && (
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
                  bg="danger.solid"
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
