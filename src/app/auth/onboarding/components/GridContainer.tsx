import { Grid, GridProps } from "@chakra-ui/react";

export const GridContainer = ({ children, ...props }: GridProps) => {
  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      gap={8}
      maxW="6xl"
      mx="auto"
      alignItems="start"
      {...props}
    >
      {children}
    </Grid>
  );
};
