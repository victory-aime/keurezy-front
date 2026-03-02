import {
  Box,
  VStack,
  Flex,
  Heading,
  HStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  Icons,
  FormTextInput,
  FormPhonePicker,
  FormTextArea,
  BaseDragDropZone,
  BaseText,
  FormCheckbox,
} from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { useFormikContext } from "formik";
import { motion } from "framer-motion";
import { DashboardMockup } from "./DashboardMockup";
import { OnboardCardWrapper } from "./OnboardCardWrapper";
import { VariablesColors } from "_theme/variables";
import { HiInformationCircle } from "react-icons/hi2";
import { DirectLive } from "./DirectLive";
import { GridContainer } from "./GridContainer";
import { MODELS } from "_types/*";

const MotionBox = motion(Box);

export const StepBusiness = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { values, setFieldValue, errors } = useFormikContext<{
    account: MODELS.IAuthSignUp;
    business: MODELS.ICreateAgency;
  }>();

  return (
    <GridContainer alignItems="start">
      <VStack gap={6} align="stretch">
        <VStack gap={2} align="flex-start">
          <Flex
            bgColor={hexToRGB("tertiary", 0.1)}
            color={"tertiary.500"}
            borderRadius="full"
            px={3}
            py={1}
            alignItems="center"
            gap={1}
          >
            <Icons.Target size={11} />
            Agence
          </Flex>
          <Heading
            fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
            fontWeight={"bold"}
          >
            Parlez-nous de votre Agence
          </Heading>
          <Text
            bgClip={"text"}
            gradientFrom={"primary.400"}
            gradientVia={"primary.500"}
            gradientTo={"tertiary.500"}
            bgGradient={"to-r"}
            color={"transparent"}
          >
            Le tableau de bord reflète instantanément vos choix
          </Text>
        </VStack>

        <OnboardCardWrapper>
          <VStack gap={5} align="stretch">
            <FormTextInput
              required
              name="business.name"
              label="Société"
              placeholder="Nom de votre société"
            />
            <FormTextArea
              required
              name="business.description"
              label="Description"
              placeholder="----"
              maxCharacters={500}
            />
            <HStack
              width={"full"}
              flexDirection={{ base: "column-reverse", md: "row-reverse" }}
            >
              <FormPhonePicker
                required
                name="business.phone"
                label="Telephone"
                listAvailableCountries={["tn", "cd", "cg"]}
              />
              <FormTextInput
                required
                name="business.address"
                placeholder="Sousse,Tunis, Monastir"
                label="Addresse"
              />
            </HStack>

            <BaseDragDropZone
              getFilesUploaded={(files) =>
                setFieldValue("business.documents", files)
              }
              initialImageUrls={[]}
              maxFiles={5}
              label={
                <Flex fontSize={"sm"} alignItems={"center"} gap={2}>
                  <Icons.Paper />
                  <BaseText fontSize={"sm"}>
                    Documents justificatifs(obligatoire)
                  </BaseText>
                </Flex>
              }
              messageInfo={errors?.business?.documents as any}
            />
            {isMobile && (
              <VStack gap={2} alignItems={"flex-start"}>
                <Flex
                  alignItems={"center"}
                  gap={1}
                  color={VariablesColors.secondary}
                >
                  <HiInformationCircle />
                  <BaseText>
                    Veuillez fournir des documents officiels, lisibles et
                    valides.
                  </BaseText>
                </Flex>
                <BaseText fontSize={"sm"} color={"gray.500"}>
                  Afin de valider la création de votre agence immobilière, nous
                  vous demandons de fournir des documents officiels permettant
                  de vérifier l'identité et l'existence légale de votre
                  structure.
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
            )}

            <FormCheckbox
              name="business.acceptTerms"
              label={
                "J'accepte les conditions d'utilisation et la Politique de confidentialité"
              }
            />
          </VStack>
        </OnboardCardWrapper>
      </VStack>

      <Box>
        <DirectLive />

        {/* Wrapper RELATIVE obligatoire */}
        <Box position="relative">
          {/* Mockup */}
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <MotionBox
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <DashboardMockup
                userName={values?.account.name ?? "Jean Dupont"}
                company={values?.business.name}
                properties={200}
                rent={3000}
                location={"Paris"}
                animated
              />
            </MotionBox>
          </MotionBox>

          {/* Floating Info Card */}
          <MotionBox
            display={{ base: "none", sm: "block" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
            position="absolute"
            width={"full"}
            bottom="-70%"
            left="0%"
            zIndex={20}
          >
            <MotionBox
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <OnboardCardWrapper
                p={4}
                shadow="xl"
                borderColor={"secondary.500"}
              >
                <VStack gap={2} alignItems={"flex-start"} width={"full"}>
                  <Flex
                    alignItems={"center"}
                    gap={1}
                    color={VariablesColors.secondary}
                  >
                    <HiInformationCircle />
                    <BaseText>
                      Veuillez fournir des documents officiels, lisibles et
                      valides.
                    </BaseText>
                  </Flex>
                  <BaseText fontSize={"sm"} color={"gray.500"}>
                    Afin de valider la création de votre agence immobilière,
                    nous vous demandons de fournir des documents officiels
                    permettant de vérifier l'identité et l'existence légale de
                    votre structure.
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
                    Ces informations sont strictement confidentielles et
                    utilisées uniquement dans le cadre de la vérification de
                    votre agence.
                  </BaseText>
                </VStack>
              </OnboardCardWrapper>
            </MotionBox>
          </MotionBox>
        </Box>
      </Box>
    </GridContainer>
  );
};
