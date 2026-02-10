import { VStack } from "@chakra-ui/react";
import {
  BaseButton,
  BaseText,
  FormTextInput,
  ModalOpenProps,
  DeleteModalAnimation,
} from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { Formik } from "formik";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

export const DisabledAccount: FC<ModalOpenProps> = ({
  isOpen,
  isLoading,
  callback,
  data,
  onChange,
}) => {
  const { t } = useTranslation();
  const [consent, setConsent] = useState<boolean>(false);

  const handleClose = () => {
    onChange?.(!isOpen);
    setConsent(false);
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={(values, actions) => {
        callback?.();
        actions?.resetForm();
      }}
    >
      {({ values, handleSubmit }) => (
        <DeleteModalAnimation
          title="PROFILE.DANGER_ZONE.DELETE_ACCOUNT"
          isOpen={isOpen}
          onChange={handleClose}
          isLoading={isLoading}
        >
          <VStack gap={8} width={"full"}>
            <BaseText>
              <span style={{ color: VariablesColors.red, fontWeight: "bold" }}>
                {t("COMMON.WARNING.TITLE")} :{" "}
              </span>{" "}
              {t("COMMON.WARNING.DESC")}
            </BaseText>

            {!consent ? (
              <BaseButton
                isLoading={isLoading}
                width={"full"}
                variant={"outline"}
                colorType={"danger"}
                onClick={() => setConsent(true)}
              >
                {t("PROFILE.CONSENT_TITLE")}
              </BaseButton>
            ) : (
              <VStack
                gap={4}
                width={"full"}
                alignItems={"flex-start"}
                animation={"slideIn"}
              >
                <BaseText>{t("COMMON.CONFIRM_TEXT", { value: data })}</BaseText>
                <FormTextInput name="email" />
                <BaseButton
                  isLoading={isLoading}
                  disabled={values.email !== data}
                  width={"full"}
                  colorType={"danger"}
                  onClick={() => handleSubmit()}
                >
                  {t("COMMON.DELETE")}
                </BaseButton>
              </VStack>
            )}
          </VStack>
        </DeleteModalAnimation>
      )}
    </Formik>
  );
};
