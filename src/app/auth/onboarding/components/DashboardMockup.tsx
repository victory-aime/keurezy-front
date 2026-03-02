import {
  Flex,
  HStack,
  Circle,
  Box,
  VStack,
  Grid,
  Text,
} from "@chakra-ui/react";
import { Icons, BaseTag } from "_components/custom";
import { useColorModeValue } from "_components/ui/color-mode";
import { ENUM } from "_types/*";
import { motion } from "framer-motion";
import { FiBarChart2 } from "react-icons/fi";

interface DashboardMockupProps {
  userName?: string;
  role?: string;
  company?: string;
  properties?: number;
  rent?: number;
  location?: string;
  currency?: string;
  notifications?: boolean;
  activeTab?: number;
  animated?: boolean;
}

const MotionBox = motion.create(Box);

export const DashboardMockup = ({
  userName = "Jean Dupont",
  role = "Propriétaire",
  company = "MyImmo",
  properties = 12,
  rent = 2450,
  location = "Paris",
  currency = ENUM.COMMON.Currency.XOF,
  notifications = true,
  activeTab = 0,
  animated = true,
}: DashboardMockupProps) => {
  const bg = useColorModeValue("white", "gray.900");
  const muted = useColorModeValue("gray.100", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  const kpis = [
    {
      label: "Revenus",
      value: `${(rent * properties).toLocaleString()}${currency}`,
      icon: Icons.CreditCard,
      trend: "+12%",
    },
    {
      label: "Biens",
      value: properties,
      icon: Icons.RiBuildingLine,
      trend: "+2",
    },
    {
      label: "Occupation",
      value: "94%",
      icon: Icons.Chart,
      trend: "+3%",
    },
    {
      label: "Locataires",
      value: Math.max(1, properties - 2),
      icon: Icons.FaUsers,
      trend: "+4",
    },
  ];

  const sidebarIcons = [
    FiBarChart2,
    Icons.Home,
    Icons.FaUsers,
    Icons.CreditCard,
    Icons.Wrench,
    Icons.Chat,
  ];

  const barHeights = [40, 65, 55, 80, 70, 90, 85, 75, 95, 60, 88, 92];

  return (
    <MotionBox
      initial={animated ? { opacity: 0, y: 20, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      border="1px solid"
      borderColor={border}
      bg={bg}
      rounded="2xl"
      shadow="xl"
    >
      {/* Top Bar */}
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor={border}
        bg={muted}
      >
        <HStack gap={2}>
          <Circle size="10px" bg="red.400" />
          <Circle size="10px" bg="yellow.400" />
          <Circle size="10px" bg="green.400" />
        </HStack>
        <Flex flex={1} alignItems={"center"} justifyContent={"center"} mx={4}>
          <Text px={3} py={1} fontSize={"xs"} color={"gray.400"}>
            app.myimmo.com/dashboard
          </Text>
        </Flex>

        {notifications && (
          <Box position="relative">
            <Icons.Bell size={16} color="gray" />
            <Circle
              size="8px"
              bg="red.500"
              position="absolute"
              top="0"
              right="0"
            />
          </Box>
        )}
      </Flex>

      <Flex>
        {/* Sidebar */}
        <VStack
          gap={3}
          p={3}
          borderRight="1px solid"
          borderColor={border}
          display={{ base: "none", md: "flex" }}
        >
          {sidebarIcons.map((Icon, idx) => (
            <Circle
              key={idx}
              size="36px"
              bg={idx === activeTab ? "primary.100" : muted}
              color={idx === activeTab ? "primary.500" : textMuted}
            >
              <Icon size={16} />
            </Circle>
          ))}
        </VStack>

        {/* Main */}
        <Box width={"full"} display={"flex"} flex={1} flexDir={"column"} p={4}>
          {/* Header */}
          <Flex justify="space-between" mb={6}>
            <Box>
              <Text fontWeight="semibold">Bonjour, {userName} 👋</Text>
              <HStack mt={1} gap={2}>
                <BaseTag color="purple" label={role} borderRadius={"full"} />
                <Text fontSize="xs" color={textMuted}>
                  {company}
                </Text>
              </HStack>
            </Box>

            {location && (
              <HStack fontSize="xs" color={textMuted}>
                <Icons.World />
                <Text>{location}</Text>
              </HStack>
            )}
          </Flex>

          {/* KPIs */}
          <Grid
            templateColumns={{ base: "repeat(2,1fr)", md: "repeat(4,1fr)" }}
            gap={4}
          >
            {kpis.map((kpi, idx) => (
              <MotionBox
                key={kpi.label}
                initial={animated ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                bg={muted}
                p={2}
                rounded="xl"
              >
                <Flex justify="space-between" mb={2}>
                  <kpi.icon size={14} color="gray" />
                  <Text fontSize="xs" color="green.400">
                    {kpi.trend}
                  </Text>
                </Flex>

                <Text fontWeight="bold">{kpi.value}</Text>
                <Text fontSize="xs" color={textMuted}>
                  {kpi.label}
                </Text>
              </MotionBox>
            ))}
          </Grid>

          {/* Chart */}
          <Box mt={6} bg={muted} p={4} rounded="xl">
            <Text fontSize="sm" fontWeight="medium" mb={4}>
              Revenus mensuels ({currency})
            </Text>

            <Flex align="flex-end" h="100px" gap={1}>
              {barHeights.map((h, i) => (
                <MotionBox
                  key={i}
                  initial={animated ? { height: 0 } : false}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  bgGradient="to-r"
                  gradientFrom="primary.300"
                  gradientTo="primary.200"
                  flex="1"
                  roundedTop="md"
                />
              ))}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </MotionBox>
  );
};
