import { Box } from "@chakra-ui/react";
import { IBoxProps } from "_components/custom";

export const OnboardCardWrapper = ({ children, ...props }: IBoxProps) => {
  return (
    <Box
      bg={"white"}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      boxShadow="sm"
      p={4}
      {...props}
    >
      {children}
    </Box>
  );
};
