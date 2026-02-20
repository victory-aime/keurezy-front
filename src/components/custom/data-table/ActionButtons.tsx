import { HStack, IconButton, Menu, Portal } from "@chakra-ui/react";
import {
  ActionButtonsProps,
  BaseTooltip,
  Loader,
  Icons,
  BaseButton,
} from "_components/custom";

const ACTION_CONFIG = {
  delete: {
    tooltip: "COMMON.DELETE",
    icon: Icons.Trash,
    bg: "red.500",
    color: "white",
    aria: "Supprimer",
  },
  edit: {
    tooltip: "COMMON.EDIT",
    icon: Icons.Edit,
    bg: "info.500",
    color: "white",
    aria: "Modifier",
  },
  view: {
    tooltip: "COMMON.DETAIL",
    icon: Icons.View,
    bg: "secondary.500",
    aria: "Voir",
  },
  share: {
    tooltip: "COMMON.SHARE",
    icon: Icons.Share,
    bg: "tertiary.500",
    color: "white",
    aria: "Partager",
  },
  duplicate: {
    tooltip: "COMMON.DUPLICATE",
    icon: Icons.Copy,
    bg: "secondary.500",
    color: "white",
    aria: "Dupliquer",
  },
  payment: {
    tooltip: "COMMON.PAYMENT",
    icon: Icons.Payment,
    bg: "warning.300",
    color: "white",
    aria: "Payment",
  },
  download: {
    tooltip: "COMMON.DOWNLOAD",
    icon: Icons.Download,
    bg: "success.900",
    color: "white",
    aria: "Download",
  },
  restore: {
    tooltip: "COMMON.RESTORE",
    icon: Icons.Restore,
    bg: "orange.800",
    color: "white",
    aria: "Restore",
  },
  passkey: {
    tooltip: "COMMON.PASSKEY",
    icon: Icons.Key,
    bg: "purple.800",
    color: "white",
    aria: "Passkey",
  },
} as const;

export const ActionButtons = <T,>({ actions, item }: ActionButtonsProps<T>) => {
  return (
    <></>
    // <Menu.Root positioning={{ placement: "bottom" }}>
    //   <Menu.Trigger rounded="full" focusRing="none">
    //     <Icons.Menu />
    //   </Menu.Trigger>

    //   <Portal>
    //     <Menu.Positioner>
    //       <Menu.Content>
    //         <HStack gap={2}>
    //           {actions.map((action) => {
    //             const label =
    //               typeof action.name === "function"
    //                 ? action.name(item)
    //                 : action.name;

    //             const isShown =
    //               typeof action.isShown === "function"
    //                 ? action.isShown(item)
    //                 : action.isShown !== false;

    //             if (!isShown) return null;

    //             const isDisabled =
    //               typeof action.isDisabled === "function"
    //                 ? action.isDisabled(item)
    //                 : !!action.isDisabled;

    //             const isLoading =
    //               typeof action.isLoading === "function"
    //                 ? action.isLoading(item)
    //                 : !!action.isLoading;

    //             const config =
    //               ACTION_CONFIG[label as keyof typeof ACTION_CONFIG];

    //             const handleClick = (e: React.MouseEvent) => {
    //               e.stopPropagation();
    //               action.handleClick(item);
    //             };

    //             if (!config) {
    //               return (
    //                 <BaseButton
    //                   key={label}
    //                   size="sm"
    //                   onClick={handleClick}
    //                   disabled={isDisabled || isLoading}
    //                   isLoading={isLoading}
    //                 >
    //                   {label}
    //                 </BaseButton>
    //               );
    //             }

    //             const Icon = config.icon;

    //             return (
    //               <Menu.Item key={label} value={label} asChild>
    //                 <BaseTooltip message={config.tooltip} show>
    //                   <IconButton
    //                     size="sm"
    //                     aria-label={config.aria}
    //                     bgColor={config.bg}
    //                     color={config.color}
    //                     onClick={handleClick}
    //                     disabled={isDisabled || isLoading}
    //                   >
    //                     {isLoading ? <Loader loader size="xs" /> : <Icon />}
    //                   </IconButton>
    //                 </BaseTooltip>
    //               </Menu.Item>
    //             );
    //           })}
    //         </HStack>
    //       </Menu.Content>
    //     </Menu.Positioner>
    //   </Portal>
    // </Menu.Root>
  );
};
