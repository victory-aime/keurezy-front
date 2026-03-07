import { Box } from "@chakra-ui/react";
import { IBoxProps } from "_components/custom";

export const OnboardCardWrapper = ({ children, ...props }: IBoxProps) => {
  return (
    <Box
      border="1px solid"
      borderColor="inherit"
      borderRadius="xl"
      boxShadow="sm"
      p={4}
      {...props}
    >
      {children}
    </Box>
  );
};
