'use client';

import { Box, type BoxProps, Flex, HStack, Stack } from '@chakra-ui/react';
import { AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ASSETS } from '_assets/images';
import { Icons, NavIcons } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { MotionBox } from '_constants/motion';
import { VariablesColors } from '_theme/variables';

/*
 * Vidéo motion design (9:16, 19,5 s) : ce qu'est Keurezy, ses fonctionnalités phares, puis un
 * appel à l'action. Animée en code (pas de fichier vidéo à charger) ; toutes les tailles sont en
 * `cqw` (pourcentage de la largeur du cadre) pour garder les mêmes proportions de 280 px à
 * 1080 px de large (page /promo, à enregistrer pour les réseaux sociaux).
 */

const C = {
  violet: VariablesColors.primary,
  gold: VariablesColors.secondary,
  teal: VariablesColors.tertiary,
  ink: '#140d26',
  night: '#1f1438',
  white: '#ffffff',
  mist: 'rgba(255,255,255,0.72)',
};

/** Adresse affichée à la fin : URL publique actuelle, à changer avec le nom de domaine définitif. */
export const PROMO_URL = 'keurezy.onrender.com';

/** Durée de chaque scène, en secondes (total : 19,5 s). */
const SCENES = [2.6, 2.8, 3, 3, 2.8, 2.6, 2.7];
const STARTS = SCENES.map((_, i) => SCENES.slice(0, i).reduce((a, b) => a + b, 0));
export const PROMO_DURATION = SCENES.reduce((a, b) => a + b, 0);

/** Texte dimensionné sur la largeur du cadre. */
const T = ({ size, children, ...rest }: { size: number; children: ReactNode } & BoxProps) => (
  <Box fontSize={`${size}cqw`} lineHeight="1.2" {...rest}>
    {children}
  </Box>
);

/** Apparition décalée dans une scène. */
const In = ({
  delay = 0,
  from = { y: 24 },
  children,
  ...rest
}: { delay?: number; from?: Record<string, number>; children: ReactNode } & Pick<
  BoxProps,
  'position' | 'top' | 'left' | 'right' | 'bottom' | 'width' | 'zIndex'
>) => (
  <MotionBox
    initial={{ opacity: 0, ...from }}
    animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    {...rest}
  >
    {children}
  </MotionBox>
);

/** Étiquette « 01 · Biens » en tête des scènes de fonctionnalités. */
const Chapter = ({ n, label }: { n: string; label: string }) => (
  <In>
    <HStack gap="2cqw" color={C.gold} fontWeight="bold" letterSpacing="wider">
      <T size={3.6}>{n}</T>
      <Box w="6cqw" h="0.5cqw" bg={C.gold} rounded="full" />
      <T size={3.6} textTransform="uppercase">
        {label}
      </T>
    </HStack>
  </In>
);

const Title = ({ children, delay = 0.15 }: { children: ReactNode; delay?: number }) => (
  <In delay={delay}>
    <T size={8.4} fontWeight="extrabold" color={C.white} letterSpacing="-0.02em">
      {children}
    </T>
  </In>
);

/** Carte claire posée sur le fond sombre. */
const Card = ({ children, ...rest }: { children: ReactNode } & BoxProps) => (
  <Box
    bg={C.white}
    color={C.ink}
    rounded="4cqw"
    p="4cqw"
    boxShadow="0 4cqw 10cqw -4cqw rgba(0,0,0,0.5)"
    {...rest}
  >
    {children}
  </Box>
);

const Pill = ({ color, children }: { color: string; children: ReactNode }) => (
  <Box
    px="2.6cqw"
    py="0.8cqw"
    rounded="full"
    bg={`${color}22`}
    color={color}
    fontSize="3cqw"
    fontWeight="bold"
  >
    {children}
  </Box>
);

/* ---------- Scènes ---------- */

const SceneIntro = () => (
  <Stack
    h="full"
    alignItems="center"
    justifyContent="center"
    gap="5cqw"
    px="8cqw"
    textAlign="center"
  >
    <In from={{ scale: 0.6 }}>
      <Box
        bg={C.white}
        rounded="5cqw"
        px="6cqw"
        py="3cqw"
        boxShadow="0 0 0 2cqw rgba(255,255,255,0.08)"
      >
        <Image
          src={ASSETS.LOGO}
          alt="Keurezy"
          width={866}
          height={288}
          style={{ width: '52cqw', height: 'auto' }}
        />
      </Box>
    </In>
    <In delay={0.5}>
      <T size={6.4} fontWeight="bold" color={C.white}>
        Le logiciel des agences immobilières
      </T>
    </In>
    <In delay={0.9}>
      <HStack gap="2cqw" justifyContent="center">
        <Pill color={C.gold}>Biens</Pill>
        <Pill color={C.teal}>Réservations</Pill>
        <Pill color={C.white}>Factures</Pill>
      </HStack>
    </In>
  </Stack>
);

