import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { VariablesColors } from '_theme/variables';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { MultipleFilesUpload } from '../MultipleFilesUpload';
import React from 'react';

export const BaseUploadMultipleFiles = ({
  getFilesUploaded,
  initialImageUrls,
  messageInfo,
  label,
  showFilesList,
}: {
  getFilesUploaded: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  label?: string | ReactNode;
  messageInfo?: string;
  initialImageUrls?: string[];
  showFilesList?: boolean;
}) => {
  return (
    <React.Fragment>
      <MultipleFilesUpload
        label={label}
        getFilesUploaded={getFilesUploaded}
        showFilesList={showFilesList}
        initialImageUrls={initialImageUrls}
      />
      {messageInfo && (
        <Flex gap={2} fontSize={'sm'} alignItems={'center'} color={VariablesColors.info}>
          <HiOutlineInformationCircle size={18} />
          {messageInfo}
        </Flex>
      )}
    </React.Fragment>
  );
};
