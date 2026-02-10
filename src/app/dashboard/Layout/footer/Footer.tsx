import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { LinkFooter } from "./LinkFooter";
import { footerStyles } from "../styles";

export const Footer = () => {
  return (
    <Flex {...footerStyles}>
      <Text color={"white"} fontWeight={"800"}>
        HIBLY {new Date().getFullYear()} ©
      </Text>
      <Box pos={"fixed"} right={"20px"}>
        <LinkFooter />
      </Box>
    </Flex>
  );
};
