import {
  BaseButton,
  BaseIcon,
  BaseText,
  ModalOpenProps,
  ModalProps,
  TextVariant,
} from "_components/custom";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
} from "_components/ui/drawer";
import { useTranslation } from "react-i18next";
import React from "react";
import { Flex } from "@chakra-ui/react";
import { DialogActionTrigger } from "_components/ui/dialog";
import { useColorModeValue } from "_components/ui/color-mode";

export interface DrawerProps
  extends Omit<ModalProps, "onChange" | "placement">, ModalOpenProps {
  title: string;
  placement?: "start" | "end" | "top" | "bottom";
  drawerContentColor?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  onChange: (value: boolean | any) => void;
}

export const BaseDrawer: React.FC<DrawerProps> = ({
  isOpen,
  onChange,
  placement = "end",
  size = "sm",
  title = "Title Drawer",
  callback,
  isLoading = false,
  isFull,
  children,
  disabled,
  modalType,
  showCloseButton = true,
  ignoreFooter = false,
  icon,
  colorSaveButton = "primary",
  colorCancelButton = "danger",
  buttonSaveTitle = "COMMON.VALIDATE",
  buttonCancelTitle = "COMMON.CANCEL",
  iconBackgroundColor = "primary.500",
  drawerContentColor = "white",
  ref,
}) => {
  const { t } = useTranslation();
  const drawerColor = useColorModeValue(drawerContentColor, "black");

  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(e) => onChange?.(e?.open)}
      placement={placement}
      size={isFull ? "full" : size}
      closeOnEscape
      lazyMount
    >
      <DrawerBackdrop />
      <DrawerContent height={"full"} width={"full"} bgColor={drawerColor}>
        <DrawerHeader
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          p={5}
        >
          <Flex alignItems={"center"} gap={4} mb={4}>
            {icon && (
              <BaseIcon borderRadius={"7px"} color={iconBackgroundColor}>
                {icon}
              </BaseIcon>
            )}
            <BaseText
              variant={TextVariant.S}
              color={drawerContentColor !== "white" ? "white" : "none"}
            >
              {t(title)}
            </BaseText>

            {showCloseButton && (
              <DrawerCloseTrigger
                color={drawerContentColor !== "white" ? "white" : "none"}
              />
            )}
          </Flex>
        </DrawerHeader>
        <DrawerBody width={"full"} height={"full"} ref={ref}>
          {children}
        </DrawerBody>

        {!ignoreFooter ? (
          <DrawerFooter alignItems={"center"} justifyContent={"center"}>
            {isLoading ? (
              <BaseButton isLoading />
            ) : (
              <>
                {buttonCancelTitle && (
                  <DialogActionTrigger asChild>
                    <BaseButton
                      disabled={disabled}
                      withGradient
                      onClick={() => onChange?.(!isOpen)}
                      variant="outline"
                      colorType={
                        modalType === "alertdialog"
                          ? "danger"
                          : colorCancelButton
                      }
                    >
                      {t(buttonCancelTitle)}
                    </BaseButton>
                  </DialogActionTrigger>
                )}
                <BaseButton
                  disabled={disabled}
                  withGradient
                  onClick={() => callback?.()}
                  colorType={
                    modalType === "alertdialog" ? "danger" : colorSaveButton
                  }
                >
                  {t(buttonSaveTitle)}
                </BaseButton>
              </>
            )}
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </DrawerRoot>
  );
};
