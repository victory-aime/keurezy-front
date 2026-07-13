import { SpinnerProps } from '@chakra-ui/react';
import React from 'react';

interface KeurezyLogoAnimationProps {
  isExiting: boolean;
  onAnimationComplete: () => void;
  minDuration?: number;
}

interface PulseRingProps {
  delayMs: number;
  color: string;
  size: number;
  paused: boolean;
}
interface LoaderProps extends SpinnerProps {
  loader: boolean;
  showText?: boolean;
  text?: string;
  renderSpinnerContent?: React.ReactNode;
}

export type { PulseRingProps, KeurezyLogoAnimationProps, LoaderProps };
