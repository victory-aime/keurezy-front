import { IconButton } from "@chakra-ui/react";
import React from "react";
import { SwitchColorMode } from "./SwitchColorMode";
import { useColorMode } from "_components/ui/color-mode";

export const FloatSwitchColorMode = () => {
  const { toggleColorMode } = useColorMode();
  return (
    <IconButton
      position="fixed"
      bottom="45px"
      right="16px"
      zIndex="1000"
      onClick={toggleColorMode}
      aria-label="change color-mode"
      borderRadius="50px"
      animation={"bounce"}
      _hover={{
        transform: "scale(1.1)",
        transition: "transform 0.2s ease-in-out",
        filter: "brightness(1.2)",
      }}
    >
      <SwitchColorMode hideIcon />
    </IconButton>
  );
};
