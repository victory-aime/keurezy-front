import {
  Box,
  Container,
  Flex,
  List,
  SimpleGrid,
  Span,
  VStack,
} from "@chakra-ui/react";
import { BaseIcon, BaseText, Icons, TextVariant } from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { motion } from "framer-motion";

const tenantBenefits = [
  "Recherche de logement simplifiée",
  "Paiement sécurisé en ligne",
  "Suivi des demandes de maintenance",
  "Documents contractuels numériques",
  "Notifications intelligentes",
];

const ownerBenefits = [
  "Tableau de bord analytique complet",
  "Collecte automatique des loyers",
  "Gestion multi-propriétés",
  "Suivi des performances en temps réel",
  "Accès sécurisé par rôle",
];

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);
const MotionListItem = motion.create(List.Item);

export const ValueProposition = () => {
  return (
    <Box py="24" id="owners">
      <Container mx={"auto"} px={{ base: 4, sm: 6, lg: 8 }}>
        <MotionVStack
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          textAlign={"center"}
          mx={"auto"}
          mb={"16"}
        >
          <BaseText
            color={"primary.500"}
            textTransform={"uppercase"}
            fontWeight={"semibold"}
          >
            Proposition de valeur
          </BaseText>

          <BaseText
            fontWeight={"bold"}
            variant={TextVariant.H1}
            lineHeight={1.2}
          >
            Une plateforme, deux expériences
          </BaseText>
          <BaseText variant={TextVariant.L} mb={2} mt={1} color={"gray.400"}>
            Chaque utilisateur bénéficie d'un espace adapté à ses besoins.
          </BaseText>
        </MotionVStack>

        <SimpleGrid
          maxW={"4xl"}
          mx={"auto"}
          position={"relative"}
          columns={{ base: 1, sm: 2 }}
          gap={0}
        >
          {/* Animated divider */}
          <Box
            position={"absolute"}
            left={"50%"}
            top={"8"}
            bottom={"8"}
            w={"1px"}
            // display={{ base: "hidden", sm: "block" }}
            display={{ base: "none", sm: "block" }}
            transform="translateX(-50%)"
          >
            <MotionBox
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              w={"full"}
              h={"full"}
              bgGradient={"to-b"}
              gradientFrom={"tertiary.50"}
              gradientVia={"primary.300"}
              gradientTo={"tertiary.400"}
            />
          </Box>

          {/* Tenant side */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            p={{ base: 8, sm: 10 }}
          >
            <Flex alignItems={"center"} gap={"3"} mb={"6"}>
              <BaseIcon color={"tertiary.100"}>
                <Icons.Home color={VariablesColors.tertiary} />
              </BaseIcon>
              <div>
                <BaseText
                  fontSize={{ base: "xl", sm: "2xl" }}
                  fontWeight={"bold"}
                >
                  Expérience Locataire
                </BaseText>
                <Span fontSize={"sm"} color={"gray.400"}>
                  Simple et efficace
                </Span>
              </div>
            </Flex>
            <List.Root spaceY={3} variant={"plain"}>
              {tenantBenefits.map((b, i) => (
                <MotionListItem
                  key={b}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  alignItems={"center"}
                  gap={3}
                >
                  <BaseIcon
                    color={"tertiary.100"}
                    borderRadius={"full"}
                    boxSize={"20px"}
                  >
                    <Icons.Check color={VariablesColors.tertiary} />
                  </BaseIcon>
                  <Span fontSize={"sm"} color={"gray.400"}>
                    {b}
                  </Span>
                </MotionListItem>
              ))}
            </List.Root>
          </MotionBox>

          {/* Owner side */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            p={{ base: 8, sm: 10 }}
          >
            <Flex alignItems={"center"} gap={"3"} mb={"6"}>
              <BaseIcon color={"primary.100"}>
                <Icons.Home color={VariablesColors.primary} />
              </BaseIcon>
              <div>
                <BaseText
                  fontSize={{ base: "xl", sm: "2xl" }}
                  fontWeight={"bold"}
                >
                  Expérience Propriétaire
                </BaseText>
                <Span fontSize={"sm"} color={"gray.400"}>
                  Simple et efficace
                </Span>
              </div>
            </Flex>
            <List.Root spaceY={3} variant={"plain"}>
              {ownerBenefits.map((b, i) => (
                <MotionListItem
                  key={b}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  alignItems={"center"}
                  gap={3}
                >
                  <BaseIcon
                    color={"primary.100"}
                    borderRadius={"full"}
                    boxSize={"20px"}
                  >
                    <Icons.Check color={VariablesColors.primary} />
                  </BaseIcon>
                  <Span fontSize={"sm"} color={"gray.400"}>
                    {b}
                  </Span>
                </MotionListItem>
              ))}
            </List.Root>
          </MotionBox>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
