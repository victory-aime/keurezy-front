"use client";
import { BaseContainer, BaseText } from "_components/custom";
import React from "react";

export const UsersList = () => {
  return (
    <BaseContainer
      title={"Liste des utilisateurs"}
      border={"none"}
      withActionButtons
      actionsButtonProps={{
        validateTitle: "Ajouter un utilisateur",

        onClick() {},
        onReload: async () => {},
      }}
    >
      <BaseText>Aucun utilisateur pour le moment.</BaseText>
    </BaseContainer>
  );
};
