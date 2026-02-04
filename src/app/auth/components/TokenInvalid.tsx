"use client";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { BaseButton, BaseText } from "_components/custom";
import { useTranslation } from "react-i18next";

export const TokenInvalid = () => {
  const { t } = useTranslation();
  return (
    <AuthBoxContainer
      title={"Lien invalide"}
      description={
        <BaseText>Ce lien est invalide ou a déjà été utilisé.</BaseText>
      }
    >
      <BaseButton>{t("COMMON.LOGIN")}</BaseButton>
    </AuthBoxContainer>
  );
};
