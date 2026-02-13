import { HStack, IconButton } from "@chakra-ui/react";
import {
  ActionButtonsProps,
  BaseTooltip,
  Loader,
  Icons,
  BaseButton,
} from "_components/custom";

export const ActionButtons = <T,>({ actions, item }: ActionButtonsProps<T>) => {
  return (
    <HStack gap={2}>
      {actions.map((action, index) => {
        const isShown =
          typeof action.isShown === "function"
            ? action.isShown(item)
            : action.isShown !== false;

        if (!isShown) return null;

        const isDisabled = action.isDisabled ? action.isDisabled(item) : false;
        const isLoading =
          typeof action.isLoading === "function"
            ? action.isLoading(item)
            : !!action.isLoading;

        const label =
          typeof action.name === "function" ? action.name(item) : action.name;

        const commonProps = {
          onClick: () => action.handleClick(item),
          disabled: isDisabled || isLoading,
          isLoading,
        };

        switch (label) {
          case "delete":
            return (
              <BaseTooltip message={"COMMON.DELETE"} key={index} show>
                <IconButton
                  size={"sm"}
                  aria-label="Supprimer"
                  color="white"
                  bgColor="red.500"
                  {...commonProps}
                >
                  {isLoading ? <Loader loader size={"xs"} /> : <Icons.Trash />}
                </IconButton>
              </BaseTooltip>
            );
          case "edit":
            return (
              <BaseTooltip message={"COMMON.EDIT"} key={index} show>
                <IconButton
                  size={"sm"}
                  aria-label="Supprimer"
                  color="white"
                  bgColor="info.500"
                  {...commonProps}
                >
                  {isLoading ? <Loader loader size={"xs"} /> : <Icons.Edit />}
                </IconButton>
              </BaseTooltip>
            );
          case "view":
            return (
              <BaseTooltip message={"COMMON.DETAIL"} key={index} show arrow>
                <IconButton
                  size={"sm"}
                  aria-label="Voir"
                  bgColor="secondary.500"
                  {...commonProps}
                >
                  {isLoading ? <Loader loader size={"xs"} /> : <Icons.View />}
                </IconButton>
              </BaseTooltip>
            );
          case "share":
            return (
              <BaseTooltip message={"COMMON.SHARE"} key={index} show>
                <IconButton
                  size={"sm"}
                  aria-label="Partager"
                  color="white"
                  bgColor="tertiary.500"
                  {...commonProps}
                >
                  {isLoading ? <Loader loader size={"xs"} /> : <Icons.Share />}
                </IconButton>
              </BaseTooltip>
            );
          case "duplicate":
            return (
              <BaseTooltip message={"COMMON.DUPLICATE"} key={index} show>
                <IconButton
                  size={"sm"}
                  aria-label="Dupliquer"
                  color="white"
                  bgColor="secondary.500"
                  {...commonProps}
                >
                  {isLoading ? <Loader loader size={"xs"} /> : <Icons.Copy />}
                </IconButton>
              </BaseTooltip>
            );
          case "payment":
            return (
              <BaseTooltip message={"COMMON.PAYMENT"} key={index} show>
                <IconButton
                  size={"sm"}
                  aria-label="payment"
                  color="white"
                  bgColor="warning.300"
                  {...commonProps}
                >
                  {isLoading ? (
                    <Loader loader size={"xs"} />
                  ) : (
                    <Icons.Payment />
                  )}
                </IconButton>
              </BaseTooltip>
            );
          case "download":
            return (
              <BaseTooltip message={"COMMON.DOWNLOAD"} key={index} show>
                <IconButton
                  size={"sm"}
                  aria-label="download"
                  color="white"
                  bgColor="success.900"
                  {...commonProps}
                >
                  {isLoading ? (
                    <Loader loader size={"xs"} />
                  ) : (
                    <Icons.Download />
                  )}
                </IconButton>
              </BaseTooltip>
            );
          case "restore":
            return (
              <BaseTooltip message={"COMMON.RESTORE"} key={index} show>
                <IconButton
                  size={"sm"}
                  aria-label="restore"
                  color="white"
                  bgColor="orange.800"
                  {...commonProps}
                >
                  {isLoading ? (
                    <Loader loader size={"xs"} />
                  ) : (
                    <Icons.Restore />
                  )}
                </IconButton>
              </BaseTooltip>
            );
          case "passkey":
            return (
              <BaseTooltip message={"COMMON.PASSKEY"} key={index} show>
                <IconButton
                  size={"sm"}
                  aria-label="passkey"
                  color="white"
                  bgColor="purple.800"
                  {...commonProps}
                >
                  {isLoading ? <Loader loader size={"xs"} /> : <Icons.Key />}
                </IconButton>
              </BaseTooltip>
            );
          default:
            return (
              <BaseButton
                key={index}
                size="sm"
                onClick={() => action.handleClick(item)}
                disabled={isDisabled || isLoading}
                isLoading={isLoading}
              >
                {label}
              </BaseButton>
            );
        }
      })}
    </HStack>
  );
};