const MESS = [
  { label: 'Excel', rotate: -8, x: -18 },
  { label: 'WhatsApp', rotate: 6, x: 16 },
  { label: 'Carnets', rotate: -4, x: -10 },
  { label: 'Word', rotate: 9, x: 20 },
];

const SceneProblem = () => (
  <Stack h="full" justifyContent="center" gap="6cqw" px="8cqw">
    <Title delay={0}>Vos biens, vos clients, vos factures…</Title>
    <Stack gap="3cqw" alignItems="center">
      {MESS.map((item, index) => (
        <MotionBox
          key={item.label}
          initial={{ opacity: 0, y: -40, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0.25], y: 0, rotate: item.rotate, x: `${item.x}cqw` }}
          transition={{ delay: 0.3 + index * 0.15, duration: 1.8, times: [0, 0.2, 0.7, 1] }}
        >
          <Box
            px="5cqw"
            py="2cqw"
            rounded="2.5cqw"
            bg="rgba(255,255,255,0.1)"
            color={C.mist}
            fontSize="4.6cqw"
            fontWeight="semibold"
            borderWidth="0.3cqw"
            borderColor="rgba(255,255,255,0.18)"
          >
            {item.label}
          </Box>
        </MotionBox>
      ))}
    </Stack>
    <In delay={1.7}>
      <T size={7} fontWeight="extrabold" color={C.gold}>
        …réunis dans un seul espace.
      </T>
    </In>
  </Stack>
);

const SceneProperties = () => (
  <Stack h="full" justifyContent="center" gap="5cqw" px="8cqw">
    <Chapter n="01" label="Biens & annonces" />
    <Title>Tout votre parc, rangé.</Title>
    <Stack gap="3cqw">
      {[
        {
          name: 'Villa F5 · Almadies',
          price: '650 000 XOF / mois',
          tag: 'Disponible',
          color: '#16a34a',
        },
        { name: 'Studio · Plateau', price: '35 000 XOF / nuit', tag: 'Réservé', color: C.violet },
        { name: 'Terrain · Diamniadio', price: '300 000 XOF / an', tag: 'Annonce', color: C.teal },
      ].map((row, index) => (
        <In key={row.name} delay={0.45 + index * 0.18} from={{ x: 60 }}>
          <Card py="3cqw">
            <Flex alignItems="center" gap="3cqw">
              <Flex
                boxSize="10cqw"
                rounded="2.5cqw"
                bg={`${row.color}1f`}
                color={row.color}
                alignItems="center"
                justifyContent="center"
                fontSize="5cqw"
              >
                <NavIcons.Properties />
              </Flex>
              <Stack gap="0.5cqw" flex={1} minW={0}>
                <T size={3.8} fontWeight="bold">
                  {row.name}
                </T>
                <T size={3.2} color="#6b7280">
                  {row.price}
                </T>
              </Stack>
              <Pill color={row.color}>{row.tag}</Pill>
            </Flex>
          </Card>
        </In>
      ))}
    </Stack>
  </Stack>
);

const pct = (from: number, to: number) => ({
  left: `${((from - 1) / 30) * 100}%`,
  width: `${((to - from + 1) / 30) * 100}%`,
});

