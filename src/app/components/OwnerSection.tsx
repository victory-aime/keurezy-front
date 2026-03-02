import {
  Box,
  Flex,
  SimpleGrid,
  Span,
  VStack,
  Text,
  Container,
} from "@chakra-ui/react";
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
import { ENUM } from "_types/*";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const ownerFeatures = [
  {
    icon: Icons.Chart,
    title: "Suivi des revenus en temps réel",
    description:
      "Visualisez vos performances financières avec des tableaux de bord détaillés.",
    iconColor: VariablesColors.primary,
    color: "primary",
  },
  {
    icon: Icons.RiBuildingLine,
    title: "Gestion du portefeuille",
    description:
      "Centralisez la gestion de tous vos biens depuis une interface unique.",
    iconColor: VariablesColors.secondary,
    color: "secondary",
  },
  {
    icon: Icons.FaUsers,
    title: "Gestion des locataires",
    description: "Gérez les profils, contrats et communications facilement.",
    iconColor: VariablesColors.tertiary,
    color: "tertiary",
  },
  {
    icon: Icons.TrendingUp,
    title: "Analytique d'occupation",
    description: "Analysez les taux d'occupation et optimisez votre rendement.",
    iconColor: VariablesColors.primary,
    color: "primary",
  },
  {
    icon: Icons.CreditCard,
    title: "Collecte automatique des loyers",
    description:
      "Automatisez les prélèvements et suivez les paiements en temps réel.",
    iconColor: VariablesColors.warning,
    color: "warning",
  },
  {
    icon: Icons.Shield,
    title: "Accès sécurisé par rôle",
    description: "Contrôlez les permissions de chaque membre de votre équipe.",
    iconColor: VariablesColors.tertiary,
    color: "tertiary",
  },
];

