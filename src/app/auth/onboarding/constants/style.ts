import { useColorModeValue } from "_components/ui/color-mode";

export const useStyles = () => {
  const bg = useColorModeValue("white", "inherit");
  const muted = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  return { bg, muted, border, textMuted };
};
