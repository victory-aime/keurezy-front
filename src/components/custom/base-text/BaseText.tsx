import { Text, TextProps } from '@chakra-ui/react';
import React from 'react';
import { TextVariant, TextWeight } from './';

interface BaseTextProps extends TextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  /** Ex. titre d'étape qui reçoit le focus (React 19 : `ref` est une prop) */
  ref?: React.Ref<HTMLElement>;
}

export const BaseText: React.FC<BaseTextProps> = ({
  variant = TextVariant.M,
  weight = TextWeight.Regular,
  children,
  ref,
  ...props
}) => {
  const sizeMap: Record<TextVariant, string> = {
    [TextVariant.H1]: '32px',
    [TextVariant.H2]: '28px',
    [TextVariant.H3]: '24px',
    [TextVariant.L]: '20px',
    [TextVariant.XL]: '18px',
    [TextVariant.M]: '16px',
    [TextVariant.S]: '14px',
    [TextVariant.XS]: '12px',
    [TextVariant.XXS]: '10px',
  };

  const weightMap: Record<TextWeight, string> = {
    [TextWeight.THIN]: 'thin',
    [TextWeight.ExtraLight]: 'extralight',
    [TextWeight.Light]: 'light',
    [TextWeight.Regular]: 'normal',
    [TextWeight.Medium]: 'medium',
    [TextWeight.SemiBold]: 'semibold',
    [TextWeight.Bold]: 'bold',
    [TextWeight.ExtraBold]: 'extrabold',
    [TextWeight.Black]: 'black',
  };

  return (
    <Text
      ref={ref as React.Ref<HTMLParagraphElement>}
      fontSize={sizeMap[variant]}
      fontWeight={weightMap[weight]}
      {...props}
    >
      {children}
    </Text>
  );
};
