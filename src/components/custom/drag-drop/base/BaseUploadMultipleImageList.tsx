import {
  MAX_FILE_SIZE_MB,
  MAX_FILES,
  TYPES_FILES,
} from '_components/custom/drag-drop/constant/constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  FileUpload,
  FileUploadDropzone,
  FileUploadDropzoneContent,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { BaseText, TextVariant } from '_components/custom';
import { LuUpload } from 'react-icons/lu';
import { VariablesColors } from '_theme/variables';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { BaseUploadFilesProps } from '../interface/upload';
import { MultipleFileImageList } from '_components/custom/drag-drop/MultipleFileImageList';

export const BaseUploadMultipleImageList = ({
  getFilesUploaded,
  initialImageUrls,
  maxFiles = MAX_FILES,
  label,
  messageInfo,
  isError = false,
}: BaseUploadFilesProps & {
  isError?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <FileUpload.HiddenInput />
      {label === 'string' ? <BaseText fontSize={'sm'}>{label}</BaseText> : label}
      <FileUploadDropzone _hover={{ borderColor: 'primary.500' }} width={'full'}>
        <Icon fontSize="xl" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUploadDropzoneContent>
          <BaseText color={'fg.muted'} variant={TextVariant.S}>
            {t('DRAG_DROP.TITLE')}
          </BaseText>
          <BaseText color="fg.subtle">
            {t('DRAG_DROP.DESC', {
              max_size: MAX_FILE_SIZE_MB,
              type_files: TYPES_FILES,
            })}
          </BaseText>
          <BaseText color="fg.subtle" variant={TextVariant.S}>
            {t('DRAG_DROP.FILES_NUMBER', { max_files: maxFiles })}
          </BaseText>
        </FileUploadDropzoneContent>
      </FileUploadDropzone>
      {messageInfo && (
        <Flex
          gap={2}
          fontSize={'sm'}
          alignItems={'center'}
          color={isError ? 'red' : VariablesColors.info}
        >
          <HiOutlineInformationCircle size={18} />
          {messageInfo}
        </Flex>
      )}
      <MultipleFileImageList
        getFilesUploaded={getFilesUploaded}
        initialImageUrls={initialImageUrls}
      />
    </React.Fragment>
  );
};
