import { Box, Circle, Flex, Grid, HStack, Stack } from '@chakra-ui/react';
import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BaseButton, BaseText, Icons, TextVariant } from '_components/custom';
import { MotionBox } from '_constants/motion';
import { LandingSection, SectionHeading } from './Section';

/** Août sur 30 jours : position et largeur (en %) d'une période du jour `from` au jour `to` inclus. */
const span = (from: number, to: number) => ({
  left: `${((from - 1) / 30) * 100}%`,
  width: `${((to - from + 1) / 30) * 100}%`,
});

const STEPS = [
  { title: 'Vous publiez une disponibilité', text: 'Le studio est libre du 01/08 au 30/08.' },
  { title: 'Un client réserve, vous confirmez', text: 'Moussa réserve du 05/08 au 10/08.' },
  {
    title: 'Le calendrier se découpe tout seul',
    text: 'Restent libres : 01/08 → 04/08 et 11/08 → 30/08.',
  },
];

const MARKERS = [
  { day: 1, label: '01/08' },
  { day: 5, label: '05/08' },
  { day: 11, label: '11/08' },
  { day: 30.999, label: '30/08' },
];

/** La frise : une période libre, une réservation qui se pose, la période qui se découpe. */
const Timeline = ({ step }: { step: number }) => {
  const split = step >= 2;
  const segments = split ? [span(1, 4), span(11, 30)] : [span(1, 30)];

  return (
    <Box
      role="img"
      aria-label={`Calendrier du studio : ${STEPS[step].text}`}
      rounded="2xl"
      borderWidth="1px"
      borderColor="border"
      bg="bg.panel"
      shadow="md"
      p={{ base: 4, md: 6 }}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={6} gap={3}>
        <Stack gap={0}>
          <BaseText variant={TextVariant.S} fontWeight="semibold">
            Studio meublé · Plateau
          </BaseText>
          <BaseText variant={TextVariant.XS} color="fg.muted">
            Location à la nuit · Août
          </BaseText>
        </Stack>
        <HStack gap={3} fontSize="xs" color="fg.muted">
          <HStack gap={1}>
            <Box boxSize="2.5" rounded="sm" bg="success.solid" />
            Libre
          </HStack>
          <HStack gap={1}>
            <Box boxSize="2.5" rounded="sm" bg="primary.solid" />
            Réservé
          </HStack>
        </HStack>
      </Flex>

      <Box position="relative" height="56px" rounded="lg" bg="bg.muted">
        {segments.map((segment, index) => (
          <MotionBox
            key={index}
            position="absolute"
            top="8px"
            bottom="8px"
            rounded="md"
            bg="success.solid"
            opacity={0.85}
            initial={false}
            animate={{
              left: segment.left,
              width: `calc(${segment.width} - ${split ? 6 : 0}px)`,
              marginLeft: split && index === 1 ? 6 : 0,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        ))}
        <MotionBox
          position="absolute"
          top="4px"
          bottom="4px"
          rounded="md"
          bg="primary.solid"
          color="primary.contrast"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
          fontWeight="semibold"
          shadow="md"
          zIndex={1}
          style={span(5, 10)}
          initial={false}
          animate={step >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -28, scale: 0.9 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          Moussa S.
        </MotionBox>
      </Box>

      <Box position="relative" height="20px" mt={2}>
        {MARKERS.map(({ day, label }) => (
          <BaseText
            key={label}
            position="absolute"
            left={`${((day - 1) / 30) * 100}%`}
            transform={day > 30 ? 'translateX(-100%)' : undefined}
            variant={TextVariant.XS}
            color="fg.muted"
          >
            {label}
          </BaseText>
        ))}
      </Box>

      <Flex mt={5} gap={2} wrap="wrap">
        <HStack
          gap={2}
          px={3}
          py={1.5}
          rounded="md"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="warning.emphasized"
        >
          <Icons.Timer aria-hidden />
          <BaseText variant={TextVariant.XS}>
            Demande en attente 12/08 → 15/08 : ne bloque pas les dates
          </BaseText>
        </HStack>
      </Flex>
    </Box>
  );
};

/** Bloc signature : les disponibilités se recalculent seules à chaque réservation. */
export const AvailabilityShowcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  // Déroule les trois étapes quand la frise devient visible (directement la fin si animations réduites)
  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setStep(2);
      return;
    }
    setStep(0);
    const timers = [setTimeout(() => setStep(1), 900), setTimeout(() => setStep(2), 2300)];
    return () => timers.forEach(clearTimeout);
  }, [inView, reduceMotion, run]);

  return (
    <LandingSection muted>
      <SectionHeading
        eyebrow="Disponibilités automatiques"
        title="Le calendrier se met à jour tout seul"
        subtitle="Plus de double location : chaque réservation confirmée découpe les disponibilités du bien."
      />
      <Grid
        ref={ref}
        templateColumns={{ base: '1fr', lg: '1fr 1.4fr' }}
        gap={{ base: 8, lg: 12 }}
        alignItems="center"
      >
        <Stack as="ol" gap={3} listStyleType="none">
          {STEPS.map((item, index) => {
            const active = index === step;
            const done = index < step;
            return (
              <HStack
                as="li"
                key={item.title}
                gap={4}
                p={4}
                rounded="xl"
                alignItems="flex-start"
                bg={active ? 'bg' : 'transparent'}
                borderWidth="1px"
                borderColor={active ? 'primary.muted' : 'transparent'}
                shadow={active ? 'sm' : 'none'}
                transition="all 0.3s"
                aria-current={active ? 'step' : undefined}
              >
                <Circle
                  size="8"
                  flexShrink={0}
                  bg={active || done ? 'primary.solid' : 'bg.muted'}
                  color={active || done ? 'primary.contrast' : 'fg.muted'}
                  fontSize="sm"
                  fontWeight="bold"
                  transition="all 0.3s"
                >
                  {done ? <Icons.Check aria-hidden /> : index + 1}
                </Circle>
                <Stack gap={0}>
                  <BaseText fontWeight="semibold" color={active || done ? 'fg' : 'fg.muted'}>
                    {item.title}
                  </BaseText>
                  <BaseText variant={TextVariant.S} color="fg.muted">
                    {item.text}
                  </BaseText>
                </Stack>
              </HStack>
            );
          })}
          {!reduceMotion && (
            <Box pl={4}>
              <BaseButton
                variant="ghost"
                size="sm"
                disabled={step < 2}
                leftIcon={<Icons.Refresh aria-hidden />}
                onClick={() => setRun((value) => value + 1)}
              >
                Rejouer
              </BaseButton>
            </Box>
          )}
        </Stack>
        <Timeline step={step} />
      </Grid>
    </LandingSection>
  );
};
