import { Box, type BoxProps, Circle, Flex, Grid, HStack, Stack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { BaseText, Icons, NavIcons, TextVariant, BaseIcon } from '_components/custom';
import { MotionBox } from '_constants/motion';
import { LandingSection, Reveal, SectionHeading } from './Section';

/*
 * Maquettes de l'application mobile (côté clients), dessinées en code : aucune image à charger,
 * nettes à toutes les tailles et compatibles avec le mode sombre. À remplacer par de vraies
 * captures quand l'application sera publiée.
 */

const APP_POINTS = [
  { icon: Icons.Search, text: 'Recherche par quartier, type de bien et mode de location' },
  { icon: NavIcons.Bookings, text: 'Réservation en quelques gestes, et suivi de la demande' },
  { icon: Icons.Chat, text: 'Messagerie directe avec l’agence' },
  { icon: Icons.Bell, text: 'Notifications à chaque étape' },
];

/** Photo d'un bien, en illustration vectorielle (immeuble face à la mer, palmier, soleil). */
const PropertyPhoto = ({ variant = 'sea' }: { variant?: 'sea' | 'villa' }) => (
  <svg
    viewBox="0 0 320 180"
    width="100%"
    height="100%"
    style={{ display: 'block' }}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={variant === 'sea' ? '#7cc4f2' : '#f6c89f'} />
        <stop offset="1" stopColor={variant === 'sea' ? '#d6eefc' : '#fde9d4'} />
      </linearGradient>
    </defs>
    <rect width="320" height="180" fill={`url(#sky-${variant})`} />
    <g fill="#ffffff" opacity="0.8">
      <ellipse cx="200" cy="30" rx="22" ry="7" />
      <ellipse cx="215" cy="26" rx="14" ry="7" />
      <ellipse cx="110" cy="22" rx="16" ry="5" />
    </g>
    <circle cx={variant === 'sea' ? 262 : 70} cy="42" r="18" fill="#ffe08a" opacity="0.9" />
    {variant === 'sea' ? (
      <>
        <rect y="132" width="320" height="48" fill="#3a9bd5" />
        <rect y="132" width="320" height="4" fill="#ffffff" opacity="0.5" />
        <rect y="150" width="320" height="30" fill="#e9d8b4" />
        <ellipse cx="160" cy="152" rx="120" ry="4" fill="#000000" opacity="0.12" />
        <rect x="70" y="40" width="120" height="112" rx="3" fill="#f4efe6" />
        <rect x="70" y="40" width="120" height="10" fill="#e3d9c8" />
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={82 + col * 26}
              y={58 + row * 22}
              width="16"
              height="14"
              rx="1.5"
              fill="#5e8fb0"
              opacity={0.85}
            />
          )),
        )}
        {[0, 1, 2, 3].map((row) => (
          <rect key={row} x="76" y={73 + row * 22} width="108" height="2.5" fill="#cfc3ae" />
        ))}
        <rect x="190" y="78" width="70" height="74" rx="3" fill="#e9dfcf" />
        {[0, 1, 2].map((row) => (
          <rect
            key={row}
            x="200"
            y={88 + row * 20}
            width="50"
            height="12"
            rx="1.5"
            fill="#6d9cbc"
            opacity={0.8}
          />
        ))}
      </>
    ) : (
      <>
        <rect y="140" width="320" height="40" fill="#8bbf6a" />
        <polygon points="90,78 170,40 250,78" fill="#c0573e" />
        <rect x="100" y="78" width="140" height="70" fill="#fbf4ea" />
        <rect x="155" y="106" width="30" height="42" rx="2" fill="#8a5a3c" />
        <rect x="115" y="92" width="28" height="24" rx="2" fill="#6d9cbc" />
        <rect x="197" y="92" width="28" height="24" rx="2" fill="#6d9cbc" />
      </>
    )}
    <rect x="24" y="80" width="6" height="72" rx="3" fill="#8a6a45" transform="rotate(-6 27 116)" />
    <g fill="#3f8f4e">
      <ellipse cx="22" cy="80" rx="24" ry="7" transform="rotate(-25 22 80)" />
      <ellipse cx="36" cy="80" rx="24" ry="7" transform="rotate(25 36 80)" />
      <ellipse cx="28" cy="74" rx="20" ry="6" transform="rotate(-80 28 74)" />
    </g>
  </svg>
);

