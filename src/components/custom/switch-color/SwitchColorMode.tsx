import React from "react";
import { Switch } from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useColorMode } from "_components/ui/color-mode";

export const SwitchColorMode = ({
  hideIcon = false,
}: {
  hideIcon?: boolean;
}) => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Switch.Root
      checked={colorMode === "dark"}
      onCheckedChange={toggleColorMode}
      display={"flex"}
    >
      {!hideIcon ? (
        <>
          <LuSun />
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <LuMoon />
        </>
      ) : (
        <>{colorMode === "dark" ? <LuSun /> : <LuMoon />}</>
      )}
    </Switch.Root>
  );
};
