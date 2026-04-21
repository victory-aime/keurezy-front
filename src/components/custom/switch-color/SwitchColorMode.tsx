import React from 'react';
import { Icon, Switch } from '@chakra-ui/react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useColorMode } from '_components/ui/color-mode';

export const SwitchColorMode = ({ hideIcon = false }: { hideIcon?: boolean }) => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Switch.Root
      checked={colorMode === 'dark'}
      onCheckedChange={toggleColorMode}
      display={'flex'}
      size={'lg'}
    >
      {!hideIcon ? (
        <>
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
            <Switch.Indicator fallback={<Icon as={LuMoon} color="gray.400" />}>
              <Icon as={LuSun} color="yellow.400" />
            </Switch.Indicator>
          </Switch.Control>
        </>
      ) : (
        <>{colorMode === 'dark' ? <LuSun /> : <LuMoon />}</>
      )}
    </Switch.Root>
  );
};
