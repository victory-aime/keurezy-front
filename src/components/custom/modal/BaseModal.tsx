import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "_components/ui/dialog";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { BaseButton } from "../button";
import { ModalProps } from "./interface/modal";
import { BaseIcon } from "../base-icon";
import { useTranslation } from "react-i18next";
import { BaseText, TextVariant } from "_components/custom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const BaseModal = ({
  isOpen = false,
  ignoreFooter = false,
  onChange,
  title = "Modal Title",
  colorSaveButton = "primary",
  colorCancelButton = "danger",
  buttonSaveTitle = "COMMON.VALIDATE",
  buttonCancelTitle = "COMMON.CANCEL",
  showCloseButton = true,
  isLoading,
  onClick,
  isFull,
  modalType,
  icon,
  iconBackgroundColor = "primary.500",
  children,
  disabled,
  logoSrc = "/assets/images/placeholder-image.png",
  ref,
  animateConfetti = false,
  ...rest
}: ModalProps) => {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();

  return (
    <>
      {animateConfetti && (
        <Confetti width={width} height={height} numberOfPieces={500} recycle />
      )}
      <DialogRoot
        open={isOpen}
        lazyMount
        onOpenChange={(e) => onChange?.(e?.open)}
        placement={"center"}
        role={modalType}
        size={isFull ? "full" : "lg"}
        motionPreset="slide-in-top"
        {...rest}
      >
        <DialogContent width={"full"} p={4}>
          <Flex alignItems={"center"} gap={4} mb={4}>
            {icon && (
              <BaseIcon
                borderRadius={"7px"}
                color={
                  modalType === "alertdialog" ? "red.500" : iconBackgroundColor
                }
              >
                {icon}
              </BaseIcon>
            )}
            <BaseText variant={TextVariant.S}>{t(title)}</BaseText>

            {showCloseButton && <DialogCloseTrigger />}
          </Flex>

          <DialogBody autoFocus={false} mt={4} ref={ref}>
            {children}
            {!ignoreFooter ? (
              <DialogFooter
                mt={8}
                alignItems={"center"}
                justifyContent={"center"}
                gap={4}
              >
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
                          variant={"outline"}
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
                      onClick={() => onClick?.()}
                      colorType={
                        modalType === "alertdialog" ? "danger" : colorSaveButton
                      }
                    >
                      {t(buttonSaveTitle)}
                    </BaseButton>
                  </>
                )}
              </DialogFooter>
            ) : null}
          </DialogBody>
          {/*<Flex alignItems={"flex-end"} justifyContent={"flex-end"}>*/}
          {/*  <Image src={logoSrc} alt={"logo"} width={"60px"} />*/}
          {/*</Flex>*/}
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default BaseModal;
