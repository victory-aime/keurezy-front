import { ColorPalette, TagRootProps } from '@chakra-ui/react';
import { ENUM } from '_types/';
import { ReactNode } from 'react';

type TagType = 'icon' | 'default';
type StatusType = ENUM.COMMON.Status;

interface BaseTagProps extends TagRootProps {
  label?: string;
  color?: ColorPalette;
  icon?: ReactNode;
  status?: StatusType;
  onCloseIconTrigger?: () => void;
  iconPosition?: 'start' | 'end';
  variant?: 'outline' | 'solid' | 'subtle' | 'surface' | undefined;
}

export type { BaseTagProps, TagType, StatusType };
