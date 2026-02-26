import { Flex, VStack } from "@chakra-ui/react";
import {
  BaseButton,
  BaseDragDropZone,
  BaseModal,
  BaseText,
  FormCheckbox,
} from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { MODELS, VALIDATION } from "_types/*";
import { Formik, FormikValues } from "formik";
import { HiInformationCircle } from "react-icons/hi2";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoDocumentAttach } from "react-icons/io5";
import { LuUpload } from "react-icons/lu";
import { AgencyModule } from "_store/state-management";
import { useState } from "react";
import { APP_ROUTES } from "_config/routes";
import { useRouter } from "next/navigation";
import { useAuthContext } from "_context/auth-context";

export const RegisterAgencyStep2 = ({
  values,
  Prev,
}: {
  values: MODELS.ICreateAgency;
  Prev?: any;
}) => {
  const router = useRouter();
  const { refetchSession } = useAuthContext();
  const [succesModal, setSuccesModal] = useState<boolean>(false);
  const { mutateAsync: createAgency, isPending: isLoading } =
    AgencyModule.createAgencyMutation({
      mutationOptions: {
        onSuccess: async () => {
          await refetchSession?.().then(() => {
            setSuccesModal(true);
          });
        },
      },
    });

  const onSubmit = async (formValues: FormikValues) => {
    const formData = new FormData();
    formData.append("name", String(values?.name));
    formData.append("description", String(values?.description));
    formData.append("address", String(values?.address));
    formData.append("phone", String(values?.phone));
    formData.append("acceptTerms", formValues?.acceptTerms);
    formData.append("userId", String(values?.userId));
    if (formValues?.agencyLogo) {
      formData.append("agencyLogo", formValues.agencyLogo);
    }
    if (formValues?.documents?.length > 0) {
      formValues.documents.forEach((file: File) => {
        formData.append("documents", file);
      });
    }
    await createAgency({ payload: formData as MODELS.ICreateAgency });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        agencyLogo: null,
        documents: [],
        acceptTerms: false,
      }}
      onSubmit={onSubmit}
      validationSchema={VALIDATION.AGENCY_VALIDATION.createAgencyStep2Schema}
    >
      {({ handleSubmit, isValid, setFieldValue, errors }) => (
        <VStack
          alignItems={"flex-start"}
          justifyContent={"center"}
          gap={5}
          mt={3}
        >
          <BaseDragDropZone
            getFilesUploaded={(files) => setFieldValue("agencyLogo", files)}
            initialImageUrls={[]}
            maxFiles={1}
            label={
              <Flex alignItems={"center"} gap={2}>
                <LuUpload />
                <BaseText>Ajouter l'image de votre agence</BaseText>
              </Flex>
            }
            messageInfo={errors?.agencyLogo}
          />
          <BaseDragDropZone
            getFilesUploaded={(files) => setFieldValue("documents", files)}
            initialImageUrls={[]}
            maxFiles={5}
            label={
              <Flex alignItems={"center"} gap={2}>
                <IoDocumentAttach />
                <BaseText>Documents justificatifs(obligatoire)</BaseText>
              </Flex>
            }
            messageInfo={errors?.documents as any}
          />
          <VStack gap={2} alignItems={"flex-start"}>
            <Flex
              alignItems={"center"}
              gap={1}
              color={VariablesColors.secondary}
            >
              <HiInformationCircle />
              <BaseText>
                Veuillez fournir des documents officiels, lisibles et valides.
              </BaseText>
            </Flex>
            <BaseText>
              Afin de valider la création de votre agence immobilière, nous vous
              demandons de fournir des documents officiels permettant de
              vérifier l'identité et l'existence légale de votre structure.
              <br />
              <br />
              Les documents acceptés peuvent inclure :
              <br />
              • Registre de commerce (RCCM) ou équivalent
              <br />
              • Attestation d'immatriculation fiscale
              <br />
              • Pièce d'identité du représentant légal
              <br />
              • Tout document officiel attestant de l'activité immobilière
              <br />
              <br />
              Ces informations sont strictement confidentielles et utilisées
              uniquement dans le cadre de la vérification de votre agence.
            </BaseText>
          </VStack>
          <FormCheckbox
            name="acceptTerms"
            label={
              "J'accepte les conditions d'utilisation et la Politique de confidentialité"
            }
          />
          <Flex
            width={"full"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
          >
            <Prev>
              <BaseButton
                leftIcon={<IoIosArrowRoundBack />}
                variant={"outline"}
                colorType={"neutral"}
              >
                Precedent
              </BaseButton>
            </Prev>
            <BaseButton
              onClick={() => handleSubmit()}
              isLoading={isLoading}
              isDisabled={!isValid}
            >
              Créer mon agence
            </BaseButton>
          </Flex>
          <BaseModal
            title={"Agence créer"}
            isOpen={succesModal}
            showCloseButton={false}
            ignoreFooter
          >
            <BaseText>
              Super votre agence a ete creer acceder a votre tableau de bord en
              cliquand sur ce boutton
            </BaseText>
            <BaseButton
              mt={2}
              onClick={() => {
                router.push(APP_ROUTES.DASHBOARD);
                setSuccesModal(false);
              }}
            >
              Mon tableau de bord
            </BaseButton>
          </BaseModal>
        </VStack>
      )}
    </Formik>
  );
};
