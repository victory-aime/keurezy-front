import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { FC } from 'react';
import { variantColorType } from '../interface/button';
import { disabledStyle, variantStyles } from '../base/baseButton';
import { BaseTooltip } from '../../tooltip';
import { Loader } from '../../loader';

export interface BaseIconButtonProps extends Omit<IconButtonProps, 'aria-label'> {
  /** Libellé obligatoire : info-bulle au survol et nom lu par les lecteurs d'écran */
  label: string;
  colorType?: variantColorType;
  isLoading?: boolean;
  /** Masque l'info-bulle (libellé déjà visible à côté) */
  hideTooltip?: boolean;
}

/**
 * Bouton icône de l'application : couleurs de la charte (comme `BaseButton`), état désactivé
 * lisible, info-bulle et `aria-label` tirés du même libellé. `asChild` accepte un lien
 * (`<a download>`).
 *   */
export const BaseIconButton: FC<BaseIconButtonProps> = ({
  label,
  colorType = 'neutral',
  variant = 'surface',
  size = 'sm',
  isLoading = false,
  hideTooltip = false,
  disabled,
  children,
  ...rest
}) => {
  const button = (
    <IconButton
      aria-label={label}
      variant={variant}
      size={size}
      {...variantStyles(colorType, variant)}
      _disabled={disabledStyle(variant)}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <Loader loader size="xs" /> : children}
    </IconButton>
  );
  if (hideTooltip) return button;
  return (
    <BaseTooltip message={label} show>
      {button}
    </BaseTooltip>
  );
};
