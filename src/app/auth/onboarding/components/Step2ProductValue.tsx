import {
  Box,
  VStack,
  Flex,
  Heading,
  Span,
  HStack,
  Grid,
  Text,
} from "@chakra-ui/react";
import { Icons } from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { OnboardCardWrapper } from "./OnboardCardWrapper";
import { PaymentsMockup } from "./PaymentsMockup";
import { PropertiesMockup } from "./PropertiesMockup";
import { TenantsMockup } from "./TenantMockup";
import { GridContainer } from "./GridContainer";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

/* ═══════════════ STEP 2: Product Value ═══════════════ */
const tabData = [
  {
    id: "properties",
    label: "Gestions des Propriétés",
    icon: Icons.RiBuildingLine,
    kpis: [
      { label: "Total Biens", value: "24", trend: "+3" },
      { label: "Occupation", value: "96%", trend: "+5%" },
      { label: "En attente", value: "2", trend: "-1" },
    ],
    features: [
      "Vue complète des propriétés",
      "Ajout en un clic",
      "Photos & documents",
      "Suivi valeur marché",
    ],
  },
  {
    id: "Paiements",
    label: "Suivis des Paiements",
    icon: Icons.CreditCard,
    kpis: [
      { label: "Revenus", value: "32.4K€", trend: "+12%" },
      { label: "Encaissés", value: "98%", trend: "+2%" },
      { label: "En retard", value: "1", trend: "-3" },
    ],
    features: [
      "Collecte automatique",
      "Rappels intelligents",
      "Historique complet",
      "Export comptable",
    ],
  },
  {
    id: "tenants",
    label: "Suivis des locataires",
    icon: Icons.FaUsers,
    kpis: [
      { label: "Locataires", value: "47", trend: "+5" },
      { label: "Satisfaction", value: "4.8", trend: "+0.3" },
      { label: "Renouvellements", value: "12", trend: "+4" },
    ],
    features: [
      "Profils détaillés",
      "Historique paiements",
      "Gestion baux",
      "Communication directe",
    ],
  },
];

export const Step2ProductValue = () => {
  const tabMockups = [PropertiesMockup, PaymentsMockup, TenantsMockup];
  const [activeTab, setActiveTab] = useState(0);
  const tab = tabData[activeTab];
  const ActiveMockup = tabMockups[activeTab];

  return (
    <VStack gap={6} maxW="6xl" mx="auto">
      <Flex
        bgColor={hexToRGB("secondary", 0.1)}
        color="secondary.500"
        borderRadius="full"
        px={3}
        py={1}
        alignItems="center"
        gap={1}
      >
        <Icons.View />
        Découverte
      </Flex>
      <MotionVStack
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        textAlign={"center"}
        gap={2}
      >
        <Heading
          fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
          fontWeight="bold"
        >
          Découvrez comment cela fonctionne pour vous
        </Heading>
        <Span
          mt={1}
          color={"gray.400"}
          fontSize={{ base: "sm", sm: "md", lg: "lg" }}
        >
          Explorez les outils qui transformeront votre gestion locative
        </Span>
      </MotionVStack>

      {/* Tab buttons */}
      <HStack gap={2} justify="center" flexWrap="wrap">
        {tabData.map((t, i) => (
          <MotionBox
            key={t.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            border={activeTab === i ? "none" : "1px solid #e2e8f0"}
            background={activeTab === i ? "primary.500" : "white"}
            color={activeTab === i ? "white" : "#6b7280"}
          >
            <t.icon size={16} />
            <span>{t.label}</span>
          </MotionBox>
        ))}
      </HStack>

      <GridContainer alignItems="start" w="full">
        <AnimatePresence mode="wait">
          <MotionBox
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <VStack gap={4} align="stretch">
              <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                {tab.kpis.map((kpi) => (
                  <OnboardCardWrapper key={kpi.label} textAlign="center">
                    <Text fontSize="xl" fontWeight="bold">
                      {kpi.value}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {kpi.label}
                    </Text>
                    <Text fontSize="xs" fontWeight="medium" color="green.500">
                      {kpi.trend}
                    </Text>
                  </OnboardCardWrapper>
                ))}
              </Grid>

              <OnboardCardWrapper>
                <HStack mb={3} gap={2}>
                  <tab.icon color={VariablesColors.primary} />
                  <Text fontWeight="semibold">{tab.label}</Text>
                </HStack>
                <VStack gap={2} align="stretch">
                  {tab.features.map((f, i) => (
                    <MotionBox
                      key={f}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <HStack gap={2}>
                        <Icons.Check color={VariablesColors.tertiary} />
                        <Text fontSize="sm" color="gray.500">
                          {f}
                        </Text>
                      </HStack>
                    </MotionBox>
                  ))}
                </VStack>
              </OnboardCardWrapper>
            </VStack>
          </MotionBox>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveMockup />
          </motion.div>
        </AnimatePresence>
      </GridContainer>
    </VStack>
  );
};
