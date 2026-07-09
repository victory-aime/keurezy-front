import { useEffect } from 'react';
import {
  Alert,
  Button,
  FileUpload,
  HStack,
  Stack,
  useFileUploadContext,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useFileUploadErrors } from '_components/custom/drag-drop/useFileUploadErrors';
import { convertUrlsToFiles } from 'rise-core-frontend';
import { BaseText, TextVariant } from '_components/custom';
import { HiUpload, HiX } from 'react-icons/hi';
import { VariablesColors } from '_theme/variables';
import { MultipleFilesUploadProps } from './interface/upload';

export const MultipleFilesUpload = ({
  getFilesUploaded,
  label,
  initialImageUrls,
  showFilesList = true,
}: MultipleFilesUploadProps) => {
  const { acceptedFiles, setFiles } = useFileUploadContext();
  const { t } = useTranslation();
  const { error, errorType } = useFileUploadErrors({
    onValidFiles: getFilesUploaded,
  });

  useEffect(() => {
    if (initialImageUrls && initialImageUrls.length > 0 && acceptedFiles.length === 0) {
      const test = async () =>
        await convertUrlsToFiles(initialImageUrls).then((files) => {
          setFiles([...files]);
        });
      test();
    }
  }, [initialImageUrls]);

  return (
    <VStack alignItems={'flex-start'} mt={1} gap={4} width={'full'}>
      {label === 'string' ? <BaseText fontSize={'sm'}>{label}</BaseText> : label}

      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button borderRadius={'7px'} variant="outline" size="sm" width={'full'}>
          <HiUpload /> Ajouter vos fichiers
        </Button>
      </FileUpload.Trigger>

      {acceptedFiles.length > 0 && showFilesList && (
        <HStack wrap={'wrap'} width={'full'} gap={3}>
          {acceptedFiles.map((file, index) => (
            <FileUpload.ItemGroup key={index} asChild>
              <FileUpload.Item
                p={2}
                borderRadius={'7px'}
                width="full"
                key={file.name}
                file={file}
                pos="relative"
              >
                <HStack alignItems={'center'} width={'full'} justifyContent={'space-between'}>
                  <Stack gap={0.4}>
                    {file.name}
                    {file.size && (
                      <BaseText variant={TextVariant.XS} color="fg.muted" fontFamily="mono">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </BaseText>
                    )}
                  </Stack>
                  <FileUpload.ItemDeleteTrigger p="0.5" rounded="full" bg="red.500">
                    <HiX color={VariablesColors.white} />
                  </FileUpload.ItemDeleteTrigger>
                </HStack>
              </FileUpload.Item>
            </FileUpload.ItemGroup>
          ))}
        </HStack>
      )}

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
    </VStack>
  );
};
