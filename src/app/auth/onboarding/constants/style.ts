import { useColorMode } from '_components/ui/color-mode';

export const useStyles = () => {
  const { colorMode } = useColorMode();
  const bg = colorMode !== 'light' ? 'inherit' : 'white';
  const muted = colorMode !== 'light' ? 'gray.800' : 'gray.50';
  const border = colorMode !== 'light' ? 'gray.700' : 'gray.200';
  const textMuted = colorMode !== 'light' ? 'gray.400' : 'gray.500';
  return { bg, muted, border, textMuted };
};
