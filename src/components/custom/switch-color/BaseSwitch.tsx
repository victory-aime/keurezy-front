import React, { FC } from "react";
import { Spinner, Switch } from "@chakra-ui/react";
import { useAppTheme } from "_context/theme-context";

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
  const { vars } = useAppTheme();
  return (
    <Switch.Root
      checked={isChecked}
      onCheckedChange={(value) => onSwitchChange(value.checked)}
      colorPalette={vars.primary50}
      size={"md"}
      disabled={isDisabled}
    >
      {isLoading ? (
        <Spinner color="primary.500" animationDuration="0.4s" size={"sm"} />
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
