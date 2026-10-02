import { Button, ButtonProps, HStack, SystemStyleObject } from '@chakra-ui/react';
import React, { FC } from 'react';
import { ButtonBaseProps, variantColorType } from '_components/custom';
import { LoadingDots } from '../animation/loadingDots';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '_theme/useThemeColors';

/** `overlay` n'a pas d'échelle de teintes : il prend les couleurs du gris neutre. */
const paletteOf = (colorType: variantColorType) =>
  colorType === 'overlay' ? 'neutral' : colorType;

/**
 * Désactivé : gris du thème (clair et sombre), lisible, sans effet de survol ni d'appui.
 * Pleine et discrète gardent un fond ; contour et surface gardent leur bord ; fantôme et texte
 * restent sans fond.
 */
export const disabledStyle = (variant: ButtonProps['variant']): SystemStyleObject => {
  const base: SystemStyleObject = {
    color: 'fg.muted',
    opacity: 1,
    cursor: 'not-allowed',
    boxShadow: 'none',
  };
  const look: SystemStyleObject =
    variant === 'outline' || variant === 'surface'
      ? { ...base, bg: 'transparent', borderColor: 'border.emphasized' }
      : variant === 'ghost' || variant === 'plain'
        ? { ...base, bg: 'transparent', borderColor: 'transparent' }
        : { ...base, bg: 'bg.emphasized', backgroundImage: 'none', borderColor: 'transparent' };
  return { ...look, _hover: look, _active: look };
};

/**
 * Couleurs d'une variante, lues dans les jetons de la charte (`{palette}.solid`, `.contrast`,
 * `.fg`, `.subtle`, `.muted`…) : lisibles en clair comme en sombre, texte foncé sur les
 * couleurs claires (jaune, turquoise). Partagé par les boutons et les badges.
 */
export const variantStyles = (
  colorType: variantColorType,
  variant: ButtonProps['variant'] = 'solid',
): SystemStyleObject => {
  const c = paletteOf(colorType);
  switch (variant) {
    case 'outline':
      return {
        bg: 'transparent',
        color: `${c}.fg`,
        borderWidth: '1px',
        borderColor: `${c}.solid`,
        _hover: { bg: `${c}.subtle` },
        _active: { bg: `${c}.muted` },
      };
    case 'surface':
      return {
        bg: `${c}.subtle`,
        color: `${c}.fg`,
        borderWidth: '1px',
        borderColor: `${c}.muted`,
        _hover: { bg: `${c}.muted` },
        _active: { bg: `${c}.emphasized` },
      };
    case 'subtle':
      return {
        bg: `${c}.muted`,
        color: `${c}.fg`,
        _hover: { bg: `${c}.emphasized` },
        _active: { bg: `${c}.emphasized` },
      };
    case 'ghost':
      return {
        bg: 'transparent',
        color: `${c}.fg`,
        _hover: { bg: `${c}.subtle` },
        _active: { bg: `${c}.muted` },
      };
    case 'plain':
      return {
        bg: 'transparent',
        color: `${c}.fg`,
        _hover: { textDecoration: 'underline' },
      };
    default:
      return {
        bg: `${c}.solid`,
        color: `${c}.contrast`,
        _hover: { bg: `${c}.solid/85` },
        _active: { bg: `${c}.solid/75` },
      };
  }
};

const BaseButton: FC<ButtonBaseProps> = ({
  children,
  withGradient = false,
  rightIcon,
  colorType = 'primary',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  variant = 'solid',
  ...rest
}) => {
  const { t } = useTranslation();
  const { getGradient, getHoverGradient } = useThemeColors(paletteOf(colorType));
  const gradient = withGradient && (variant === 'solid' || !variant);

  const commonProps = {
    position: 'relative' as const,
    variant,
    ...variantStyles(colorType, variant),
    ...(gradient && {
      bgImage: getGradient(400, 500),
      _hover: { bgImage: getHoverGradient(800, 900) },
      _active: { bgImage: getHoverGradient(800, 900) },
    }),
    // En chargement, le bouton garde ses couleurs (il est désactivé le temps de la requête)
    _disabled: isLoading ? { opacity: 1, cursor: 'progress' } : disabledStyle(variant),
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

export { BaseButton };
