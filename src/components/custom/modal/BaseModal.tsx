import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "_components/ui/dialog";
import { DialogFooterProps, Flex, VStack } from "@chakra-ui/react";
import { BaseButton } from "../button";
import { ModalProps } from "./interface/modal";
import { BaseIcon } from "../base-icon";
import { useTranslation } from "react-i18next";
import { BaseTag, BaseText, TextVariant } from "_components/custom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const BaseModal = ({
  isOpen = false,
  ignoreFooter = false,
  onChange,
  title = "Modal Title",
  description = "",
  colorSaveButton = "primary",
  colorCancelButton = "danger",
  buttonSaveTitle = "COMMON.VALIDATE",
  buttonCancelTitle = "COMMON.CANCEL",
  status,
  showCloseButton = true,
  isLoading,
  onClick,
  isFull,
  modalType,
  icon,
  iconBackgroundColor = "primary.500",
  children,
  disabled,
  ref,
  animateConfetti = false,
  iconCancelButton,
  iconSaveButton,
  scrollBehavior = "inside",
  ...rest
}: ModalProps & DialogFooterProps) => {
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
        size={{ mdDown: "full", sm: rest.size ?? "lg" }}
        motionPreset="slide-in-top"
        scrollBehavior={scrollBehavior}
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
            <VStack gap={0} alignItems={"flex-start"}>
              <BaseText variant={TextVariant.S}>{t(title)}</BaseText>
              <BaseText
                variant={TextVariant.S}
                fontWeight={"light"}
                color={"gray.400"}
              >
                {t(description)}
              </BaseText>
            </VStack>
            {status && <BaseTag status={status} variant="subtle" />}

            {showCloseButton && <DialogCloseTrigger />}
          </Flex>

          <DialogBody autoFocus={false} ref={ref} pr={3} pl={0}>
            {children}
            {!ignoreFooter ? (
              <DialogFooter
                mt={4}
                alignItems={"center"}
                justifyContent={"center"}
                gap={4}
                {...rest}
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
                          leftIcon={iconCancelButton}
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
                    {buttonSaveTitle && (
                      <BaseButton
                        disabled={disabled}
                        withGradient
                        onClick={() => onClick?.()}
                        leftIcon={iconSaveButton}
                        colorType={
                          modalType === "alertdialog"
                            ? "danger"
                            : colorSaveButton
                        }
                      >
                        {t(buttonSaveTitle)}
                      </BaseButton>
                    )}
                  </>
                )}
              </DialogFooter>
            ) : null}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default BaseModal;
