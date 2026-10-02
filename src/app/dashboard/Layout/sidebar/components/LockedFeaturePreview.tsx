'use client';

import { Box, Flex, Stack } from '@chakra-ui/react';

/** Aperçus animés disponibles pour un module verrouillé du menu. */
export type LockedPreview = 'team' | 'stats';

/**
 * Animations des aperçus (boucle de 4,2 s), coupées quand le système demande de réduire les
 * mouvements. Préfixe `kzp-` : rien d'autre dans l'application n'utilise ces noms.
 */
const PREVIEW_CSS = `
.kzp-pop{animation:kzp-pop 4.2s cubic-bezier(.22,1,.36,1) infinite both}
.kzp-d1{animation-delay:.15s}.kzp-d2{animation-delay:.45s}.kzp-d3{animation-delay:.75s}
.kzp-tick{stroke-dasharray:14;animation:kzp-tick 4.2s ease infinite both}
.kzp-t2{animation-delay:.35s}
.kzp-toast{animation:kzp-toast 4.2s cubic-bezier(.22,1,.36,1) infinite both}
.kzp-bar{transform-origin:bottom;animation:kzp-grow 4.2s cubic-bezier(.22,1,.36,1) infinite both}
.kzp-b2{animation-delay:.12s}.kzp-b3{animation-delay:.24s}.kzp-b4{animation-delay:.36s}.kzp-b5{animation-delay:.48s}
.kzp-line{stroke-dasharray:300;animation:kzp-draw 4.2s ease infinite both}
@keyframes kzp-pop{0%,6%{transform:scale(0);opacity:0}16%,86%{transform:scale(1);opacity:1}100%{transform:scale(1);opacity:0}}
@keyframes kzp-tick{0%,32%{stroke-dashoffset:14}46%,88%{stroke-dashoffset:0}100%{stroke-dashoffset:14}}
@keyframes kzp-toast{0%,52%{transform:translateY(10px);opacity:0}62%,88%{transform:none;opacity:1}100%{opacity:0}}
@keyframes kzp-grow{0%,8%{transform:scaleY(.06)}38%,88%{transform:scaleY(1)}100%{transform:scaleY(.06)}}
@keyframes kzp-draw{0%,34%{stroke-dashoffset:300}68%,90%{stroke-dashoffset:0}100%{stroke-dashoffset:300}}
@media (prefers-reduced-motion: reduce){.kzp-pop,.kzp-tick,.kzp-toast,.kzp-bar,.kzp-line{animation:none!important}}
`;

const caption = {
  fontSize: '10px',
  fontWeight: 'bold',
  color: 'fg.muted',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
} as const;

const Avatar = ({
  initials,
  bg,
  color,
  delay,
  first,
}: {
  initials: string;
  bg: string;
  color: string;
  delay: string;
  first?: boolean;
}) => (
  <Flex
    className={`kzp-pop ${delay}`}
    boxSize="32px"
    rounded="full"
    bg={bg}
    color={color}
    fontSize="11px"
    fontWeight="bold"
    alignItems="center"
    justifyContent="center"
    borderWidth="2px"
    borderColor="bg.subtle"
    ml={first ? 0 : '-8px'}
  >
    {initials}
  </Flex>
);

const Tick = ({ label, delay, done = true }: { label: string; delay?: string; done?: boolean }) => (
  <Flex alignItems="center" gap="7px" fontSize="11px" color={done ? 'fg' : 'fg.muted'}>
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      {done ? (
        <>
          <rect x="1" y="1" width="14" height="14" rx="4" fill="var(--chakra-colors-primary-500)" />
          <path
            className={`kzp-tick ${delay ?? ''}`}
            d="M4.5 8.2 7 10.5l4.5-5"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <rect x="1.5" y="1.5" width="13" height="13" rx="4" fill="none" stroke="currentColor" />
      )}
    </svg>
    {label}
  </Flex>
);

/** Collaborateurs : l'équipe arrive, des permissions se cochent, l'invitation part. */
const TeamPreview = () => (
  <Flex position="absolute" inset="14px" gap="14px" width="full">
    <Stack gap="8px" width="120px">
      <Box {...caption}>Équipe</Box>
      <Flex>
        <Avatar initials="AD" bg="primary.500" color="white" delay="kzp-d1" first />
        <Avatar initials="MS" bg="orange.400" color="orange.950" delay="kzp-d2" />
        <Avatar initials="KN" bg="teal.600" color="white" delay="kzp-d3" />
        <Avatar initials="NY" bg="yellow.600" color="white" delay="kzp-d3" />
      </Flex>
      <Box
        className="kzp-toast"
        mt="auto"
        fontSize="10px"
        fontWeight="semibold"
        bg="teal.500"
        color="white"
        rounded="7px"
        px="8px"
        py="6px"
        width="fit-content"
      >
        Invitation envoyée
      </Box>
    </Stack>
    <Stack flex="1" gap="8px" bg="bg" rounded="8px" borderWidth="1px" borderColor="border" p="10px">
      <Box {...caption}>Permissions</Box>
      <Tick label="Voir les réservations" />
      <Tick label="Confirmer une réservation" delay="kzp-t2" />
      <Tick label="Émettre une facture" done={false} />
    </Stack>
  </Flex>
);

const BARS = [
  { height: '38%', bg: 'primary.200', delay: '' },
  { height: '52%', bg: 'primary.300', delay: 'kzp-b2' },
  { height: '47%', bg: 'primary.400', delay: 'kzp-b3' },
  { height: '70%', bg: 'primary.500', delay: 'kzp-b4' },
  { height: '86%', bg: 'primary.600', delay: 'kzp-b5' },
];

/** Statistiques : les indicateurs montent barre après barre, la courbe d'évolution se trace. */
const StatsPreview = () => (
  <Stack position="absolute" inset="14px" gap="6px">
    <Flex justifyContent="space-between" {...caption}>
      <span>Activité de l’agence</span>
      <Box as="span" color="primary.500">
        6 mois
      </Box>
    </Flex>
    <Flex
      flex="1"
      position="relative"
      alignItems="flex-end"
      gap="12px"
      px="6px"
      borderBottomWidth="1px"
      borderColor="border"
    >
      {BARS.map((bar, i) => (
        <Box
          key={i}
          className={`kzp-bar ${bar.delay}`}
          flex="1"
          height={bar.height}
          bg={bar.bg}
          roundedTop="5px"
        />
      ))}
      <svg
        viewBox="0 0 260 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden
      >
        <path
          className="kzp-line"
          d="M10 70 C 50 64, 70 50, 110 54 S 170 36, 200 30 S 240 14, 252 10"
          fill="none"
          stroke="var(--chakra-colors-orange-400)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Flex>
  </Stack>
);

/** Zone animée de la carte d'un module verrouillé (purement illustrative : masquée aux lecteurs d'écran). */
export const LockedFeaturePreview = ({ preview }: { preview: LockedPreview }) => (
  <Box
    aria-hidden
    height="170px"
    rounded="10px"
    bg="bg.subtle"
    borderWidth="1px"
    borderColor="border"
    position="relative"
    overflow="hidden"
  >
    <style>{PREVIEW_CSS}</style>
    {preview === 'team' ? <TeamPreview /> : <StatsPreview />}
  </Box>
);
