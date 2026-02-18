import { BoxProps, Box } from "@chakra-ui/react";
import React, { FC } from "react";

interface SidebarInsetProps extends BoxProps {
  variant?: "default" | "inset";
  collapsed?: boolean;
}

export const SidebarInset: FC<SidebarInsetProps> = React.forwardRef(
  ({ variant = "default", collapsed = false, ...props }, ref) => {
    const isInset = variant === "inset";

    return (
      <Box
        as="main"
        ref={ref}
        position="relative"
        display="flex"
        flexDirection="column"
        flex="1"
        minH="100svh"
        ml={{
          base: 0,
          md: collapsed ? "80px" : "220px",
          lg: collapsed ? "80px" : "230px",
        }}
        transition="margin 0.2s ease"
        bg="white"
        {...(isInset && {})}
        {...props}
      />
    );
  },
);

SidebarInset.displayName = "SidebarInset";
