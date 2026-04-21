import { AspectRatioProps } from '@chakra-ui/react/aspect-ratio';
import React from 'react';

export interface IAspectRatioProps extends AspectRatioProps {
  image?: string;
  style?: React.CSSProperties;
}
