import { motion } from "framer-motion";
import {
  BaseText,
  Icons,
  TextVariant,
  BaseIcon,
  TextWeight,
} from "_components/custom";
import { Box, Container, SimpleGrid, VStack } from "@chakra-ui/react";
import { VariablesColors } from "_theme/variables";
import { hexToRGB } from "_theme/colors";
const steps = [
  {
    icon: Icons.UserPlus,
    step: "01",
    title: "Créez votre compte",
    description:
      "Inscrivez-vous gratuitement et configurez votre profil en quelques minutes.",
  },
  {
    icon: Icons.RiBuildingLine,
    step: "02",
    title: "Ajoutez vos biens",
    description:
      "Importez vos propriétés, définissez les loyers et invitez vos locataires.",
  },
  {
    icon: Icons.Trending,
    step: "03",
    title: "Gérez et optimisez",
    description:
      "Suivez les paiements, gérez les maintenances et maximisez votre rendement.",
  },
];

const MotionBox = motion(Box);
const MotionVstack = motion(VStack);

export const HowItWorksSection = () => {
  return (
    <Box py={10}>
      <Container mx="auto" px={{ base: 6, lg: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          maxW={"2xl"}
          mx={"auto"}
          mb={16}
          textAlign={"center"}
        >
          <BaseText
            variant={TextVariant.S}
            color={"primary.500"}
            textTransform={"uppercase"}
            mb={2}
          >
            Comment ça marche
          </BaseText>
          <BaseText variant={TextVariant.M}>Trois étapes simples</BaseText>
          <BaseText variant={TextVariant.M} mb={2}>
            Commencez à gérer vos propriétés en quelques minutes, pas en
            quelques jours.
          </BaseText>
        </MotionBox>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={10} position={"relative"}>
          {steps.map((step, i) => (
            <MotionVstack
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              position={"relative"}
              textAlign={"center"}
            >
              <BaseIcon
                color={hexToRGB("primary", 0.1)}
                mb={3}
                boxSize={"60px"}
              >
                <step.icon color={VariablesColors.primary} size={24} />
              </BaseIcon>

              <BaseText
                color={"primary.500"}
                textTransform={"uppercase"}
                variant={TextVariant.S}
                weight={TextWeight.Bold}
              >
                Étape {step.step}
              </BaseText>
              <BaseText
                variant={TextVariant.XS}
                weight={TextWeight.SemiBold}
                mt={1}
                mb={1}
              >
                {step.title}
              </BaseText>
              <BaseText variant={TextVariant.XS} maxW={"xs"} mx={"auto"}>
                Étape {step.description}
              </BaseText>
            </MotionVstack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
