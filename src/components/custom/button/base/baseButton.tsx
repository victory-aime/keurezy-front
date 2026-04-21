import { BadgeProps, Button, ButtonProps, HStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { ButtonBaseProps, VariantColorStyle, variantColorType } from '_components/custom';
import { LoadingDots } from '../animation/loadingDots';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '_theme/useThemeColors';

/**
 * ✅ Hook dynamique basé sur le theme runtime
 */
const useVariantStyles = (
  colorType: variantColorType,
  variant: ButtonProps['variant'] | BadgeProps['variant'] = 'solid',
  withGradient: boolean = false,
): VariantColorStyle => {
  const { getColor, getGradient, getHoverGradient } = useThemeColors(colorType);

  const color = getColor(500);
  const textColor = variant === 'outline' || variant === 'plain' ? color : 'white';
  const gradient = getGradient(400, 500);
  const hover = getHoverGradient(800, 900);

  switch (variant) {
    case 'subtle':
      return {
        bg: `${color}20`,
        textColor: color,
        gradient: 'none',
        hover: `${color}30`,
      };

    case 'plain':
      return {
        bg: 'transparent',
        textColor: color,
        gradient: 'none',
        hover: `${color}20`,
      };

    case 'outline':
      return {
        bg: 'transparent',
        textColor: color,
        gradient: 'none',
        hover: `${color}20`,
      };

    default:
      return {
        bg: withGradient ? gradient : color,
        textColor,
        gradient: withGradient ? gradient : 'none',
        hover: withGradient ? hover : `${color}CC`,
      };
  }
};

const BaseButton: FC<ButtonBaseProps> = ({
  children,
  withGradient = false,
  rightIcon,
  colorType = 'primary', // ⚠️ pour future extension multi-color
  isLoading = false,
  isDisabled = false,
  leftIcon,
  variant = 'solid',
  ...rest
}) => {
  const { t } = useTranslation();

  const { bg, gradient, hover, textColor } = useVariantStyles(colorType, variant, withGradient);
  const isOutline = variant === 'outline';

  const commonProps = {
    position: 'relative' as const,
    borderColor: isOutline ? textColor : undefined,
    variant,
    bg: variant === 'solid' ? (withGradient ? gradient : bg) : undefined,
    color: textColor,
    border: isOutline ? '1px solid' : undefined,
    _hover: {
      background: isOutline ? hover : withGradient ? hover : `${bg}CC`,
    },
    _active: {
      background: isOutline ? hover : withGradient ? hover : `${bg}AA`,
    },
    _disabled: {
      background: 'gray.300',
      color: 'white',
      cursor: 'not-allowed',
      borderColor: 'gray.300',
    },
    borderRadius: '12px',
    padding: '20px',
    loading: isLoading,
    disabled: isLoading || isDisabled,
    loadingText: t('COMMON.LOADING_TEXT'),
    spinner: <LoadingDots />,
    spinnerPlacement: 'end' as const,
    ...rest,
  };

  if (rightIcon) {
    return (
      <HStack width={rest.width}>
        <Button {...commonProps}>
          {children}
          {rightIcon}
        </Button>
      </HStack>
    );
  }

  if (leftIcon) {
    return (
      <HStack width={rest.width}>
        <Button {...commonProps}>
          {leftIcon}
          {children}
        </Button>
      </HStack>
    );
  }

  return <Button {...commonProps}>{children}</Button>;
};

export { BaseButton, useVariantStyles };
