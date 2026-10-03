import { Box, type BoxProps, Circle, Flex, Grid, HStack, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { BaseText, Icons, NavIcons } from '_components/custom';
import { MotionBox } from '_constants/motion';
import { ENUM } from '_types/*';

/*
 * Maquette du tableau de bord Keurezy (page d'accueil et onboarding). Elle reprend l'écran réel :
 * navigation par groupes, indicateurs, revenus mensuels, occupation par type, activité récente.
 * Dessinée en code : nette à toutes les tailles, aux couleurs du thème, clair comme sombre.
 */

interface DashboardMockupProps {
  userName?: string;
  role?: string;
  company?: string;
  properties?: number;
  rent?: number;
  location?: string;
  currency?: string;
  notifications?: boolean;
  /** Entrée de navigation mise en avant (0 = Tableau de bord) */
  activeTab?: number;
  animated?: boolean;
}

const NAV: { group: string; items: { label: string; icon: IconType; badge?: number }[] }[] = [
  {
    group: 'Accueil',
    items: [
      { label: 'Tableau de bord', icon: NavIcons.Dashboard },
      { label: 'Messages', icon: NavIcons.Messages, badge: 3 },
    ],
  },
  {
    group: 'Patrimoine',
    items: [
      { label: 'Propriétés', icon: NavIcons.Properties },
      { label: 'Annonces', icon: NavIcons.Annonces },
    ],
  },
  {
    group: 'Activité',
    items: [
      { label: 'Réservations', icon: NavIcons.Bookings },
      { label: 'Rendez-vous', icon: NavIcons.Visits },
    ],
  },
  { group: 'Facturation', items: [{ label: 'Factures', icon: NavIcons.Invoices }] },
];

/** Revenus mensuels (en part du maximum), de janvier à décembre. */
const REVENUE = [38, 46, 42, 58, 55, 68, 64, 79, 74, 86, 82, 95];
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const OCCUPATION = [
  { label: 'Appartements', value: 92, color: 'primary.solid' },
  { label: 'Studios', value: 96, color: 'tertiary.solid' },
  { label: 'Villas', value: 78, color: 'orange.400' },
];

/** Courbe lissée (Catmull-Rom → Bézier) sur une zone de 300 × 100. */
const smoothPath = (values: number[]) => {
  const points = values.map((v, i) => [(i / (values.length - 1)) * 300, 100 - v] as const);
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[Math.max(0, i - 1)];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const [x3, y3] = points[Math.min(points.length - 1, i + 2)];
    d += ` C ${x1 + (x2 - x0) / 6} ${y1 + (y2 - y0) / 6}, ${x2 - (x3 - x1) / 6} ${y2 - (y3 - y1) / 6}, ${x2} ${y2}`;
  }
  return d;
};

const LINE = smoothPath(REVENUE);

const Card = ({ children, ...rest }: BoxProps) => (
  <Box rounded="lg" borderWidth="1px" borderColor="border" bg="bg.panel" p={3} {...rest}>
    {children}
  </Box>
);

const Label = ({ children }: { children: ReactNode }) => (
  <BaseText fontSize="10px" color="fg.muted" lineHeight="short">
    {children}
  </BaseText>
);

