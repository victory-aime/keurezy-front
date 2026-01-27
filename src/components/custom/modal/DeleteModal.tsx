"use client";

import { Center } from "@chakra-ui/react";
import { BaseModal, DeleteModalActions } from "_components/custom";
import React, { FC, useEffect, useState } from "react";
import { DeleteLottie } from "_lottie/animations/LottieAnimation";
import { VariablesColors } from "_theme/variables";
import { FaTrashAlt } from "react-icons/fa";

export const DeleteModalAnimation: FC<DeleteModalActions> = ({
  isOpen,
  onChange,
  isLoading,
  title = "title",
  children,
  callback,
  ignoreFooter = true,
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
      icon={<FaTrashAlt color={VariablesColors.white} />}
      title={title}
      isOpen={isOpen}
      onChange={onChange}
      modalType={"alertdialog"}
      ignoreFooter={ignoreFooter}
      isLoading={isLoading}
      onClick={callback}
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
