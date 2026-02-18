"use client";

import { Tooltip, Portal } from "@chakra-ui/react";
import { SideToolTipProps } from "../types";

export const SideToolTip = ({
  children,
  label,
  placement = "right",
  disabled = false,
}: SideToolTipProps) => {
  return (
    <Tooltip.Root positioning={{ placement }} disabled={disabled}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>{label}</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
};
