import { HStack, IconButton, Menu, Portal } from '@chakra-ui/react';
import {
  ActionButtonsProps,
  Loader,
  Icons,
  BaseButton,
  BaseIconButton,
  variantColorType,
} from '_components/custom';
import { useTranslation } from 'react-i18next';

/** Icône, libellé et couleur (charte) de chaque action de ligne. */
const ACTION_CONFIG: Record<
  string,
  { tooltip: string; icon: React.ElementType; colorType: variantColorType; aria: string }
> = {
  delete: {
    tooltip: 'COMMON.DELETE',
    icon: Icons.Trash,
    colorType: 'danger',
    aria: 'Supprimer',
  },
  resend: {
    tooltip: 'COMMON.RESEND',
    icon: Icons.SendMail,
    colorType: 'info',
    aria: 'Renvoyer',
  },
  close: {
    tooltip: 'COMMON.CLOSE',
    icon: Icons.Lock,
    colorType: 'warning',
    aria: 'Fermer',
  },
  cancel: {
    tooltip: 'COMMON.CANCEL',
    icon: Icons.Close,
    colorType: 'danger',
    aria: 'Annuler',
  },
  edit: {
    tooltip: 'COMMON.EDIT',
    icon: Icons.Edit,
    colorType: 'info',
    aria: 'Modifier',
  },
  view: {
    tooltip: 'COMMON.DETAIL',
    icon: Icons.View,
    colorType: 'neutral',
    aria: 'Voir',
  },
  share: {
    tooltip: 'COMMON.SHARE',
    icon: Icons.Share,
    colorType: 'success',
    aria: 'Partager',
  },
  duplicate: {
    tooltip: 'COMMON.DUPLICATE',
    icon: Icons.Copy,
    colorType: 'warning',
    aria: 'Dupliquer',
  },
  payment: {
    tooltip: 'COMMON.PAYMENT',
    icon: Icons.Payment,
    colorType: 'warning',
    aria: 'Payment',
  },
  download: {
    tooltip: 'COMMON.DOWNLOAD',
    icon: Icons.Download,
    colorType: 'success',
    aria: 'Download',
  },
  restore: {
    tooltip: 'COMMON.RESTORE',
    icon: Icons.Restore,
    colorType: 'warning',
    aria: 'Restore',
  },
  chat: {
    tooltip: 'Discuter',
    icon: Icons.Chat,
    colorType: 'primary',
    aria: 'chat',
  },
  passkey: {
    tooltip: 'COMMON.PASSKEY',
    icon: Icons.Key,
    colorType: 'primary',
    aria: 'Passkey',
  },
  publish: {
    tooltip: 'COMMON.PUBLISH',
    icon: Icons.Megaphone,
    colorType: 'success',
    aria: 'Publish',
  },
  assign: {
    tooltip: 'COMMON.ASSIGN',
    icon: Icons.Assignment,
    colorType: 'warning',
    aria: 'assign',
  },
};

export const DataTableActionButtons = <T,>({ actions, item }: ActionButtonsProps<T>) => {
  const { t } = useTranslation();
  const visibleActions = actions.filter((action) => {
    const isShown =
      typeof action.isShown === 'function' ? action.isShown(item) : action.isShown !== false;

    return isShown;
  });

  if (!visibleActions.length) return null;

  if (visibleActions.length === 1) {
    const action = visibleActions[0];

    const label = typeof action.name === 'function' ? action.name(item) : action.name;

    const config = ACTION_CONFIG[label as keyof typeof ACTION_CONFIG];

    const isDisabled =
      typeof action.isDisabled === 'function' ? action.isDisabled(item) : !!action.isDisabled;

    const isLoading =
      typeof action.isLoading === 'function' ? action.isLoading(item) : !!action.isLoading;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      action.handleClick(item);
    };

    if (!config) {
      return (
        <BaseButton
          size="sm"
          onClick={handleClick}
          disabled={isDisabled || isLoading}
          isLoading={isLoading}
        >
          {label}
        </BaseButton>
      );
    }

    const Icon = config.icon;

    // Titre propre à l'action s'il est fourni (ex. « Fermer le bien »), sinon libellé générique
    return (
      <BaseIconButton
        label={action.title ?? t(config.tooltip)}
        colorType={config.colorType}
        variant="surface"
        size="xs"
        onClick={handleClick}
        disabled={isDisabled}
        isLoading={isLoading}
      >
        <Icon />
      </BaseIconButton>
    );
  }
  return (
    <Menu.Root positioning={{ placement: 'bottom' }}>
      <Menu.Trigger cursor={'pointer'} width={'full'}>
        <Icons.DotHorizontal size={24} />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minWidth={'150px'} padding={1} borderRadius={8} boxShadow={'md'}>
            {actions.map((action) => {
              const label = typeof action.name === 'function' ? action.name(item) : action.name;

              const isShown =
                typeof action.isShown === 'function'
                  ? action.isShown(item)
                  : action.isShown !== false;

              if (!isShown) return null;

              const isDisabled =
                typeof action.isDisabled === 'function'
                  ? action.isDisabled(item)
                  : !!action.isDisabled;

              const isLoading =
                typeof action.isLoading === 'function'
                  ? action.isLoading(item)
                  : !!action.isLoading;

              const config = ACTION_CONFIG[label as keyof typeof ACTION_CONFIG];

              const handleClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                action.handleClick(item);
              };

              if (!config) {
                return (
                  <BaseButton
                    key={label}
                    size="sm"
                    onClick={handleClick}
                    disabled={isDisabled || isLoading}
                    isLoading={isLoading}
                  >
                    {label}
                  </BaseButton>
                );
              }

              const Icon = config.icon;

              return (
                <Menu.Item key={label} value={label} asChild onClick={handleClick}>
                  <HStack
                    color={isDisabled ? 'fg.muted' : 'inherit'}
                    justifyContent={isLoading ? 'center' : 'flex-start'}
                    width={'full'}
                  >
                    {isLoading ? (
                      <Loader loader size="xs" />
                    ) : (
                      <BaseIconButton
                        colorType={config.colorType}
                        variant="surface"
                        size="xs"
                        width="full"
                        disabled={isDisabled}
                        label={action.title ?? t(config.tooltip)}
                        hideTooltip
                        p={2}
                      >
                        <Icon />
                        {action.title ?? t(config.tooltip)}
                      </BaseIconButton>
                    )}
                  </HStack>
                </Menu.Item>
              );
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