const SceneBookings = () => (
  <Stack h="full" justifyContent="center" gap="5cqw" px="8cqw">
    <Chapter n="02" label="Réservations" />
    <Title>Jamais de double location.</Title>
    <In delay={0.35}>
      <Card>
        <T size={3.6} fontWeight="bold" mb="1cqw">
          Studio · Plateau
        </T>
        <T size={3} color="#6b7280" mb="4cqw">
          Août · à la nuit
        </T>
        <Box position="relative" h="12cqw" rounded="2cqw" bg="#f1f0f6">
          {/* Période libre, qui se découpe autour de la réservation */}
          <MotionBox
            position="absolute"
            top="2cqw"
            bottom="2cqw"
            rounded="1.5cqw"
            bg="#22c55e"
            initial={pct(1, 30)}
            animate={{ ...pct(1, 4), width: `calc(${pct(1, 4).width} - 1cqw)` }}
            transition={{ delay: 1.5, duration: 0.6 }}
          />
          <MotionBox
            position="absolute"
            top="2cqw"
            bottom="2cqw"
            rounded="1.5cqw"
            bg="#22c55e"
            initial={{ ...pct(1, 30), opacity: 0 }}
            animate={{ ...pct(11, 30), opacity: 1, marginLeft: '1cqw' }}
            transition={{ delay: 1.5, duration: 0.6 }}
          />
          <MotionBox
            position="absolute"
            top="1cqw"
            bottom="1cqw"
            rounded="1.5cqw"
            bg={C.violet}
            color={C.white}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="3cqw"
            fontWeight="bold"
            zIndex={1}
            style={pct(5, 10)}
            initial={{ opacity: 0, y: '-10cqw' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.45, ease: 'easeOut' }}
          >
            Moussa
          </MotionBox>
        </Box>
        <Flex justifyContent="space-between" mt="2cqw" color="#6b7280">
          {['01/08', '05/08', '11/08', '30/08'].map((d) => (
            <T key={d} size={2.8}>
              {d}
            </T>
          ))}
        </Flex>
      </Card>
    </In>
    <In delay={2}>
      <HStack gap="2cqw" color={C.mist}>
        <Box color={C.teal} fontSize="5cqw">
          <Icons.DoubleCheck />
        </Box>
        <T size={4}>Le calendrier se met à jour tout seul.</T>
      </HStack>
    </In>
  </Stack>
);

const Bubble = ({
  mine,
  delay,
  children,
}: {
  mine?: boolean;
  delay: number;
  children: ReactNode;
}) => (
  <In delay={delay} from={{ y: 16, scale: 0.9 }}>
    <Flex justifyContent={mine ? 'flex-end' : 'flex-start'}>
      <Box
        maxW="78%"
        px="3.6cqw"
        py="2.4cqw"
        rounded="4cqw"
        borderBottomRightRadius={mine ? '1cqw' : '4cqw'}
        borderBottomLeftRadius={mine ? '4cqw' : '1cqw'}
        bg={mine ? C.violet : C.white}
        color={mine ? C.white : C.ink}
        fontSize="3.6cqw"
        lineHeight="1.35"
      >
        {children}
      </Box>
    </Flex>
  </In>
);

