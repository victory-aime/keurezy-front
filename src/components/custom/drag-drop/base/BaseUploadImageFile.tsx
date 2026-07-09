import { CustomSkeletonLoader } from '_components/custom';
import { FileUpload, Flex } from '@chakra-ui/react';
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from '../constant/constants';
import { VariablesColors } from '_theme/variables';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { UploadImageFile } from '../UploadImageFile';
import { UploadImageFileProps } from '../interface/upload';
import React from 'react';

export const BaseUploadImageFile = ({
  getFileUploaded,
  avatarImage,
  isLoading,
  isReadOnly,
  handleDeleteAvatar,
  messageInfo,
}: UploadImageFileProps) => {
  return (
    <React.Fragment>
      {isLoading ? (
        <CustomSkeletonLoader type="IMAGE" width={'full'} height={'150px'} />
      ) : (
        <FileUpload.Root
          maxFiles={1}
          maxFileSize={MAX_FILE_SIZE}
          accept={ACCEPTED_TYPES}
          disabled={isReadOnly}
        >
          <FileUpload.HiddenInput />
          <UploadImageFile
            getFileUploaded={getFileUploaded}
            avatarImage={avatarImage}
            handleDeleteAvatar={handleDeleteAvatar}
            isReadOnly={isReadOnly}
          />
          {messageInfo && (
            <Flex gap={2} alignItems={'center'} color={VariablesColors.red}>
              <HiOutlineInformationCircle size={18} />
              {messageInfo}
            </Flex>
          )}
        </FileUpload.Root>
      )}
    </React.Fragment>
  );
};