/** Châssis de téléphone : bords arrondis, îlot, barre d'état et barre d'accueil. */
export const PhoneFrame = ({ children, ...rest }: { children: ReactNode } & BoxProps) => (
  <Box
    width="270px"
    height="560px"
    flexShrink={0}
    rounded="46px"
    bg="gray.900"
    p="9px"
    shadow="0 30px 60px -20px rgba(0,0,0,0.45)"
    outline="1px solid"
    outlineColor="gray.600"
    position="relative"
    aria-hidden
    {...rest}
  >
    {/* Boutons latéraux : volume à gauche, verrouillage à droite */}
    {[
      { side: 'left', top: '110px', h: '26px' },
      { side: 'left', top: '150px', h: '44px' },
      { side: 'left', top: '204px', h: '44px' },
      { side: 'right', top: '160px', h: '64px' },
    ].map((button) => (
      <Box
        key={`${button.side}-${button.top}`}
        position="absolute"
        top={button.top}
        {...{ [button.side]: '-3px' }}
        w="3px"
        h={button.h}
        rounded="2px"
        bg="gray.700"
      />
    ))}
    {/* Reflet sur la vitre */}
    <Box
      position="absolute"
      inset="9px"
      rounded="38px"
      pointerEvents="none"
      zIndex={3}
      bgGradient="to-br"
      gradientFrom="whiteAlpha.200"
      gradientVia="transparent"
      gradientTo="transparent"
      opacity={0.5}
    />
    <Box
      position="relative"
      height="full"
      rounded="38px"
      overflow="hidden"
      bg="bg"
      display="flex"
      flexDirection="column"
    >
      <Box
        position="absolute"
        top="9px"
        left="50%"
        transform="translateX(-50%)"
        w="84px"
        h="24px"
        rounded="full"
        bg="black"
        zIndex={2}
      />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        px="24px"
        pt="12px"
        pb="6px"
        fontSize="11px"
        fontWeight="semibold"
      >
        <BaseText fontSize="inherit" fontWeight="inherit">
          9:41
        </BaseText>
        <HStack gap="4px">
          <HStack gap="1.5px" alignItems="flex-end">
            {[4, 6, 8, 10].map((h) => (
              <Box key={h} w="2.5px" h={`${h}px`} rounded="1px" bg="fg" />
            ))}
          </HStack>
          <Box w="20px" h="10px" rounded="3px" borderWidth="1px" borderColor="fg" p="1px">
            <Box w="75%" h="full" rounded="1.5px" bg="fg" />
          </Box>
        </HStack>
      </Flex>
      {children}
      <Box
        position="absolute"
        bottom="6px"
        left="50%"
        transform="translateX(-50%)"
        w="96px"
        h="4px"
        rounded="full"
        bg="fg"
        opacity={0.85}
      />
    </Box>
  </Box>
);

const Tiny = ({ children, ...rest }: { children: ReactNode } & BoxProps) => (
  <BaseText fontSize="10px" lineHeight="short" {...rest}>
    {children}
  </BaseText>
);

const VerifiedMark = () => (
  <Box as="span" color="success.fg" display="inline-flex" fontSize="11px">
    <Icons.Shield />
  </Box>
);

