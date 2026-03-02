import React, { FC } from "react";
import { Switch } from "@chakra-ui/react";
import { Loader } from "_components/custom";

interface BaseSwitchProps {
  hideIcon?: boolean;
  isChecked: boolean;
  onSwitchChange: (value: boolean) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const BaseSwitch: FC<BaseSwitchProps> = ({
  hideIcon = false,
  isChecked,
  onSwitchChange,
  isLoading,
  isDisabled,
}) => {
  return (
    <Switch.Root
      checked={isChecked}
      onCheckedChange={(value) => onSwitchChange(value.checked)}
      colorPalette={"purple"}
      size={"md"}
      disabled={isDisabled}
    >
      {isLoading ? (
        <Loader loader={isLoading} />
      ) : (
        <>
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </>
      )}
    </Switch.Root>
  );
};
