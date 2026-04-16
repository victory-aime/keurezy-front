// Extrait — LandForm.tsx (partie modifiée uniquement)
// Remplace le onClick de ActionsButton par validateAndSubmit

import { VStack, Flex, HStack } from "@chakra-ui/react";
import {
  FormTextInput,
  FormSelect,
  BaseUploadMultipleFiles,
  Icons,
  BaseText,
  ActionsButton,
} from "_components/custom";
import { cityList } from "_constants/city";
import { useFormikValidationToast } from "_hooks/useFormikValidationToast";
import { useRouter } from "next/navigation";
import { FormCard } from "../../components/FormCard";
import { DASHBOARD_ROUTES } from "../../routes";
import { landPaymentTypeList, landStatusList } from "../constants/land-status";

// ─── Inner form (accède au contexte Formik) ──────────────────────────────────
export const LandFormInner = ({
  landId,
  isCreateLand,
  isUpdateBuilding,
  documentsURL,
}: {
  landId: string;
  isCreateLand: boolean;
  isUpdateBuilding: boolean;
  documentsURL: string[];
}) => {
  const router = useRouter();

  // ✅ Le hook utilise useFormikContext en interne — pas besoin de passer errors/handleSubmit manuellement
  const { validateAndSubmit } = useFormikValidationToast();
  // handleSubmit et setFieldValue récupérés via le render prop parent (voir LandForm)
  // On les récupère ici via useFormikContext pour garder la logique dans l'inner component
  const { handleSubmit, setFieldValue } = require("formik").useFormikContext();

  return (
    <VStack gap={3} alignItems={"flex-end"} width={"full"}>
      <Flex width={"full"} gap={4} flexDir={{ base: "column", sm: "row" }}>
        <FormCard title="Informations principales">
          <VStack width={"full"} mt={4} gap={4}>
            <HStack
              width={"full"}
              gap={4}
              flexDir={{ base: "column", sm: "row" }}
            >
              <FormTextInput
                required
                name="title"
                label="Nom du Terrain"
                placeholder="Residence Bosh"
              />
              <FormTextInput
                name="landOwner"
                label="Nom du propriétaire du terrain"
                placeholder="Ahmed Toure"
              />
            </HStack>

            <HStack
              width={"full"}
              gap={4}
              flexDir={{ base: "column", sm: "row" }}
            >
              <FormSelect
                required
                name="city"
                label="Ville"
                listItems={cityList}
                setFieldValue={setFieldValue}
              />
              <FormTextInput
                name="district"
                label="Quartier"
                placeholder="Grand Dakar"
              />
              <FormTextInput
                required
                name="address"
                label="Adresse complète"
                placeholder="Cite avion ouakam"
              />
            </HStack>

            <HStack
              width={"full"}
              gap={4}
              flexDir={{ base: "column", sm: "row" }}
            >
              <FormTextInput
                required
                label="Prix de vente"
                placeholder="Ex: 500.0000"
                name="purchasePrice"
                type="amount"
              />
              <FormTextInput
                required
                label="Surface (m²)"
                placeholder="Ex: 120"
                name="area"
                type="number"
              />
            </HStack>

            <HStack
              width={"full"}
              gap={4}
              flexDir={{ base: "column", sm: "row" }}
            >
              <FormSelect
                name="paymentType"
                label="Mode de paiement"
                listItems={landPaymentTypeList}
                setFieldValue={setFieldValue}
              />
              <FormSelect
                name="status"
                label="Status"
                listItems={landStatusList}
                setFieldValue={setFieldValue}
              />
            </HStack>

            <BaseUploadMultipleFiles
              initialImageUrls={documentsURL}
              getFilesUploaded={(files) => setFieldValue("documents", files)}
              label={
                <Flex fontSize={"sm"} alignItems={"center"} gap={2}>
                  <Icons.Paper />
                  <BaseText fontSize={"sm"}>
                    Fichier juridiques(images, pdf, doc, etc...)
                  </BaseText>
                </Flex>
              }
            />
          </VStack>
        </FormCard>
      </Flex>

      <ActionsButton
        validateTitle={landId ? "Modifier" : "Ajouter"}
        isLoading={isCreateLand || isUpdateBuilding}
        onCancel={() => router.push(DASHBOARD_ROUTES.LAND.LIST)}
        // ✅ validateAndSubmit gère validation + toast + soumission
        onClick={() => validateAndSubmit(handleSubmit)}
        icon={landId ? <Icons.Edit /> : <Icons.PlusMinus />}
      />
    </VStack>
  );
};