/** Écran 1 : recherche et fiche d'un bien. */
const SearchScreen = () => (
  <Flex direction="column" flex={1} minH={0}>
    <Stack gap="10px" px="16px" pt="8px" flex={1} minH={0} overflow="hidden">
      <Stack gap={0}>
        <Tiny color="fg.muted">Bonjour Fatou 👋</Tiny>
        <BaseText fontSize="17px" fontWeight="bold" lineHeight="1.2">
          Trouvez votre prochain logement
        </BaseText>
      </Stack>
      <HStack gap="8px" px="12px" py="8px" rounded="full" bg="bg.muted" color="fg.muted">
        <Icons.Search size={13} />
        <Tiny flex={1} color="inherit">
          Almadies, Mermoz, Saly…
        </Tiny>
        <Circle size="22px" bg="primary.solid" color="primary.contrast">
          <Icons.Slider size={11} />
        </Circle>
      </HStack>
      <HStack gap="6px">
        {['Tous', 'À la nuit', 'Au mois', 'Villa'].map((chip, index) => (
          <Box
            key={chip}
            px="10px"
            py="4px"
            rounded="full"
            fontSize="10px"
            fontWeight="medium"
            whiteSpace="nowrap"
            bg={index === 0 ? 'primary.solid' : 'bg.muted'}
            color={index === 0 ? 'primary.contrast' : 'fg.muted'}
          >
            {chip}
          </Box>
        ))}
      </HStack>

      <Box
        rounded="16px"
        borderWidth="1px"
        borderColor="border"
        overflow="hidden"
        bg="bg.panel"
        shadow="sm"
        flexShrink={0}
      >
        <Box position="relative" height="120px">
          <PropertyPhoto />
          <Box
            position="absolute"
            top="8px"
            left="8px"
            px="8px"
            py="2px"
            rounded="full"
            bg="white"
            color="gray.900"
            fontSize="9px"
            fontWeight="bold"
          >
            À la nuit
          </Box>
          <Circle position="absolute" top="8px" right="8px" size="24px" bg="white" color="red.500">
            <Icons.Heart size={12} />
          </Circle>
          <HStack
            position="absolute"
            bottom="8px"
            left="50%"
            transform="translateX(-50%)"
            gap="4px"
          >
            {[0, 1, 2, 3].map((dot) => (
              <Box
                key={dot}
                boxSize="5px"
                rounded="full"
                bg="white"
                opacity={dot === 0 ? 1 : 0.5}
              />
            ))}
          </HStack>
        </Box>
        <Stack gap="4px" p="10px">
          <BaseText fontSize="12px" fontWeight="bold" truncate>
            Appartement F3 vue mer
          </BaseText>
          <HStack gap="3px" color="fg.muted">
            <Icons.MapPin size={11} />
            <Tiny color="inherit">Mermoz, Dakar</Tiny>
          </HStack>
          <HStack gap="10px" color="fg.muted">
            <HStack gap="3px">
              <Icons.Bed size={11} />
              <Tiny color="inherit">2 ch.</Tiny>
            </HStack>
            <HStack gap="3px">
              <Icons.Bath size={11} />
              <Tiny color="inherit">2 sdb</Tiny>
            </HStack>
            <HStack gap="3px">
              <Icons.Maximize size={10} />
              <Tiny color="inherit">95 m²</Tiny>
            </HStack>
          </HStack>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            pt="4px"
            borderTopWidth="1px"
            borderColor="border"
            mt="2px"
          >
            <BaseText fontSize="12px" fontWeight="bold" color="primary.fg">
              45 000 XOF
              <Box as="span" fontSize="9px" fontWeight="normal" color="fg.muted">
                {' '}
                / nuit
              </Box>
            </BaseText>
            <HStack gap="3px">
              <Tiny fontWeight="medium">Keur Immo</Tiny>
              <VerifiedMark />
            </HStack>
          </Flex>
        </Stack>
      </Box>

      <Box
        rounded="16px"
        borderWidth="1px"
        borderColor="border"
        overflow="hidden"
        height="90px"
        flexShrink={0}
      >
        <PropertyPhoto variant="villa" />
      </Box>
    </Stack>

    <Flex
      justifyContent="space-around"
      alignItems="center"
      px="12px"
      pt="8px"
      pb="20px"
      borderTopWidth="1px"
      borderColor="border"
      bg="bg.panel"
    >
      {[Icons.Home, Icons.Search, Icons.Calendar, Icons.Chat, Icons.User].map((Icon, index) => (
        <Box key={index} position="relative" color={index === 0 ? 'primary.fg' : 'fg.muted'}>
          <Icon size={17} />
          {index === 3 && (
            <Circle size="7px" bg="danger.solid" position="absolute" top="-1px" right="-2px" />
          )}
        </Box>
      ))}
    </Flex>
  </Flex>
);

