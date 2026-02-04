import { BaseText, BaseButton } from "_components/custom";
import { AuthBoxContainer } from "./AuthBoxContainer";

export const UnknownError = () => {
  return (
    <AuthBoxContainer
      title={"Erreur"}
      description={
        <BaseText>
          Une erreur est survenue lors de la vérification. Veuillez réessayer ou
          contacter le support..
        </BaseText>
      }
    >
      <BaseButton>Contacter l'équipe support</BaseButton>
    </AuthBoxContainer>
  );
};
