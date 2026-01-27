import { Status } from "@chakra-ui/react";
import React, { FC } from "react";

type colorPalette =
  | "transparent"
  | "current"
  | "black"
  | "white"
  | "whiteAlpha"
  | "blackAlpha"
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "cyan"
  | "purple"
  | "pink";

const getBadgeContent = (status?: string): { variant: colorPalette } => {
  switch (status) {
    case "WARNING":
      return { variant: "orange" };
    case "ERROR":
      return { variant: "red" };
    case "PAYMENT":
      return { variant: "teal" };
    case "INFO":
      return { variant: "blue" };
    default:
      return { variant: "teal" };
  }
};

export const BaseStatus: FC<{ status: string }> = ({ status }) => {
  const { variant: resolvedVariant } = getBadgeContent(status);

  return (
    <Status.Root size={"lg"} colorPalette={resolvedVariant}>
      <Status.Indicator />
    </Status.Root>
  );
};
