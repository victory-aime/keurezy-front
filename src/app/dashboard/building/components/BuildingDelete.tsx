import { Span } from "@chakra-ui/react";
import {
  DeleteModalAnimation,
  BaseText,
  ModalOpenProps,
} from "_components/custom";

export const BuildingDelete = ({
  isOpen,
  isLoading,
  callback,
  onChange,
  data,
}: ModalOpenProps) => {
  return (
    <DeleteModalAnimation
      title={"Supprimer ce bâtiment"}
      onChange={onChange}
      isOpen={isOpen}
      ignoreFooter={false}
      isLoading={isLoading}
      buttonSaveTitle="Supprimer"
      callback={callback}
    >
      <BaseText textAlign={"center"} fontSize={"sm"}>
        Êtes-vous sûr de vouloir supprimer l'immeuble{" "}
        <Span color={"primary.500"}> {data?.name}</Span> ? Cette action est
        irréversible et supprimera également toutes les propriétes associées.
      </BaseText>
    </DeleteModalAnimation>
  );
};