const CountUp = ({
  end,
  suffix = "",
  duration = 2,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

export const OwnerSection = () => {
  return (
    <Box py="24">
      <Container mx={"auto"} px={{ base: 4, sm: 6, lg: 8 }}>
        <MotionVStack
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          textAlign={"center"}
          mx={"auto"}
          mb={"16"}
        >
          <Flex
            align="center"
            gap={2}
            px={4}
            py={1.5}
            rounded="full"
            bg={hexToRGB("primary", 0.1)}
            color="primary"
            fontSize="sm"
            fontWeight="medium"
            w="fit-content"
            mb={3}
          >
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg={VariablesColors.primary}
              animation="pulse 2s infinite"
              color={"primary.500"}
            />
            <BaseText
              color={"primary.500"}
              textTransform={"uppercase"}
              fontWeight={"semibold"}
            >
              Espace Propriétaire
            </BaseText>
          </Flex>
          <BaseText
            fontWeight={"semibold"}
            variant={TextVariant.H1}
            lineHeight={1.2}
          >
            Des outils puissants pour les propriétaires
          </BaseText>
          <BaseText variant={TextVariant.L} mb={2} mt={1} color={"gray.400"}>
            Automatisez, analysez et optimisez la gestion de votre patrimoine
            immobilier.
          </BaseText>
        </MotionVStack>

        {/* KPI counters */}
        <SimpleGrid mb={16} columns={{ base: 2, sm: 2, lg: 4 }} gap={8}>
          {[
            {
              value: 12450,
              suffix: ENUM.COMMON.Currency.XOF,
              prefix: "",
              label: "Revenu mensuel moyen",
              color: "primary.50",
            },
            {
              value: 94,
              suffix: "%",
              prefix: "",
              label: "Taux d'occupation",
              color: "tertiary.50",
            },
            {
              value: 2500,
              suffix: "+",
              prefix: "",
              label: "Biens gérés",
              color: "secondary.50",
            },
            {
              value: 23,
              suffix: "%",
              prefix: "+",
              label: "Rendement amélioré",
              color: "primary.50",
            },
          ].map((kpi, i) => (
            <MotionBox
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              p={6}
              rounded={"xl"}
              border={"1px solid"}
              textAlign={"center"}
              bgColor={kpi.color}
              borderColor={"border"}
            >
              <BaseText
                fontSize={{ base: "xl", sm: "4xl" }}
                fontWeight={"bold"}
              >
                {kpi.prefix}
                <CountUp end={kpi.value} suffix={kpi.suffix} />
              </BaseText>
              <Span fontSize={"sm"} color={"gray.400"}>
                {kpi.label}
              </Span>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Dashboard mockup + features */}

        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          gap={12}
          alignItems="center"
          mb={12}
        >
          {/* LEFT — Dashboard mockup */}
          <MotionBox
            borderRadius="xl"
            borderWidth="1px"
            bg="white"
            shadow="xl"
            overflow="hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Top bar */}
            <Flex
              align="center"
              gap={2}
              px={4}
              py={3}
              borderBottomWidth="1px"
              bg="gray.50"
            >
              <Box w={3} h={3} borderRadius="full" bg="red.400" opacity={0.6} />
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg="yellow.400"
                opacity={0.6}
              />
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg="green.400"
                opacity={0.6}
              />
            </Flex>

            <Box p={5}>
              <VStack gap={4} align="stretch">
                {/* Chart */}
                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="medium"
                    mb={2}
                  >
                    Revenus mensuels ({ENUM.COMMON.Currency.XOF})
                  </Text>

                  <Flex align="flex-end" gap={1.5} h="112px">
                    {[55, 70, 60, 85, 75, 90, 82, 95, 88, 92, 98, 94].map(
                      (h, i) => (
                        <MotionBox
                          key={i}
                          flex="1"
                          borderRadius="sm"
                          bgGradient="to-r"
                          gradientFrom="primary.300"
                          gradientTo="primary.200"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.3 + i * 0.05,
                            duration: 0.5,
                          }}
                        />
                      ),
                    )}
                  </Flex>
                </Box>

                {/* Mini stats */}
                <SimpleGrid columns={3} gap={3}>
                  {[
                    {
                      label: "Occupation",
                      val: "94%",
                      color: "tertiary.500",
                    },
                    {
                      label: "Impayés",
                      val: "1.2%",
                      color: "red.500",
                    },
                    {
                      label: "Croissance",
                      val: "+12%",
                      color: "primary.500",
                    },
                  ].map((s) => (
                    <Box
                      key={s.label}
                      borderRadius="lg"
                      bg="gray.50"
                      p={3}
                      textAlign="center"
                    >
                      <Text fontSize="lg" fontWeight="bold" color={s.color}>
                        {s.val}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {s.label}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </Box>
          </MotionBox>

          {/* RIGHT — Features */}
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
            {ownerFeatures.map((feature, i) => (
              <MotionBox
                key={feature.title}
                borderRadius="xl"
                p={5}
                borderWidth="1px"
                bg="white"
                shadow="md"
                _hover={{
                  transform: "translateY(-4px)",
                  shadow: "lg",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <BaseIcon
                  mb={3}
                  color={hexToRGB(feature.color as keyof Colors, 0.3)}
                  transition="transform 0.3s"
                  _groupHover={{ transform: "scale(1.1)" }}
                >
                  <feature.icon size={20} color={feature.iconColor} />
                </BaseIcon>

                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  {feature.title}
                </Text>

                <Text fontSize="xs" color="gray.500" lineHeight="relaxed">
                  {feature.description}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </SimpleGrid>

        <MotionVStack
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link href={APP_ROUTES.AUTH.ONBOARD}>
            <BaseButton
              rightIcon={<Icons.ArrowRight />}
              size="lg"
              className="gap-2 shadow-elevated"
            >
              Commencer à gérer mes biens
            </BaseButton>
          </Link>
        </MotionVStack>
      </Container>
    </Box>
  );
};
