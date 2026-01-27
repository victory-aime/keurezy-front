import { Flex, FlexProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const BaseIcon: FC<FlexProps> = ({
  children,
  color = "primary.500",
  ...rest
}) => {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      bgColor={color}
      color={"white"}
      borderRadius={"7px"}
      boxSize={rest?.boxSize ?? "40px"}
      {...rest}
    >
      {children}
    </Flex>
  );
};
