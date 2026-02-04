import { BaseModal, BaseText, ModalOpenProps } from "_components/custom";
import { CiMail } from "react-icons/ci";
import React from "react";

export const SendEmailRecap = ({ isOpen, onChange, data }: ModalOpenProps) => {
  return (
    <BaseModal
      title={data?.title}
      icon={<CiMail />}
      iconBackgroundColor={"tertiary.500"}
      ignoreFooter
      isOpen={isOpen}
      onChange={onChange}
    >
      <BaseText textAlign={"center"}>
        Un lien de vérification vient d’être envoyé à votre adresse email.
        Veuillez cliquer sur ce lien pour confirmer votre compte et finaliser
        votre inscription.
      </BaseText>
      <span style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
        Pensez à vérifier votre dossier <strong>spam</strong> si vous ne voyez
        pas l’email dans votre boîte de réception.
      </span>
    </BaseModal>
  );
};
