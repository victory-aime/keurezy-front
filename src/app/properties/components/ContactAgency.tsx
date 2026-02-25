"use client";
import { ContactModule, PropertyModule } from "_store/state-management";
import { CONSTANTS, MODELS, VALIDATION } from "_types/*";
import { findDynamicIdInList } from "rise-core-frontend";
import { PropertiesContainer } from "./PropertiesContainer";
import { Grid, Stack, Box, Flex, Image, HStack } from "@chakra-ui/react";
import {
  BaseText,
  TextWeight,
  Icons,
  TextVariant,
  BaseFormatNumber,
  BaseButton,
  FormTextInput,
  FormTextArea,
  FormPhonePicker,
  ActionsButton,
  BaseIcon,
} from "_components/custom";
import { useAuthContext } from "_context/auth-context";
import { APP_ROUTES } from "_config/routes";
import { UserRole } from "../../../types/enum";
import { Formik } from "formik";
import { Avatar } from "_components/ui/avatar";
import { useRouter } from "next/navigation";
import { hexToRGB } from "_theme/colors";

export const ContactAgency = ({ id }: { id: string }) => {
  const { user } = useAuthContext();
  const callback = `${APP_ROUTES.APPARTEMENT_APPLY}?id=${id}`;
  const router = useRouter();
  const { data: allPublicProperties, isLoading } =
    PropertyModule.getAllPublicProperties({
      queryOptions: { enabled: !!id },
    });

  const property: MODELS.IProperty = findDynamicIdInList(
    id,
    allPublicProperties,
  );

  const { mutateAsync: publicContactRequest, isPending } =
    ContactModule.publicContactRequestMutation({
      mutationOptions: {
        onSuccess: () => router.push(APP_ROUTES.APPARTEMENTS),
      },
    });

  const onSubmit = async (values: MODELS.IContact) => {
    const request: MODELS.IContact = {
      ...values,
      userId: user?.id,
      propertyId: property?.id,
      agencyId: property?.propertyAgenceId,
    };
    await publicContactRequest({ payload: request });
  };

  return (
    <PropertiesContainer
      link={`${APP_ROUTES.APPARTEMENT_DETAIL}?id=${id}`}
      label={"Retour à l'annonce"}
      maxW={"6xl"}
    >
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 400px" }}
        gap={4}
        mt={{ base: 4, sm: 5 }}
      >
        <Formik
          enableReinitialize
          initialValues={
            {
              fullName: user?.name ?? "",
              email: user?.email ?? "",
            } as MODELS.IContact
          }
          onSubmit={onSubmit}
          validationSchema={VALIDATION.CONTACT.ContactValidationSchema}
        >
          {({ handleSubmit, values, isValid }) => (
            <Stack gap={4}>
              {JSON.stringify(values)}
              <Box>
                <BaseText
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  weight={TextWeight.SemiBold}
                >
                  Contacter le propriétaire
                </BaseText>
                <BaseText
                  fontSize={{ base: "md", sm: "sm" }}
                  color={"gray.400"}
                >
                  Posez vos questions ou demandez une visite pour ce logement.
                </BaseText>
              </Box>
              <HStack flexDir={{ base: "column", sm: "row" }}>
                {user ? null : (
                  <>
                    <FormTextInput
                      required
                      name="fullName"
                      label="Nom complet"
                      placeholder="Votre nom"
                    />
                    <FormTextInput
                      required
                      name="email"
                      label="Email"
                      placeholder="votre@mail.com"
                    />
                  </>
                )}
              </HStack>
              <HStack
                gap={2}
                width={"full"}
                flexDir={{ base: "column", sm: "row" }}
              >
                <FormPhonePicker required name="phone" label="PROFILE.PHONE" />
                <FormTextInput
                  required
                  name="subject"
                  label="Object"
                  placeholder="Demande de visite, question"
                />
              </HStack>
              <FormTextArea
                required
                name="message"
                label="Message"
                placeholder="Bonjour, je suis interessé"
              />
              {user?.role !== UserRole?.IMMO_OWNER ? (
                <ActionsButton
                  validateTitle="Envoyer le message"
                  onClick={() => handleSubmit()}
                  isDisabled={isPending || !isValid}
                  icon={<Icons.Send />}
                />
              ) : (
                <Flex alignItems={"center"} gap={3}>
                  <BaseIcon color={hexToRGB("red", 0.8)}>
                    <Icons.Shield />
                  </BaseIcon>
                  <BaseText>
                    En tant que propriétaire, vous ne pouvez pas contacter ou
                    postuler à ce bien.
                  </BaseText>
                </Flex>
              )}
            </Stack>
          )}
        </Formik>
        <Stack gap={8}>
          <Box
            bg="white"
            rounded="xl"
            border="1px solid"
            borderColor="gray.200"
            overflow={"hidden"}
            boxShadow="lg"
          >
            <Image
              src={property?.galleryImages?.[0] as string}
              objectFit={"cover"}
              width={"full"}
              height={"40"}
            />
            <Stack gap={2} p={4}>
              <BaseText variant={TextVariant.M} fontWeight="semibold">
                {property?.title}
              </BaseText>
              <HStack gap={0}>
                <Icons.MapPin />
                <BaseText variant={TextVariant.S}>
                  {property?.address},{" "}
                  {
                    CONSTANTS.citiesByCountry?.[property?.country || ""]?.find(
                      (item) => item.value === property?.city,
                    )?.label
                  }
                </BaseText>
              </HStack>
              <BaseText
                variant={TextVariant.M}
                color={"primary.500"}
                fontWeight="bold"
              >
                <BaseFormatNumber value={property?.price ?? 0} />
                <BaseText as="span" fontSize="md" color="gray.500" ml={1}>
                  /mois
                </BaseText>
              </BaseText>
            </Stack>
          </Box>
          <Box
            bg="white"
            rounded="xl"
            p={6}
            border="1px solid"
            borderColor="gray.200"
            boxShadow="lg"
          >
            <Stack gap={3}>
              <BaseText variant={TextVariant.M} fontWeight="semibold">
                Propriétaire
              </BaseText>
              <Flex gap={2} alignItems={"center"} width={"full"}>
                <Avatar
                  name={property?.propertyAgency?.name}
                  size={"xl"}
                  colorPalette={"purple"}
                />
                <Box>
                  <BaseText
                    textTransform={"capitalize"}
                    lineHeight={1}
                    fontWeight={"semibold"}
                  >
                    {property?.propertyAgency?.name}
                  </BaseText>
                  <BaseText
                    variant={TextVariant.S}
                    color={
                      property?.propertyAgency?.isApprove
                        ? "tertiary.500"
                        : "red.500"
                    }
                  >
                    {property?.propertyAgency?.isApprove
                      ? "Propriétaire vérifiée"
                      : "Propriétaire non vérifiée"}
                  </BaseText>
                </Box>
              </Flex>
              <Box>
                <Flex alignItems={"center"} gap={2} color={"gray.400"}>
                  <Icons.Timer />
                  <BaseText variant={TextVariant.S}>
                    Répond généralement en 2h
                  </BaseText>
                </Flex>
                <Flex alignItems={"center"} gap={2} color={"gray.400"}>
                  <Icons.Phone />
                  <BaseText variant={TextVariant.S}>
                    Disponible par telephone,
                    {property?.propertyAgency?.phone}
                  </BaseText>
                </Flex>
              </Box>
            </Stack>
          </Box>
          {user?.role !== UserRole?.IMMO_OWNER && (
            <Box
              bg="gray.100"
              rounded="xl"
              p={6}
              border="1px solid"
              borderColor="gray.200"
              boxShadow="lg"
            >
              <Stack gap={2}>
                <BaseText textAlign={"center"} variant={TextVariant.M}>
                  Intéressé par ce bien ?
                </BaseText>

                <BaseButton
                  w="full"
                  onClick={() => {
                    if (user) {
                      router.push(callback);
                    } else {
                      router.push(
                        `${APP_ROUTES.AUTH.SIGN_IN}?callbackUrl=${encodeURIComponent(callback)}`,
                      );
                    }
                  }}
                >
                  Postuler maintenant
                </BaseButton>
              </Stack>
            </Box>
          )}
        </Stack>
      </Grid>
    </PropertiesContainer>
  );
};
