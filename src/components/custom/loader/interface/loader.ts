import { SpinnerProps } from '@chakra-ui/react';

interface LoaderProps extends SpinnerProps {
  loader: boolean;
  showText?: boolean;
  text?: string;
}

export type { LoaderProps };