/** Écran 2 : discussion avec l'agence, accusés de lecture et indicateur de saisie. */
const ChatScreen = () => (
  <Flex direction="column" flex={1} minH={0}>
    <HStack gap="8px" px="14px" py="8px" borderBottomWidth="1px" borderColor="border">
      <Box color="fg.muted">
        <Icons.ChevronLeft size={16} />
      </Box>
      <Circle size="30px" bg="primary.subtle" color="primary.fg" fontSize="11px" fontWeight="bold">
        KI
      </Circle>
      <Stack gap={0} flex={1}>
        <HStack gap="3px">
          <BaseText fontSize="12px" fontWeight="bold">
            Keur Immo
          </BaseText>
          <VerifiedMark />
        </HStack>
        <HStack gap="4px">
          <Circle size="6px" bg="success.solid" />
          <Tiny color="fg.muted">En ligne</Tiny>
        </HStack>
      </Stack>
      <Box color="fg.muted">
        <Icons.Phone size={14} />
      </Box>
    </HStack>

    <HStack gap="8px" mx="12px" mt="10px" p="8px" rounded="12px" bg="bg.muted">
      <Box w="38px" h="30px" rounded="8px" overflow="hidden" flexShrink={0}>
        <PropertyPhoto />
      </Box>
      <Stack gap={0} minW={0}>
        <Tiny fontWeight="semibold" truncate>
          Appartement F3 vue mer
        </Tiny>
        <Tiny color="fg.muted">12/08 → 15/08 · 3 nuits</Tiny>
      </Stack>
    </HStack>

    <Stack
      gap="8px"
      px="12px"
      py="12px"
      flex={1}
      minH={0}
      overflow="hidden"
      justifyContent="flex-end"
    >
      <Tiny textAlign="center" color="fg.muted">
        Aujourd’hui
      </Tiny>
      <Box
        alignSelf="flex-end"
        maxW="80%"
        px="10px"
        py="7px"
        rounded="14px"
        borderBottomRightRadius="4px"
        bg="primary.solid"
        color="primary.contrast"
      >
        <Tiny color="inherit">Bonjour, l’appartement est-il libre du 12 au 15 août ?</Tiny>
        <HStack gap="2px" justifyContent="flex-end" mt="2px" opacity={0.85}>
          <Tiny fontSize="8px" color="inherit">
            10:02
          </Tiny>
          <Icons.DoubleCheck size={11} />
        </HStack>
      </Box>
      <Box
        alignSelf="flex-start"
        maxW="80%"
        px="10px"
        py="7px"
        rounded="14px"
        borderBottomLeftRadius="4px"
        bg="bg.muted"
      >
        <Tiny>
          Bonjour Fatou ! Oui, il est libre. Je vous confirme la réservation dès réception de votre
          demande.
        </Tiny>
        <Tiny fontSize="8px" color="fg.muted" textAlign="right" mt="2px">
          10:04
        </Tiny>
      </Box>
      <Box
        alignSelf="flex-end"
        maxW="80%"
        p="8px"
        rounded="14px"
        borderBottomRightRadius="4px"
        borderWidth="1px"
        borderColor="border"
        bg="bg.panel"
      >
        <HStack gap="6px">
          <Circle size="22px" bg="warning.subtle" color="warning.fg">
            <Icons.Timer size={11} />
          </Circle>
          <Stack gap={0}>
            <Tiny fontWeight="semibold">Demande de réservation</Tiny>
            <Tiny color="fg.muted">En attente de confirmation</Tiny>
          </Stack>
        </HStack>
        <HStack gap="2px" justifyContent="flex-end" mt="4px" color="primary.fg">
          <Tiny fontSize="8px" color="fg.muted">
            10:05 · Lu
          </Tiny>
          <Icons.DoubleCheck size={11} />
        </HStack>
      </Box>
      <HStack alignSelf="flex-start" gap="3px" px="12px" py="9px" rounded="14px" bg="bg.muted">
        {[0, 1, 2].map((dot) => (
          <MotionBox
            key={dot}
            boxSize="5px"
            rounded="full"
            bg="fg.muted"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
          />
        ))}
      </HStack>
    </Stack>

    <HStack gap="8px" px="12px" pt="8px" pb="20px" borderTopWidth="1px" borderColor="border">
      <HStack flex={1} px="12px" py="7px" rounded="full" bg="bg.muted">
        <Tiny color="fg.muted">Écrire un message…</Tiny>
      </HStack>
      <Circle size="28px" bg="primary.solid" color="primary.contrast">
        <Icons.Send size={12} />
      </Circle>
    </HStack>
  </Flex>
);

