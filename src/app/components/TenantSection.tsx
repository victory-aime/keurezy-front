import { Box, Container, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import {
  BaseButton,
  BaseIcon,
  BaseText,
  Icons,
  TextVariant,
} from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import { Colors, hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { motion } from "framer-motion";
import Link from "next/link";

const tenantFeatures = [
  {
    icon: Icons.Search,
    title: "Recherche simplifiée",
    description:
      "Trouvez le logement idéal grâce à des filtres avancés et des résultats personnalisés.",
    iconColor: VariablesColors.primary,
    color: "primary",
  },
  {
    icon: Icons.CreditCard,
    title: "Paiements sécurisés",
    description:
      "Payez votre loyer en ligne en toute sécurité, avec confirmation instantanée.",
    iconColor: VariablesColors.success,
    color: "success",
  },
  {
    icon: Icons.Calendar,
    title: "Gestion du bail",
    description:
      "Suivez vos contrats, dates de renouvellement et conditions en un coup d'œil.",
    iconColor: VariablesColors.warning,
    color: "warning",
  },
  {
    icon: Icons.Wrench,
    title: "Demandes de maintenance",
    description:
      "Signalez un problème en quelques clics et suivez l'avancement en temps réel.",
    iconColor: VariablesColors.danger,
    color: "danger",
  },
  {
    icon: Icons.Bell,
    title: "Notifications intelligentes",
    description:
      "Recevez des rappels pour les échéances, paiements et mises à jour importantes.",
    iconColor: VariablesColors.primary,
    color: "primary",
  },
  {
    icon: Icons.Paper,
    title: "Documents numériques",
    description:
      "Accédez à tous vos documents contractuels de manière digitale et sécurisée.",
    iconColor: VariablesColors.tertiary,
    color: "tertiary",
  },
];
const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

export const TenantSection = () => {
  return (
    <Box py={24} width={"full"}>
      <Container mx="auto" px={{ base: 6, sm: 8 }}>
        <MotionVStack
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          maxW={"2xl"}
          mx={"auto"}
          mb={16}
          textAlign={"center"}
        >
          <Flex
            align="center"
            gap={2}
            px={4}
            py={1.5}
            rounded="full"
            bg={hexToRGB("tertiary", 0.1)}
            color="tertiary"
            fontSize="sm"
            fontWeight="medium"
            w="fit-content"
            mb={3}
          >
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg={VariablesColors.tertiary}
              animation="pulse 2s infinite"
              color={"tertiary.500"}
            />
            <BaseText
              color={"tertiary.500"}
              textTransform={"uppercase"}
              fontWeight={"semibold"}
            >
              Espace locataire
            </BaseText>
          </Flex>
          <BaseText
            fontWeight={"semibold"}
            variant={TextVariant.H1}
            lineHeight={1.2}
          >
            Tout ce dont les locataires ont besoin
          </BaseText>
          <BaseText variant={TextVariant.L} mb={2} mt={1} color={"gray.400"}>
            Une interface intuitive pour simplifier chaque étape de votre
            expérience locative.
          </BaseText>
        </MotionVStack>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8}>
          {tenantFeatures.map((feature, i) => (
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

        <MotionVStack
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link href={APP_ROUTES.APPARTEMENTS}>
            <BaseButton
              colorType={"tertiary"}
              rightIcon={<Icons.ArrowRight />}
              mt={10}
            >
              Trouver mon prochain logement
            </BaseButton>
          </Link>
        </MotionVStack>
      </Container>
    </Box>
  );
};
