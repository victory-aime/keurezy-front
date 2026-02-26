import { motion } from "framer-motion";
import { BaseIcon, BaseText, Icons, TextVariant } from "_components/custom";
import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { Colors, hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";

const features = [
  {
    icon: Icons.Zap,
    title: "Ultra rapide",
    description:
      "Interface optimisée pour des interactions instantanées et fluides.",
    iconColor: VariablesColors.orange,
    color: "orange",
  },
  {
    icon: Icons.World,
    title: "Accessible partout",
    description:
      "Gérez vos biens depuis n'importe quel appareil, à tout moment.",
    iconColor: VariablesColors.primary,
    color: "primary",
  },
  {
    icon: Icons.Shield,
    title: "Sécurité maximale",
    description: "Chiffrement de bout en bout et authentification renforcée.",
    iconColor: VariablesColors.tertiary,
    color: "tertiary",
  },
  {
    icon: Icons.Mobile,
    title: "Mobile-first",
    description: "Conçu pour une expérience mobile native et responsive.",
    iconColor: VariablesColors.primary,
    color: "primary",
  },
  {
    icon: Icons.Timer,
    title: "Gain de temps",
    description:
      "Automatisez les tâches répétitives et concentrez-vous sur l'essentiel.",
    iconColor: VariablesColors.orange,
    color: "orange",
  },
  {
    icon: Icons.LuHeartHandshake,
    title: "Support dédié",
    description: "Une équipe disponible pour vous accompagner à chaque étape",
    iconColor: VariablesColors.tertiary,
    color: "tertiary",
  },
];
const MotionBox = motion.create(Box);

export const FeaturesSection = () => {
  return (
    <Box width={"full"}>
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
            variant={TextVariant.H3}
            color={"primary.500"}
            textTransform={"uppercase"}
            fontWeight={"semibold"}
            mb={2}
          >
            Pourquoi MyIMMO
          </BaseText>
          <BaseText
            fontWeight={"semibold"}
            variant={TextVariant.H1}
            lineHeight={1.2}
          >
            La plateforme qui fait la différence
          </BaseText>
          <BaseText variant={TextVariant.L} mb={2} mt={1} color={"gray.400"}>
            Des fonctionnalités pensées pour simplifier la gestion locative au
            quotidien.
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
              border={"1px solid"}
              borderColor={"bg.muted"}
              shadow={"sm"}
              p={6}
            >
              <BaseIcon color={hexToRGB(feature.color as keyof Colors, 0.1)}>
                <feature.icon size={20} color={feature.iconColor} />
              </BaseIcon>
              <BaseText mb={1} mt={1} fontWeight={"semibold"}>
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