/** Août 2026 commence un samedi (index 5, semaine du lundi au dimanche). */
const AUGUST_OFFSET = 5;
const BOOKED = [5, 6, 7, 8, 9, 10];
const SELECTED = [12, 13, 14, 15];

/** Écran 3 : réservation, avec les dates déjà prises bloquées. */
const BookingScreen = () => (
  <Flex direction="column" flex={1} minH={0}>
    <HStack gap="8px" px="14px" py="8px">
      <Box color="fg.muted">
        <Icons.ChevronLeft size={16} />
      </Box>
      <BaseText fontSize="13px" fontWeight="bold" flex={1}>
        Réserver
      </BaseText>
      <Circle size="26px" bg="bg.muted" color="red.500">
        <Icons.Heart size={12} />
      </Circle>
    </HStack>

    <HStack gap="8px" mx="14px" p="8px" rounded="12px" borderWidth="1px" borderColor="border">
      <Box w="46px" h="38px" rounded="8px" overflow="hidden" flexShrink={0}>
        <PropertyPhoto />
      </Box>
      <Stack gap={0} minW={0} flex={1}>
        <Tiny fontWeight="semibold" truncate>
          Appartement F3 vue mer
        </Tiny>
        <HStack gap="3px">
          <Tiny color="fg.muted">Keur Immo</Tiny>
          <VerifiedMark />
        </HStack>
      </Stack>
      <Tiny fontWeight="bold" color="primary.fg">
        45 000 XOF
      </Tiny>
    </HStack>

    <Stack gap="6px" px="14px" pt="12px" flex={1} minH={0}>
      <Flex justifyContent="space-between" alignItems="center">
        <BaseText fontSize="12px" fontWeight="bold">
          Août 2026
        </BaseText>
        <HStack gap="6px" color="fg.muted">
          <Icons.ChevronLeft size={12} />
          <Icons.ChevronRight size={12} />
        </HStack>
      </Flex>
      <Grid templateColumns="repeat(7, 1fr)" rowGap="4px" textAlign="center">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
          <Tiny key={index} color="fg.subtle" fontWeight="semibold">
            {day}
          </Tiny>
        ))}
        {Array.from({ length: AUGUST_OFFSET }, (_, index) => (
          <Box key={`empty-${index}`} />
        ))}
        {Array.from({ length: 31 }, (_, index) => {
          const day = index + 1;
          const booked = BOOKED.includes(day);
          const selected = SELECTED.includes(day);
          const edge = day === SELECTED[0] || day === SELECTED[SELECTED.length - 1];
          return (
            <Flex
              key={day}
              justifyContent="center"
              bg={selected && !edge ? 'primary.subtle' : undefined}
            >
              <Circle
                size="24px"
                fontSize="10px"
                fontWeight={selected ? 'bold' : 'medium'}
                bg={edge ? 'primary.solid' : undefined}
                color={
                  edge ? 'primary.contrast' : booked ? 'fg.subtle' : selected ? 'primary.fg' : 'fg'
                }
                textDecoration={booked ? 'line-through' : undefined}
              >
                {day}
              </Circle>
            </Flex>
          );
        })}
      </Grid>
      <HStack gap="10px" pt="2px">
        <HStack gap="4px">
          <Circle size="7px" bg="primary.solid" />
          <Tiny color="fg.muted">Vos dates</Tiny>
        </HStack>
        <HStack gap="4px">
          <Tiny color="fg.subtle" textDecoration="line-through">
            12
          </Tiny>
          <Tiny color="fg.muted">Déjà réservé</Tiny>
        </HStack>
      </HStack>
    </Stack>

    <Stack gap="8px" px="14px" pt="8px" pb="22px" borderTopWidth="1px" borderColor="border">
      <Flex justifyContent="space-between" alignItems="baseline">
        <Tiny color="fg.muted">3 nuits · 12 → 15 août</Tiny>
        <BaseText fontSize="13px" fontWeight="bold">
          135 000 XOF
        </BaseText>
      </Flex>
      <Flex
        justifyContent="center"
        py="9px"
        rounded="12px"
        bg="primary.solid"
        color="primary.contrast"
        fontSize="11px"
        fontWeight="semibold"
      >
        Demander la réservation
      </Flex>
    </Stack>
  </Flex>
);

