"use client";
import { PropertyModule } from "_store/state-management";
import { MODELS } from "_types/*";
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
  CustomToast,
} from "_components/custom";
import Link from "next/link";
import { useAuthContext } from "_context/auth-context";
import { APP_ROUTES } from "_config/routes";
import { UserRole } from "../../../types/enum";
import { Formik } from "formik";
import { Avatar } from "_components/ui/avatar";

export const ContactAgency = ({ id }: { id: string }) => {
  const { user } = useAuthContext();
  const { data: allPublicProperties, isLoading } =
    PropertyModule.getAllPublicProperties({
      queryOptions: { enabled: !!id },
    });

  const property: MODELS.IProperty = findDynamicIdInList(
    id,
    allPublicProperties,
  );

  const onSubmit = () => {
    CustomToast({
      title: "Message envoyé !",
      description: "Le propriétaire vous répondra dans les plus brefs délais.",
    });
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
        <Formik initialValues={{}} onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <Stack gap={4}>
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
                <FormTextInput
                  required
                  name="name"
                  label="Nom complet"
                  placeholder="Votre nom"
                />
                <FormTextInput
                  required
                  name="name"
                  label="Email"
                  placeholder="votre@mail.com"
                />
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
              {user?.role !== UserRole?.IMMO_OWNER && (
                <ActionsButton
                  validateTitle="Envoyer le message"
                  onClick={() => handleSubmit()}
                  icon={<Icons.Send />}
                />
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
              src={property?.galleryImages?.[0]}
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
                <BaseText variant={TextVariant.S}>{property?.address}</BaseText>
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

                <Link href={`${APP_ROUTES.APPARTEMENT_APPLY}?id=${id}`}>
                  <BaseButton w="full">Postuler maintenant</BaseButton>
                </Link>
              </Stack>
            </Box>
          )}
        </Stack>
      </Grid>
    </PropertiesContainer>
  );
};