const SceneMessages = () => (
  <Stack h="full" justifyContent="center" gap="5cqw" px="8cqw">
    <Chapter n="03" label="Prospects & messages" />
    <Title>Aucun prospect ne se perd.</Title>
    <Stack gap="2.6cqw">
      <Bubble mine delay={0.4}>
        Bonjour, le F3 est-il libre du 12 au 15 août ?
      </Bubble>
      <Bubble delay={1}>Oui ! Je vous envoie la demande de réservation.</Bubble>
      <In delay={1.5}>
        <HStack justifyContent="flex-end" gap="1.5cqw" color={C.teal}>
          <T size={3}>Lu</T>
          <Box fontSize="4cqw">
            <Icons.DoubleCheck />
          </Box>
        </HStack>
      </In>
      <In delay={1.8}>
        <HStack gap="1.4cqw" bg={C.white} w="fit-content" px="4cqw" py="3cqw" rounded="4cqw">
          {[0, 1, 2].map((dot) => (
            <MotionBox
              key={dot}
              boxSize="1.8cqw"
              rounded="full"
              bg="#9ca3af"
              animate={{ y: [0, '-1cqw', 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
            />
          ))}
        </HStack>
      </In>
    </Stack>
  </Stack>
);

const ScenePayments = () => (
  <Stack h="full" justifyContent="center" gap="5cqw" px="8cqw">
    <Chapter n="04" label="Paiement & factures" />
    <Title>Payé, facturé, rangé.</Title>
    <In delay={0.4} from={{ y: -40 }}>
      <Card py="3cqw">
        <HStack gap="3cqw">
          <Flex
            boxSize="10cqw"
            rounded="full"
            bg="#22c55e22"
            color="#16a34a"
            alignItems="center"
            justifyContent="center"
            fontSize="5cqw"
          >
            <Icons.Wallet />
          </Flex>
          <Stack gap="0.5cqw">
            <T size={3.8} fontWeight="bold">
              Paiement reçu par Wave
            </T>
            <T size={3.2} color="#6b7280">
              210 000 XOF · Moussa Sarr
            </T>
          </Stack>
        </HStack>
      </Card>
    </In>
    <In delay={0.9}>
      <Card position="relative" overflow="hidden">
        <Flex justifyContent="space-between" mb="3cqw">
          <T size={3.8} fontWeight="bold">
            Facture FAC-0142
          </T>
          <T size={3.2} color="#6b7280">
            Keur Immo
          </T>
        </Flex>
        {[70, 90, 55].map((w, i) => (
          <Box key={i} h="1.8cqw" w={`${w}%`} rounded="full" bg="#ececf3" mb="2cqw" />
        ))}
        <MotionBox
          position="absolute"
          right="5cqw"
          bottom="4cqw"
          initial={{ opacity: 0, scale: 2, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          transition={{ delay: 1.5, duration: 0.35, ease: 'backOut' }}
          borderWidth="0.6cqw"
          borderColor="#16a34a"
          color="#16a34a"
          rounded="1.5cqw"
          px="2.4cqw"
          py="0.6cqw"
          fontSize="4cqw"
          fontWeight="extrabold"
        >
          PAYÉE
        </MotionBox>
      </Card>
    </In>
    <In delay={1.6}>
      <HStack gap="2cqw" flexWrap="wrap">
        <Pill color={C.gold}>Wave</Pill>
        <Pill color={C.gold}>Orange Money</Pill>
        <Pill color={C.gold}>Mobile Money</Pill>
      </HStack>
    </In>
  </Stack>
);

const SceneCta = ({ interactive }: { interactive: boolean }) => {
  const button = (
    <MotionBox
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ delay: 1.2, duration: 1.2, repeat: Infinity }}
      bg={C.gold}
      color={C.ink}
      px="8cqw"
      py="3.6cqw"
      rounded="full"
      fontSize="5cqw"
      fontWeight="extrabold"
      boxShadow={`0 0 0 2cqw ${C.gold}33`}
    >
      Créer mon agence gratuitement
    </MotionBox>
  );
  return (
    <Stack
      h="full"
      alignItems="center"
      justifyContent="center"
      gap="6cqw"
      px="8cqw"
      textAlign="center"
    >
      <In from={{ scale: 0.8 }}>
        <Box bg={C.white} rounded="4cqw" px="5cqw" py="2.4cqw">
          <Image
            src={ASSETS.LOGO}
            alt="Keurezy"
            width={866}
            height={288}
            style={{ width: '40cqw', height: 'auto' }}
          />
        </Box>
      </In>
      <Title delay={0.3}>Lancez votre agence aujourd’hui.</Title>
      <In delay={0.6}>
        <T size={4.2} color={C.mist}>
          Plan gratuit · Sans engagement · Paiement mobile
        </T>
      </In>
      <In delay={0.9}>
        {interactive ? (
          <Link href={APP_ROUTES.AUTH.ONBOARD} tabIndex={-1}>
            {button}
          </Link>
        ) : (
          button
        )}
      </In>
      <In delay={1.2}>
        <T size={3.6} color={C.mist} fontWeight="semibold" letterSpacing="wide">
          {PROMO_URL}
        </T>
      </In>
    </Stack>
  );
};

/* ---------- Lecteur ---------- */

/**
 * Lecteur de la vidéo : lecture automatique quand le cadre devient visible (sauf si
 * l'utilisateur a demandé moins d'animations), pause, reprise, rejouer, progression par scène.
 * `bare` : sans commandes (enregistrement plein écran depuis /promo).
 */
export const PromoVideo = ({ bare = false, ...rest }: { bare?: boolean } & BoxProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { amount: 0.5, once: true });
  const reduceMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);
  const ended = elapsed >= PROMO_DURATION;

  // Horloge : avance tant que la lecture est en cours
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      setElapsed((value) => Math.min(PROMO_DURATION, value + (now - last) / 1000));
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    if (ended) setPlaying(false);
  }, [ended]);

  // Lecture automatique à la première apparition
  useEffect(() => {
    if (inView && !reduceMotion) setPlaying(true);
  }, [inView, reduceMotion]);

  const replay = useCallback(() => {
    setElapsed(0);
    setRun((value) => value + 1);
    setPlaying(true);
  }, []);

  const scene = Math.max(
    0,
    STARTS.findLastIndex((start) => elapsed >= start),
  );
  const scenes = [
    <SceneIntro key="intro" />,
    <SceneProblem key="problem" />,
    <SceneProperties key="properties" />,
    <SceneBookings key="bookings" />,
    <SceneMessages key="messages" />,
    <ScenePayments key="payments" />,
    <SceneCta key="cta" interactive={!bare} />,
  ];
  const started = playing || elapsed > 0;

  return (
    <Box
      ref={frameRef}
      role="region"
      aria-roledescription="vidéo"
      aria-label="Keurezy en 20 secondes : présentation et fonctionnalités phares"
      position="relative"
      aspectRatio="9 / 16"
      width="full"
      overflow="hidden"
      rounded={bare ? 0 : '6cqw'}
      bg={C.ink}
      color={C.white}
      fontFamily="var(--font-lato), sans-serif"
      style={{ containerType: 'inline-size' }}
      boxShadow={bare ? undefined : '0 40px 80px -30px rgba(31, 20, 56, 0.6)'}
      {...rest}
    >
      {/* Fond : dégradé de la charte et halos qui dérivent */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="to-b"
        gradientFrom={C.night}
        gradientTo={C.ink}
      />
      <MotionBox
        position="absolute"
        w="120cqw"
        h="120cqw"
        rounded="full"
        top="-40cqw"
        left="-30cqw"
        bg={`${C.violet}55`}
        filter="blur(18cqw)"
        animate={{ x: ['0cqw', '20cqw', '0cqw'], y: ['0cqw', '10cqw', '0cqw'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MotionBox
        position="absolute"
        w="90cqw"
        h="90cqw"
        rounded="full"
        bottom="-40cqw"
        right="-40cqw"
        bg={`${C.teal}33`}
        filter="blur(18cqw)"
        animate={{ x: ['0cqw', '-15cqw', '0cqw'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Progression, une barre par scène (façon story) */}
      <HStack
        position="absolute"
        top="5cqw"
        left="9cqw"
        right="9cqw"
        gap="1.2cqw"
        zIndex={2}
        aria-hidden
      >
        {SCENES.map((duration, index) => {
          const progress = Math.min(1, Math.max(0, (elapsed - STARTS[index]) / duration));
          return (
            <Box
              key={index}
              flex={duration}
              h="0.8cqw"
              rounded="full"
              bg="rgba(255,255,255,0.25)"
              overflow="hidden"
            >
              <Box h="full" bg={C.white} style={{ width: `${progress * 100}%` }} />
            </Box>
          );
        })}
      </HStack>

      {/* Scènes */}
      <Box position="absolute" inset={0}>
        {started ? (
          <AnimatePresence>
            <MotionBox
              key={`${run}-${scene}`}
              position="absolute"
              inset={0}
              pt="10cqw"
              pb="14cqw"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4 }}
            >
              {scenes[scene]}
            </MotionBox>
          </AnimatePresence>
        ) : (
          // Affiche avant la lecture
          <Box position="absolute" inset={0} pt="10cqw" pb="14cqw">
            <SceneIntro />
          </Box>
        )}
      </Box>

      {/* Commandes */}
      {!bare && (
        <Flex
          position="absolute"
          bottom="4cqw"
          left="5cqw"
          right="5cqw"
          justifyContent="space-between"
          alignItems="center"
          zIndex={2}
        >
          <Box
            as="button"
            aria-label={playing ? 'Mettre en pause' : ended ? 'Rejouer la vidéo' : 'Lire la vidéo'}
            onClick={() => (ended ? replay() : setPlaying((value) => !value))}
            display="flex"
            alignItems="center"
            gap="2cqw"
            px="4cqw"
            py="2cqw"
            rounded="full"
            bg="rgba(255,255,255,0.14)"
            backdropFilter="blur(8px)"
            fontSize="3.4cqw"
            fontWeight="semibold"
            cursor="pointer"
            _hover={{ bg: 'rgba(255,255,255,0.24)' }}
            _focusVisible={{ outline: `2px solid ${C.gold}`, outlineOffset: '2px' }}
          >
            {playing ? <Icons.VoicePause /> : ended ? <Icons.Refresh /> : <Icons.VoicePlay />}
            {playing ? 'Pause' : ended ? 'Rejouer' : started ? 'Reprendre' : 'Lire · 20 s'}
          </Box>
          <Box fontSize="3cqw" color={C.mist} aria-hidden>
            0:{String(Math.floor(elapsed)).padStart(2, '0')} / 0:{Math.round(PROMO_DURATION)}
          </Box>
        </Flex>
      )}
    </Box>
  );
};
