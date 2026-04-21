'use client';

import { Center } from '@chakra-ui/react';
import { BaseModal, DeleteModalActions, Icons } from '_components/custom';
import React, { FC, useEffect, useState } from 'react';
import { DeleteLottie } from '_lottie/animations/LottieAnimation';

export const DeleteModalAnimation: FC<DeleteModalActions> = ({
  isOpen,
  onChange,
  isLoading,
  title = 'title',
  children,
  callback,
  ignoreFooter = true,
  buttonSaveTitle = 'COMMON.VALIDATE',
  size = 'sm',
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (isLoading) {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        onChange(false);
      }, 2200);
    }
  }, [isLoading, isOpen, onChange]);

  return (
    <BaseModal
      icon={<Icons.Trash />}
      size={size}
      title={title}
      isOpen={isOpen}
      onChange={onChange}
      modalType={'alertdialog'}
      ignoreFooter={ignoreFooter}
      isLoading={isLoading}
      onClick={callback}
      buttonSaveTitle={buttonSaveTitle}
    >
      {showAnimation ? (
        <Center>
          <DeleteLottie />
        </Center>
      ) : (
        <>{children}</>
      )}
    </BaseModal>
  );
};
