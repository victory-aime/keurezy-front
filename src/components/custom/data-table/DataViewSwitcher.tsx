"use client";

import {
  Box,
  HStack,
  IconButton,
  Separator,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { CustomSkeletonLoader, Icons } from "_components/custom";
import { DataViewSwitchProps } from "./interface/data-types";

export const DataViewSwitcher = ({
  mode,
  onChange,
  isLoading,
}: DataViewSwitchProps & { isLoading?: boolean }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  /** ✅ Forcer grid en mobile juste une fois ensuite
   * laisser le user
   * changer de mode a sa guise */
  useEffect(() => {
    if (isMobile && mode !== "grid") {
      onChange("grid");
    }
  }, [isMobile]);

  return (
    <>
      {isLoading ? (
        <Box mt={5}>
          <CustomSkeletonLoader
            type="BUTTON"
            colorButton="primary"
            numberOfLines={1}
          />
        </Box>
      ) : (
        <HStack border="1px solid" p={2} rounded="full" borderColor="border">
          <IconButton
            aria-label="Table view"
            variant={mode === "table" ? "subtle" : "outline"}
            colorPalette={mode === "table" ? "purple" : "gray"}
            onClick={() => onChange("table")}
            border="none"
            rounded="full"
            size="sm"
            p={2}
          >
            <Icons.List />
            Liste
          </IconButton>

          <Separator height="4" orientation="vertical" />

          <IconButton
            aria-label="Grid view"
            variant={mode === "grid" ? "subtle" : "outline"}
            onClick={() => onChange("grid")}
            colorPalette={mode === "grid" ? "purple" : "gray"}
            border="none"
            rounded="full"
            size="sm"
            p={2}
          >
            <Icons.Grid />
            Grille
          </IconButton>
        </HStack>
      )}
    </>
  );
};
