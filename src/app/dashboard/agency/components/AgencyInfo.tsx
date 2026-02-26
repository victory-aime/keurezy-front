"use client";

import { VStack, HStack, Flex } from "@chakra-ui/react";
import {
  FormTextInput,
  BaseButton,
  UploadAvatar,
  BaseContainer,
  FormTextArea,
  FormPhonePicker,
  Icons,
  BaseModal,
} from "_components/custom";
import { Formik, FormikValues } from "formik";
import { t } from "i18next";
import { ProfileForm } from "../../profile/components/ProfileForm";
import { AgencyModule, UserModule } from "_store/state-management";
import { ENUM, MODELS, VALIDATION } from "_types/";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { APP_ROUTES } from "_config/routes";
import { authClient } from "../../../lib/auth-client";
import { useGlobalLoader } from "_context/loaderContext";

export const AgencyInfo = () => {
  const [closeAgencyOpen, setCloseAgencyOpen] = useState(false);
  const router = useRouter();
  const { showLoader, hideLoader } = useGlobalLoader();
  const [initalLogo, setInitialLogo] = useState<string>();
  const [initialAgencyValues, setInitialAgencyValues] =
    useState<MODELS.IAgency>({} as MODELS.IAgency);

  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });
  const {
    data: agency,
    isLoading: loadInfo,
    refetch: refetchAgencyInfo,
  } = AgencyModule.getAgencyInfo({
    params: { agencyId: user?.propertyOwner?.propertyAgency?.id },
    queryOptions: {
      enabled: !!user?.propertyOwner?.propertyAgency?.id,
    },
  });

  const { mutateAsync: updateAgency } = AgencyModule.updateAgencyMutation({
    mutationOptions: {
      onSuccess: async () => {
        hideLoader();
        await refetchAgencyInfo();
      },
    },
  });

  const { mutateAsync: closeAgency, isPending: closePending } =
    AgencyModule.closeAgencyMutation({
      mutationOptions: {
        onSuccess: async () => {
          const { data } = await authClient.getSession();
          if (data?.session) {
            hideLoader();
            router.push(APP_ROUTES.ROOT);
          }
        },
      },
    });

  const handleUpdateAgency = async (values: FormikValues) => {
    console.log("values", values);
    const formData = new FormData();
    formData.append("name", String(values?.name));
    formData.append("description", String(values?.description));
    formData.append("address", String(values?.address));
    formData.append("phone", String(values?.phone));
    formData.append("acceptTerms", values?.acceptTerms);
    formData.append("agencyId", String(agency?.id));
    if (values?.agencyLogo) {
      formData.append("agencyLogo", values.agencyLogo);
    }
    await updateAgency({ payload: formData as MODELS.IUpdateAgency });
  };

  const handleCloseAgency = async (values: {
    agencyId: string;
    ownerId: string;
  }) => {
    showLoader();
    await closeAgency({ params: values });
  };

  useEffect(() => {
    if (agency) {
      setInitialAgencyValues(agency);
      setInitialLogo(agency?.agencyLogo);
    }
  }, [agency]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialAgencyValues}
      onSubmit={(values) => {
        showLoader();
        handleUpdateAgency(values);
      }}
      validationSchema={
        VALIDATION.AGENCY_VALIDATION.updateAgencyValidationSchema
      }
    >
      {({ values, handleSubmit, dirty, setFieldValue, errors, isValid }) => {
        console.log("verif", !dirty && !isValid);
        return (
          <>
            <BaseContainer
              gap={8}
              title="Informations de l'agence"
              description="Modifiez et mettez à jour les informations publiques de votre agence."
              loader={loadInfo}
              border={"none"}
            >
              <Flex
                width={"full"}
                gap={5}
                mt={5}
                flexDirection={{ base: "column", md: "row" }}
              >
                <Flex width={{ base: "full", md: "1/2" }}>
                  <UploadAvatar
                    getFileUploaded={(files) =>
                      setFieldValue("agencyLogo", files)
                    }
                    handleDeleteAvatar={() => {}}
                    avatarImage={initalLogo}
                    messageInfo={errors?.agencyLogo}
                  />
                </Flex>

                <VStack width={"full"} gap={4} alignItems="flex-start">
                  <FormTextInput
                    name="name"
                    label="PROFILE.NAME"
                    isLoading={loadInfo}
                  />

                  <FormTextArea
                    name="description"
                    label="Description de l’agence"
                    placeholder="Présentez brièvement votre agence, ses services ou sa spécialité."
                    maxCharacters={500}
                  />

                  <HStack
                    width="full"
                    gap={4}
                    flexDirection={{ base: "column", md: "row" }}
                  >
                    <FormTextInput
                      name="address"
                      label="Adresse de l'agence"
                      leftAccessory={<Icons.MapPin />}
                    />

                    <FormPhonePicker
                      name="phone"
                      label="Téléphone professionnel"
                      listAvailableCountries={["tn"]}
                    />
                  </HStack>
                </VStack>
              </Flex>

              <ProfileForm
                title="Status de l'agence"
                description="Le statut détermine la visibilité de votre agence sur la plateforme. Tant que votre agence est en attente de validation, elle ne sera pas visible par les autres utilisateurs."
                activeBadge={true}
                status={values?.status}
              >
                {values?.status === ENUM.COMMON.Status.PENDING
                  ? "Votre agence est actuellement en cours de validation. Elle sera visible dès qu’elle aura été approuvée."
                  : "Votre agence est active et visible par les utilisateurs de la plateforme."}
              </ProfileForm>
              <ProfileForm
                title="PROFILE.DANGER_ZONE.TITLE"
                description="Cette section regroupe des actions sensibles pouvant impacter définitivement votre compte. Merci de procéder avec prudence."
                borderColor="red"
                borderWidth={1.5}
                borderRadius="7px"
              >
                <BaseButton
                  withGradient
                  colorType="danger"
                  onClick={() => setCloseAgencyOpen(true)}
                >
                  {t("Fermer définitivement l’agence")}
                </BaseButton>
              </ProfileForm>
            </BaseContainer>
            <Flex width="full" alignItems="flex-end" justifyContent="flex-end">
              <BaseButton
                colorType="success"
                onClick={() => handleSubmit()}
                isDisabled={!dirty || !isValid}
              >
                {t("Sauvegarder les changements")}
              </BaseButton>
            </Flex>
            <BaseModal
              icon={<Icons.Close />}
              isOpen={closeAgencyOpen}
              onChange={() => setCloseAgencyOpen(false)}
              title="Confirmer la fermeture définitive de l’agence"
              modalType={"alertdialog"}
              onClick={() => {
                handleCloseAgency({
                  agencyId: agency?.id!,
                  ownerId: agency?.ownerId!,
                });
                setCloseAgencyOpen(!closeAgencyOpen);
              }}
              buttonSaveTitle={"Confirmer la fermeture"}
            >
              La fermeture de votre agence est irréversible. Vous perdrez
              définitivement l’accès à votre espace propriétaire ainsi qu’aux
              services associés. Êtes-vous certain de vouloir poursuivre ?
            </BaseModal>
          </>
        );
      }}
    </Formik>
  );
};
