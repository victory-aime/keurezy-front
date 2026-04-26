import { HStack, IconButton, Menu, Portal, VStack } from '@chakra-ui/react';
import { ActionButtonsProps, Loader, Icons, BaseButton, BaseTooltip } from '_components/custom';
import { VariablesColors } from '_theme/variables';
import { useTranslation } from 'react-i18next';

const ACTION_CONFIG = {
  delete: {
    tooltip: 'COMMON.DELETE',
    icon: Icons.Trash,
    bg: 'red',
    color: 'white',
    aria: 'Supprimer',
  },
  cancel: {
    tooltip: 'COMMON.CANCEL',
    icon: Icons.Close,
    bg: 'red',
    color: 'white',
    aria: 'Annuler',
  },
  edit: {
    tooltip: 'COMMON.EDIT',
    icon: Icons.Edit,
    bg: 'blue',
    color: 'white',
    aria: 'Modifier',
  },
  view: {
    tooltip: 'COMMON.DETAIL',
    icon: Icons.View,
    bg: 'gray',
    aria: 'Voir',
  },
  share: {
    tooltip: 'COMMON.SHARE',
    icon: Icons.Share,
    bg: 'green',
    color: 'white',
    aria: 'Partager',
  },
  duplicate: {
    tooltip: 'COMMON.DUPLICATE',
    icon: Icons.Copy,
    bg: 'orange',
    color: 'white',
    aria: 'Dupliquer',
  },
  payment: {
    tooltip: 'COMMON.PAYMENT',
    icon: Icons.Payment,
    bg: 'warning',
    color: 'white',
    aria: 'Payment',
  },
  download: {
    tooltip: 'COMMON.DOWNLOAD',
    icon: Icons.Download,
    bg: 'success',
    color: 'white',
    aria: 'Download',
  },
  restore: {
    tooltip: 'COMMON.RESTORE',
    icon: Icons.Restore,
    bg: 'orange',
    color: 'white',
    aria: 'Restore',
  },
  chat: {
    tooltip: 'Discuter',
    icon: Icons.Chat,
    bg: 'purple',
    color: 'white',
    aria: 'chat',
  },
  passkey: {
    tooltip: 'COMMON.PASSKEY',
    icon: Icons.Key,
    bg: 'purple',
    color: 'white',
    aria: 'Passkey',
  },
  publish: {
    tooltip: 'COMMON.PUBLISH',
    icon: Icons.Megaphone,
    bg: 'green',
    color: 'white',
    aria: 'Publish',
  },
  assign: {
    tooltip: 'COMMON.ASSIGN',
    icon: Icons.Assignment,
    bg: 'yellow',
    color: 'white',
    aria: 'assign',
  },
} as const;

export const DataTableActionButtons = <T,>({ actions, item }: ActionButtonsProps<T>) => {
  const { t } = useTranslation();
  const visibleActions = actions.filter((action) => {
    const isShown =
      typeof action.isShown === 'function' ? action.isShown(item) : action.isShown !== false;

    return isShown;
  });

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

    return (
      <BaseTooltip message={config.tooltip} show>
        <IconButton
          onClick={handleClick}
          disabled={isDisabled || isLoading}
          colorPalette={config.bg}
          variant={'surface'}
          size={'xs'}
        >
          {isLoading ? <Loader loader size="xs" /> : <Icon />}
        </IconButton>
      </BaseTooltip>
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
                <Menu.Item
                  key={label}
                  value={label}
                  asChild
                  disabled={isDisabled || isLoading}
                  onClick={handleClick}
                >
                  <HStack
                    color={isDisabled ? VariablesColors.grayScale : 'inherit'}
                    justifyContent={isLoading ? 'center' : 'flex-start'}
                    width={'full'}
                  >
                    {isLoading ? (
                      <Loader loader size="xs" />
                    ) : (
                      <IconButton
                        aria-label={config.aria}
                        colorPalette={config.bg}
                        width={'full'}
                        variant={'surface'}
                        size={'xs'}
                      >
                        <Icon />
                        {t(config.tooltip)}
                      </IconButton>
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
