"use client";

import { HStack, IconButton } from "@chakra-ui/react";
import { Icons } from "_components/custom";
import { DataViewSwitchProps } from "./interface/data-types";

export const DataViewSwitcher = ({ mode, onChange }: DataViewSwitchProps) => {
  return (
    <HStack
      gap={2}
      border={"1px solid"}
      p={2}
      rounded={"full"}
      borderColor={"border"}
    >
      <IconButton
        aria-label={"Table view"}
        variant={mode === "table" ? "subtle" : "outline"}
        colorPalette={mode === "table" ? "purple" : "gray"}
        onClick={() => onChange("table")}
        border={"none"}
        rounded={"full"}
        size={"sm"}
        p={2}
      >
        <Icons.List />
        Liste
      </IconButton>
      <IconButton
        aria-label={"Grid view"}
        variant={mode === "grid" ? "subtle" : "outline"}
        onClick={() => onChange("grid")}
        colorPalette={mode === "grid" ? "purple" : "gray"}
        border={"none"}
        rounded={"full"}
        size={"sm"}
        p={2}
      >
        <Icons.Grid />
        Grille
      </IconButton>
    </HStack>
  );
};
