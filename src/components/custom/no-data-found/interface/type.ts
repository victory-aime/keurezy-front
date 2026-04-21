import { BoxProps } from '@chakra-ui/react';

export interface NoDataFoundProps {
  title?: string;
  imageType?: 'v1' | 'v2';
  containerStyle?: BoxProps;
  isPublic?: boolean;
}