export const DashboardMockup = ({
  userName = 'Jean Dupont',
  role = 'Propriétaire',
  company = 'Keurezy',
  properties = 12,
  rent = 2450,
  location = 'Dakar',
  currency = ENUM.COMMON.Currency.XOF,
  notifications = true,
  activeTab = 0,
  animated = true,
}: DashboardMockupProps) => {
  const revenue = `${(rent * properties).toLocaleString('fr-FR')} ${currency}`;
  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const appear = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.4 },
        }
      : {};

  const kpis = [
    {
      label: 'Propriétés',
      value: String(properties),
      trend: '+2 ce mois',
      icon: NavIcons.Properties,
    },
    { label: 'Revenus du mois', value: revenue, trend: '+12 %', icon: Icons.Wallet },
    { label: 'Taux d’occupation', value: '94 %', trend: '+3 pts', icon: Icons.Chart },
    { label: 'Réservations', value: '18', trend: '5 en attente', icon: NavIcons.Bookings },
  ];

  let navIndex = -1;

  return (
    <MotionBox
      initial={animated ? { opacity: 0, y: 20, scale: 0.97 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      borderWidth="1px"
      borderColor="border"
      bg="bg"
      rounded="xl"
      shadow="0 24px 60px -24px rgba(15, 23, 42, 0.35)"
      overflow="hidden"
      aria-hidden
      userSelect="none"
    >
      {/* Fenêtre du navigateur */}
      <Flex
        alignItems="center"
        gap={3}
        px={3}
        py={2}
        borderBottomWidth="1px"
        borderColor="border"
        bg="bg.subtle"
      >
        <HStack gap="6px">
          <Circle size="10px" bg="#ff5f57" />
          <Circle size="10px" bg="#febc2e" />
          <Circle size="10px" bg="#28c840" />
        </HStack>
        <HStack
          flex={1}
          maxW="280px"
          mx="auto"
          gap={1.5}
          px={3}
          py={1}
          rounded="md"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          color="fg.muted"
          justifyContent="center"
        >
          <Icons.Lock size={10} />
          <BaseText fontSize="10px" color="inherit">
            keurezy.onrender.com/dashboard
          </BaseText>
        </HStack>
        <Box w="42px" />
      </Flex>

      <Flex minH="0">
        {/* Navigation */}
        <Stack
          display={{ base: 'none', xl: 'flex' }}
          w="150px"
          flexShrink={0}
          gap={3}
          px={2.5}
          py={3}
          borderRightWidth="1px"
          borderColor="border"
          bg="bg.subtle"
        >
          <HStack gap={2} px={1.5}>
            <Circle
              size="22px"
              bg="primary.solid"
              color="primary.contrast"
              fontSize="11px"
              fontWeight="extrabold"
            >
              K
            </Circle>
            <Stack gap={0} minW={0}>
              <BaseText fontSize="11px" fontWeight="bold" truncate>
                {company || 'Mon agence'}
              </BaseText>
              <Label>{location}</Label>
            </Stack>
          </HStack>
          {NAV.map(({ group, items }) => (
            <Stack key={group} gap={0.5}>
              <BaseText
                fontSize="9px"
                fontWeight="semibold"
                color="fg.subtle"
                textTransform="uppercase"
                px={1.5}
              >
                {group}
              </BaseText>
              {items.map(({ label, icon: Icon, badge }) => {
                navIndex += 1;
                const active = navIndex === activeTab;
                return (
                  <HStack
                    key={label}
                    gap={2}
                    px={1.5}
                    py={1}
                    rounded="md"
                    bg={active ? 'primary.subtle' : 'transparent'}
                    color={active ? 'primary.fg' : 'fg.muted'}
                  >
                    <Icon size={12} />
                    <BaseText
                      fontSize="10.5px"
                      color="inherit"
                      fontWeight={active ? 'semibold' : 'normal'}
                      flex={1}
                    >
                      {label}
                    </BaseText>
                    {badge && (
                      <Circle
                        size="15px"
                        bg="primary.solid"
                        color="primary.contrast"
                        fontSize="8px"
                        fontWeight="bold"
                      >
                        {badge}
                      </Circle>
                    )}
                  </HStack>
                );
              })}
            </Stack>
          ))}
        </Stack>

        {/* Contenu */}
        <Stack flex={1} minW={0} gap={3} p={3.5} bg="bg">
          <Flex justifyContent="space-between" alignItems="center" gap={2}>
            <Stack gap={0} minW={0}>
              <BaseText fontSize="14px" fontWeight="bold" truncate>
                Tableau de bord
              </BaseText>
              <HStack gap={1.5}>
                <Label>Bonjour, {userName}</Label>
                <Box
                  px={1.5}
                  rounded="full"
                  bg="primary.subtle"
                  color="primary.fg"
                  fontSize="9px"
                  fontWeight="semibold"
                >
                  {role}
                </Box>
              </HStack>
            </Stack>
            <HStack gap={2} flexShrink={0}>
              <HStack
                gap={1}
                px={2}
                py={0.5}
                rounded="md"
                borderWidth="1px"
                borderColor="border"
                fontSize="10px"
              >
                <Icons.ChevronLeft size={9} />
                2026
                <Icons.ChevronRight size={9} />
              </HStack>
              <Box position="relative" color="fg.muted">
                <Icons.Bell size={14} />
                {notifications && (
                  <Circle
                    size="7px"
                    bg="danger.solid"
                    position="absolute"
                    top="-1px"
                    right="-1px"
                  />
                )}
              </Box>
              <Circle
                size="24px"
                bg="tertiary.subtle"
                color="tertiary.fg"
                fontSize="9px"
                fontWeight="bold"
              >
                {initials}
              </Circle>
            </HStack>
          </Flex>

          <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={2}>
            {kpis.map((kpi, index) => (
              <MotionBox key={kpi.label} {...appear(0.2 + index * 0.08)}>
                <Card>
                  <Flex justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                    <Label>{kpi.label}</Label>
                    <Circle size="20px" bg="primary.subtle" color="primary.fg">
                      <kpi.icon size={10} />
                    </Circle>
                  </Flex>
                  <BaseText fontSize="15px" fontWeight="bold" lineHeight="1.2" truncate>
                    {kpi.value}
                  </BaseText>
                  <HStack gap={1} color="success.fg" mt={0.5}>
                    <Icons.TrendingUp size={10} />
                    <BaseText fontSize="9.5px" color="inherit">
                      {kpi.trend}
                    </BaseText>
                  </HStack>
                </Card>
              </MotionBox>
            ))}
          </Grid>

          <Grid templateColumns={{ base: '1fr', md: '1.6fr 1fr' }} gap={2}>
            <Card>
              <Flex justifyContent="space-between" mb={2}>
                <BaseText fontSize="11px" fontWeight="semibold">
                  Revenus mensuels
                </BaseText>
                <Label>{currency}</Label>
              </Flex>
              <Box position="relative" height="92px">
                <svg viewBox="0 0 300 100" width="100%" height="100%" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="mockup-area" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0"
                        stopColor="var(--chakra-colors-primary-solid)"
                        stopOpacity="0.35"
                      />
                      <stop
                        offset="1"
                        stopColor="var(--chakra-colors-primary-solid)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  {[25, 50, 75].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="300"
                      y1={y}
                      y2={y}
                      stroke="var(--chakra-colors-border)"
                      strokeDasharray="3 4"
                    />
                  ))}
                  <path d={`${LINE} L 300 100 L 0 100 Z`} fill="url(#mockup-area)" />
                  <motion.path
                    d={LINE}
                    fill="none"
                    stroke="var(--chakra-colors-primary-solid)"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                    initial={animated ? { pathLength: 0 } : false}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <Box
                  position="absolute"
                  right="0"
                  top="0"
                  px={1.5}
                  py={0.5}
                  rounded="md"
                  bg="primary.solid"
                  color="primary.contrast"
                  fontSize="9px"
                  fontWeight="semibold"
                >
                  Déc. · +16 %
                </Box>
              </Box>
              <Flex justifyContent="space-between" mt={1}>
                {MONTHS.map((month, index) => (
                  <BaseText key={index} fontSize="8.5px" color="fg.subtle">
                    {month}
                  </BaseText>
                ))}
              </Flex>
            </Card>

            <Card>
              <BaseText fontSize="11px" fontWeight="semibold" mb={2.5}>
                Occupation par type
              </BaseText>
              <Stack gap={2.5}>
                {OCCUPATION.map((row, index) => (
                  <Stack key={row.label} gap={1}>
                    <Flex justifyContent="space-between">
                      <Label>{row.label}</Label>
                      <BaseText fontSize="10px" fontWeight="semibold">
                        {row.value} %
                      </BaseText>
                    </Flex>
                    <Box h="5px" rounded="full" bg="bg.muted" overflow="hidden">
                      <MotionBox
                        h="full"
                        rounded="full"
                        bg={row.color}
                        initial={animated ? { width: 0 } : false}
                        animate={{ width: `${row.value}%` }}
                        transition={{ delay: 0.6 + index * 0.12, duration: 0.7 }}
                      />
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Grid>

          <Card display={{ base: 'none', sm: 'block' }}>
            <BaseText fontSize="11px" fontWeight="semibold" mb={2}>
              Activité récente
            </BaseText>
            <Stack gap={2}>
              {[
                {
                  icon: NavIcons.Bookings,
                  text: 'Réservation confirmée · Studio Plateau',
                  time: '09:42',
                  tone: 'success',
                },
                {
                  icon: Icons.Wallet,
                  text: `Paiement reçu par Wave · 210 000 ${currency}`,
                  time: '09:15',
                  tone: 'primary',
                },
                {
                  icon: Icons.UserPlus,
                  text: 'Nouveau prospect · Cheikh Diallo',
                  time: 'Hier',
                  tone: 'tertiary',
                },
              ].map((row) => (
                <HStack key={row.text} gap={2}>
                  <Circle
                    size="20px"
                    bg={`${row.tone}.subtle`}
                    color={`${row.tone}.fg`}
                    flexShrink={0}
                  >
                    <row.icon size={10} />
                  </Circle>
                  <BaseText fontSize="10px" flex={1} truncate>
                    {row.text}
                  </BaseText>
                  <Label>{row.time}</Label>
                </HStack>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Flex>
    </MotionBox>
  );
};
