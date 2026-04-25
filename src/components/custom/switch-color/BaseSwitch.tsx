import React, { FC } from 'react';
import { Spinner, Switch } from '@chakra-ui/react';

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
      colorPalette={isChecked ? 'teal' : 'red'}
      size={'md'}
      disabled={isDisabled}
    >
      {isLoading ? (
        <Spinner color="primary.500" animationDuration="0.4s" size={'sm'} />
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
