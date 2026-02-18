import { motion } from "framer-motion";
import { BaseIcon, BaseText, Icons, TextVariant } from "_components/custom";
import { Box, Container, SimpleGrid } from "@chakra-ui/react";

const features = [
  {
    icon: Icons.RiBuildingLine,
    title: "Gestion intelligente",
    description:
      "Centralisez la gestion de tous vos biens immobiliers depuis une interface unique et intuitive.",
    color: "primary.500",
  },
  {
    icon: Icons.CreditCard,
    title: "Paiements en ligne",
    description:
      "Collectez les loyers automatiquement et suivez les paiements en temps réel.",
    color: "secondary.500",
  },
  {
    icon: Icons.User,
    title: "Suivi des locataires",
    description:
      "Gérez les profils locataires, contrats et communications depuis un seul endroit.",
    color: "tertiary.500",
  },
  {
    icon: Icons.Wrench,
    title: "Demandes de maintenance",
    description:
      "Recevez et traitez les demandes d'intervention avec un système de tickets intégré.",
    color: "red.500",
  },
  {
    icon: Icons.Chart,
    title: "Tableau de bord analytique",
    description:
      "Visualisez les performances de votre portefeuille avec des rapports détaillés.",
    color: "success.500",
  },
  {
    icon: Icons.Shield,
    title: "Authentification sécurisée",
    description:
      "Protégez vos données avec une authentification robuste et un chiffrement de bout en bout.",
    color: "blue.500",
  },
];
const MotionBox = motion(Box);

export const FeaturesSection = () => {
  return (
    <Box py={10} bgColor={"bg.muted"} width={"full"}>
      <Container mx="auto" px={{ base: 6, sm: 8 }}>
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
            Fonctionnalités
          </BaseText>
          <BaseText variant={TextVariant.M}>
            Tout ce dont vous avez besoin
          </BaseText>
          <BaseText variant={TextVariant.M} mb={2}>
            Une suite d'outils puissants pour simplifier chaque aspect de la
            gestion locative.Chaque outil est conçu pour simplifier votre
            quotidien et maximiser votre rendement locatif.
          </BaseText>
        </MotionBox>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8}>
          {features.map((feature, i) => (
            <MotionBox
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              rounded={"xl"}
              bgColor={"white"}
              border={"1px solid"}
              borderColor={"bg.muted"}
              shadow={"md"}
              p={6}
            >
              <BaseIcon color={feature.color}>
                <feature.icon />
              </BaseIcon>
              <BaseText mb={1} mt={1}>
                {feature.title}
              </BaseText>
              <BaseText>{feature.description}</BaseText>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
