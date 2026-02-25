"use client";
import {
  ActionsButton,
  BaseFormatNumber,
  BaseIcon,
  BaseModal,
  BaseText,
  CustomToast,
  FormPhonePicker,
  FormTextArea,
  Icons,
  TextVariant,
  TextWeight,
} from "_components/custom";
import {
  Box,
  Flex,
  Image,
  Stack,
  HStack,
  VStack,
  Span,
} from "@chakra-ui/react";
import { APP_ROUTES } from "_config/routes";
import { VariablesColors } from "_theme/variables";
import { useAuthContext } from "_context/auth-context";
import { PropertyModule, RentalModule } from "_store/state-management";
import { findDynamicIdInList } from "rise-core-frontend";
import { MODELS, CONSTANTS, VALIDATION } from "_types/";
import { Formik } from "formik";
import { hexToRGB } from "_theme/colors";
import { useRouter } from "next/navigation";
import { PropertyApplySkeletonLoad } from "./PropertyApplySkeletonLoad";
import { useState } from "react";
import { PropertiesContainer } from "./PropertiesContainer";

export const PropertyApply = ({ id }: { id: string }) => {
  const { session, user } = useAuthContext();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const router = useRouter();

  const { data: allPublicProperties, isLoading } =
    PropertyModule.getAllPublicProperties({
      queryOptions: { enabled: !!id },
    });

  const { mutateAsync: createRental, isPending } =
    RentalModule.createRentalMutation({
      mutationOptions: {
        onSuccess: () => {
          setOpenSuccessModal(true);
        },
      },
    });

  const property: MODELS.IProperty = findDynamicIdInList(
    id,
    allPublicProperties,
  );

  if (isLoading) {
    return <PropertyApplySkeletonLoad isLoading={isLoading} />;
  }

  const onSubmit = async (values: MODELS.IRentalRequest) => {
    await createRental({ payload: values });
  };

  return (
    <PropertiesContainer
      link={`${APP_ROUTES.APPARTEMENT_DETAIL}?id=${id}`}
      label={"Retour à l'annonce"}
      maxW={"4xl"}
    >
      <Formik
        initialValues={
          {
            propertyId: id,
            tenantId: user?.id,
          } as MODELS.IRentalRequest
        }
        onSubmit={onSubmit}
        validationSchema={VALIDATION.RENTAL.createRentalRequestSchema}
      >
        {({ handleSubmit }) => (
          <Stack width={"full"} gap={8}>
            <Stack justifyContent={"flex-start"} mt={2} gap={0}>
              <BaseText variant={TextVariant.H3} weight={TextWeight.SemiBold}>
                Postuler pour ce logement
              </BaseText>
              <BaseText variant={TextVariant.S} color={"gray.400"}>
                Remplissez le formulaire ci-dessous pour envoyer votre
                candidature au propriétaire.
              </BaseText>
            </Stack>
            <Flex
              p={4}
              border={"1px solid"}
              borderColor="border"
              width={"full"}
              rounded={"lg"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Flex gap={3} alignItems={"center"}>
                <Box
                  rounded="lg"
                  overflow="hidden"
                  width={"24"}
                  height={"20"}
                  transition="all 0.2s ease"
                  _hover={{
                    opacity: 1,
                  }}
                >
                  <Image
                    src={property?.galleryImages?.[0] as string}
                    alt=""
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
                <VStack alignItems={"flex-start"} gap={0}>
                  <BaseText>{property?.title}</BaseText>
                  <HStack gap={0}>
                    <Icons.MapPin />
                    <BaseText color={"gray.500"} variant={TextVariant.XS}>
                      {property?.address},
                      {
                        CONSTANTS.citiesByCountry?.[
                          property?.country || ""
                        ]?.find((item) => item.value === property?.city)?.label
                      }
                    </BaseText>
                  </HStack>
                </VStack>
              </Flex>

              <BaseText
                variant={TextVariant.L}
                weight={TextWeight.SemiBold}
                color={"primary.500"}
              >
                <BaseFormatNumber value={property?.price ?? 0} />
                <Span fontSize={"xs"} color={"gray.400"}>
                  /mois
                </Span>
              </BaseText>
            </Flex>

            <Box width={"full"}>
              <Flex gap={3} alignItems={"center"} mb={3}>
                <BaseIcon color={hexToRGB("tertiary", 0.2)}>
                  <Icons.Mail color={VariablesColors.tertiary} />
                </BaseIcon>
                <BaseText>Coordonnées</BaseText>
              </Flex>
              <FormPhonePicker
                required
                name="phone"
                label="PROFILE.PHONE"
                listAvailableCountries={["cd"]}
              />
            </Box>

            <Box width={"full"}>
              <Flex gap={3} alignItems={"center"} mb={3}>
                <BaseIcon color={hexToRGB("primary", 0.2)}>
                  <Icons.Mail color={VariablesColors.primary} />
                </BaseIcon>
                <BaseText>Message au propriétaire</BaseText>
              </Flex>
              <FormTextArea
                required
                name="message"
                label="Présentez-vous et expliquez votre projet"
                placeholder="Présentez-vous et expliquez votre projet"
              />
            </Box>

            <VStack
              p={4}
              border={"1px solid"}
              bgColor={"gray.50"}
              borderColor={"border"}
              width={"full"}
              rounded={"lg"}
              gap={4}
              alignItems={"flex-start"}
            >
              <BaseText>Récaputilatif</BaseText>
              <Flex
                width={"full"}
                justifyContent={"space-between"}
                gap={4}
                flexDir={{ base: "column", sm: "row" }}
              >
                <VStack
                  alignItems={"flex-start"}
                  justifyContent={"space-between"}
                  width={"full"}
                >
                  <HStack width={"full"} justifyContent={"space-between"}>
                    <BaseText color={"gray.400"}>Bien</BaseText>
                    <BaseText>{property?.title}</BaseText>
                  </HStack>
                  <HStack width={"full"} justifyContent={"space-between"}>
                    <BaseText color={"gray.400"}>Dépôt de garantie</BaseText>
                    <BaseFormatNumber value={property?.locationCaution ?? 0} />
                  </HStack>
                </VStack>
                <VStack
                  alignItems={"flex-start"}
                  justifyContent={"space-between"}
                  width={"full"}
                >
                  <HStack width={"full"} justifyContent={"space-between"}>
                    <BaseText color={"gray.400"}>Loyer mensuel</BaseText>
                    <BaseFormatNumber value={property?.price ?? 0} />
                  </HStack>
                </VStack>
              </Flex>
              <BaseText variant={TextVariant.S} color={"gray.400"}>
                En soumettant ce formulaire, vous acceptez que vos informations
                soient transmises au propriétaire du bien. Vos données sont
                protégées conformément à notre politique de confidentialité.
              </BaseText>
            </VStack>
            <ActionsButton
              justifyContent={"flex-end"}
              onCancel={() =>
                router.push(`${APP_ROUTES.APPARTEMENT_DETAIL}?id=${id}`)
              }
              cancelColor="neutral"
              cancelVariant="outline"
              icon={<Icons.Send />}
              onClick={() => handleSubmit()}
              isLoading={isPending}
              validateTitle="Envoyer ma candidature"
            />
          </Stack>
        )}
      </Formik>
      <BaseModal
        title={"Candidature envoyée !"}
        isOpen={openSuccessModal}
        onChange={() => {
          router.push(APP_ROUTES.APPARTEMENTS);
          setOpenSuccessModal(false);
        }}
        showCloseButton={false}
        closeOnEscape={false}
        closeOnInteractOutside={false}
        icon={<Icons.Check size={40} />}
        iconBackgroundColor="tertiary.500"
        buttonCancelTitle="Voir d'autres biens"
        buttonSaveTitle="Retour à l'acceuil"
        colorCancelButton="neutral"
        iconCancelButton={<Icons.Search />}
        iconSaveButton={<Icons.Home />}
        onClick={() => {
          router.push(APP_ROUTES.ROOT);
          setOpenSuccessModal(false);
        }}
      >
        <VStack gap={3}>
          <Box maxW={"2xl"} textAlign={"center"}>
            <BaseText weight={TextWeight.Light}>
              Votre candidature a bien été transmise au propriétaire. Vous
              recevrez une réponse sous
              <Span fontWeight={"semibold"}> 48 heures.</Span>
            </BaseText>
          </Box>
          <Box
            bg="gray.100"
            p={3}
            border={"1px solid"}
            bgColor={"gray.50"}
            borderColor={"border"}
            rounded={"lg"}
            width={"full"}
          >
            <BaseText weight={TextWeight.Regular}>Prochaines étapes</BaseText>
            <VStack gap={3} alignItems={"flex-start"} mt={2} color={"gray.600"}>
              {[
                {
                  step: 1,
                  desc: "Le propriétaire examine votre candidature",
                },
                {
                  step: 2,
                  desc: "Il vous contacte par email ou téléphone",
                },
                {
                  step: 3,
                  desc: "Vous planifiez une visite du logement",
                },
                {
                  step: 4,
                  desc: "Signature du bail et remise des clés",
                },
              ].map((item, i) => (
                <HStack key={i}>
                  <Box
                    bgColor={hexToRGB("primary", 0.1)}
                    color={"primary.500"}
                    px={2}
                    py={1}
                    borderRadius={"full"}
                  >
                    {item?.step}
                  </Box>
                  <BaseText>{item.desc}</BaseText>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      </BaseModal>
    </PropertiesContainer>
  );
};
