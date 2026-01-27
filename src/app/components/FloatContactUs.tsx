"use client";

import { IconButton } from "@chakra-ui/react";
import React from "react";
import ThinkBoxModal from "_component/ThinkBoxModal";
import { UserModule } from "_store/state-management";
import { ModalOpenProps } from "_components/custom";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export const FloatContactUs = ({ isOpen, onChange }: ModalOpenProps) => {
  const { data: currentUser } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });

  return (
    <>
      <IconButton
        position="fixed"
        bottom="70px"
        right="16px"
        zIndex="1000"
        onClick={() => onChange(!isOpen)}
        aria-label="change color-mode"
        borderRadius="50px"
        animation={`fadeIn`}
        bgColor={"info.500"}
        _hover={{
          transform: "scale(1.1)",
          transition: "transform 0.2s ease-in-out",
          filter: "brightness(1.2)",
        }}
      >
        <IoChatbubbleEllipsesOutline color={"white"} />
      </IconButton>
      <ThinkBoxModal onChange={onChange} isOpen={isOpen} data={currentUser} />
    </>
  );
};