const StoreButton = ({
  store,
  caption,
  bg = 'primary.fg',
}: {
  store: string;
  caption: string;
  bg: string;
}) => (
  <HStack
    gap={3}
    px={4}
    py={2}
    rounded="lg"
    width="full"
    bg={bg}
    color="white"
    opacity={0.9}
    aria-label={`${store} : bientôt disponible`}
  >
    <Icons.Mobile size={22} aria-hidden />
    <Stack gap={0}>
      <BaseText fontSize="10px" color="inherit" opacity={0.8}>
        {caption}
      </BaseText>
      <BaseText fontSize="sm" fontWeight="semibold" color="inherit" lineHeight="1.1">
        {store}
      </BaseText>
    </Stack>
  </HStack>
);

/** Côté clients : l'application mobile, en maquettes réalistes. */
export const MobileApp = () => (
  <LandingSection muted overflow="hidden">
    <Grid
      templateColumns={{ base: '1fr', xl: '0.8fr 1.2fr' }}
      gap={{ base: 10, lg: 12 }}
      alignItems="center"
    >
      <Box>
        <SectionHeading
          align="start"
          eyebrow="Application mobile"
          title="Vos clients réservent depuis leur téléphone"
          subtitle="L’application Keurezy met vos biens dans la poche de vos clients. Leurs demandes arrivent directement dans votre tableau de bord."
        />
        <Stack as="ul" gap={3} listStyleType="none" mt={{ base: -4, md: -6 }} mb={8}>
          {APP_POINTS.map(({ icon: Icon, text }) => (
            <HStack as="li" key={text} gap={3}>
              <BaseIcon boxSize="9" color="primary.solid" flexShrink={0}>
                <Icon aria-hidden />
              </BaseIcon>
              <BaseText variant={TextVariant.S}>{text}</BaseText>
            </HStack>
          ))}
        </Stack>
        <Stack gap={2}>
          <Flex gap={3}>
            <StoreButton store="App Store" caption="Bientôt sur" bg="primary.solid" />
            <StoreButton store="Google Play" caption="Bientôt sur" bg="secondary.solid" />
          </Flex>
          <BaseText variant={TextVariant.XS} color="fg.muted">
            L’application est en cours de développement.
          </BaseText>
        </Stack>
      </Box>

      <Reveal>
        <Flex justifyContent="center" alignItems="flex-start" position="relative" pt={{ lg: 4 }}>
          {/* Réservation, à gauche, en retrait */}
          <MotionBox
            display={{ base: 'none', md: 'block' }}
            mr="-72px"
            mt="56px"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <PhoneFrame transform="rotate(-5deg) scale(0.88)" transformOrigin="right center">
              <BookingScreen />
            </PhoneFrame>
          </MotionBox>
          {/* Recherche, au centre, au premier plan */}
          <MotionBox
            position="relative"
            zIndex={1}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PhoneFrame shadow="0 40px 80px -24px rgba(0,0,0,0.55)">
              <SearchScreen />
            </PhoneFrame>
          </MotionBox>
          {/* Messagerie, à droite, en retrait */}
          <MotionBox
            display={{ base: 'none', md: 'block' }}
            ml="-72px"
            mt="56px"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <PhoneFrame transform="rotate(5deg) scale(0.88)" transformOrigin="left center">
              <ChatScreen />
            </PhoneFrame>
          </MotionBox>
        </Flex>
      </Reveal>
    </Grid>
  </LandingSection>
);
