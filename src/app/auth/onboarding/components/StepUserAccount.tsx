import { Box, VStack, Flex, Heading, Text } from "@chakra-ui/react";
import { Icons, FormTextInput } from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { useFormikContext } from "formik";
import { DashboardMockup } from "./DashboardMockup";
import { OnboardCardWrapper } from "./OnboardCardWrapper";
import { MODELS } from "_types/*";
import { DirectLive } from "./DirectLive";
import { GridContainer } from "./GridContainer";
import { PasswordIndicator } from "_component/PasswordIndicator";

export const StepUserAccount = () => {
  const { values } = useFormikContext<{
    account: MODELS.IAuthSignUp;
    business: MODELS.ICreateAgency;
  }>();

  return (
    <GridContainer alignItems="start">
      <VStack gap={6} align="stretch">
        <VStack gap={3} align="flex-start">
          <Flex
            bgColor={hexToRGB("orange", 0.1)}
            color={"orange.500"}
            borderRadius="full"
            px={3}
            py={1}
            alignItems="center"
            gap={1}
          >
            <Icons.Setting size={11} />
            Configuration
          </Flex>
          <Heading
            fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
            fontWeight={"bold"}
            lineHeight={1.1}
          >
            Configurons votre compte ensemble
          </Heading>
          <Text
            bgClip={"text"}
            gradientFrom={"primary.400"}
            gradientVia={"primary.500"}
            gradientTo={"tertiary.500"}
            bgGradient={"to-r"}
            color={"transparent"}
          >
            Vos informations apparaîtront en direct dans l'aperçu
          </Text>
        </VStack>

        <OnboardCardWrapper>
          <VStack gap={4} align="stretch">
            <FormTextInput
              required
              name="account.name"
              label="Nom complet"
              placeholder="Jean Dupont"
            />
            <FormTextInput
              required
              name="account.email"
              label="Email"
              type={"email"}
              placeholder="jean@immobilier.fr"
            />
            <FormTextInput
              required
              name="account.password"
              label="Mot de passe"
              type={"password"}
              placeholder="Jeanimmobilier123!@<>!"
            />
          </VStack>
          <PasswordIndicator password={values.account.password} />
        </OnboardCardWrapper>
      </VStack>

      <Box>
        <DirectLive />
        <DashboardMockup
          userName={values?.account.name ?? "Jean Dupont"}
          role={"Propriété"}
          animated
        />
      </Box>
    </GridContainer>
  );
};
