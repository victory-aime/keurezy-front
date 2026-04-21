import { RadioGroupRootProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface IRadioProps extends RadioGroupRootProps {
  items: {
    label: string;
    value: string;
  }[];
  colorPalette?:
    | string
    | 'transparent'
    | 'current'
    | 'black'
    | 'white'
    | 'whiteAlpha'
    | 'blackAlpha'
    | 'gray'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'teal'
    | 'blue'
    | 'cyan'
    | 'purple'
    | 'pink'
    | 'bg'
    | 'fg'
    | 'border';
  orientation?: 'vertical' | 'horizontal';
}

export type { IRadioProps };
