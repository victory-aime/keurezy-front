import { HStack, IconButton } from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import {
  IoCopyOutline,
  IoDownloadOutline,
  IoKeyOutline,
  IoShareOutline,
} from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { BaseButton } from "../button";
import { TbRestore } from "react-icons/tb";
import { ActionButtonsProps, BaseTooltip, Loader } from "_components/custom";
import { PiEyeLight } from "react-icons/pi";
import { GrMoney } from "react-icons/gr";

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
                  {isLoading ? <Loader loader size={"xs"} /> : <FaTrashAlt />}
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
                  {isLoading ? <Loader loader size={"xs"} /> : <MdEdit />}
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
                  {isLoading ? <Loader loader size={"xs"} /> : <PiEyeLight />}
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
                  {isLoading ? (
                    <Loader loader size={"xs"} />
                  ) : (
                    <IoShareOutline />
                  )}
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
                  {isLoading ? (
                    <Loader loader size={"xs"} />
                  ) : (
                    <IoCopyOutline />
                  )}
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
                  {isLoading ? <Loader loader size={"xs"} /> : <GrMoney />}
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
                    <IoDownloadOutline />
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
                  {isLoading ? <Loader loader size={"xs"} /> : <TbRestore />}
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
                  {isLoading ? <Loader loader size={"xs"} /> : <IoKeyOutline />}
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
