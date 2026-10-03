import { Box, Circle, Flex, Grid, HStack, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { BaseButton, BaseText, Icons, NavIcons, TextVariant } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { MotionBox } from '_constants/motion';
import { DashboardMockup } from '../../auth/onboarding/components/DashboardMockup';
import { ANCHORS } from './content';
import { LandingSection } from './Section';

const REASSURANCE = ['Plan gratuit', 'Sans engagement', 'Wave, Orange Money, Mobile Money'];

/** Notification flottante posée sur la maquette (grand écran seulement). */
const FloatingCard = ({
  icon,
  title,
  meta,
  delay,
  ...position
}: {
  icon: ReactNode;
  title: string;
  meta: string;
  delay: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}) => (
  <MotionBox
    position="absolute"
    {...position}
    display={{ base: 'none', lg: 'block' }}
    initial={{ opacity: 0, y: 16, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.45 }}
    bg="bg.panel"
    borderWidth="1px"
    borderColor="border"
    rounded="xl"
    shadow="lg"
    px={4}
    py={3}
    zIndex={1}
  >
    <HStack gap={3}>
      <Circle size="9" bg="success.subtle" color="success.fg" flexShrink={0}>
        {icon}
      </Circle>
      <Stack gap={0}>
        <BaseText variant={TextVariant.S} fontWeight="semibold">
          {title}
        </BaseText>
        <BaseText variant={TextVariant.XS} color="fg.muted">
          {meta}
        </BaseText>
      </Stack>
    </HStack>
  </MotionBox>
);

export const Hero = () => (
  <LandingSection pt={{ base: 16, md: 24 }} overflow="hidden">
    <Grid
      templateColumns={{ base: '1fr', lg: '1fr 1.1fr' }}
      gap={{ base: 12, lg: 16 }}
      alignItems="center"
    >
      <MotionBox
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack gap={6}>
          <HStack
            gap={2}
            px={3}
            py={1}
            rounded="full"
            bg="primary.subtle"
            color="primary.fg"
            width="fit-content"
          >
            <Icons.Office aria-hidden />
            <BaseText variant={TextVariant.S} fontWeight="medium" color="inherit">
              Le logiciel des agences immobilières
            </BaseText>
          </HStack>

          <BaseText
            as="h1"
            fontSize={{ base: '3xl', sm: '4xl', xl: '5xl' }}
            fontWeight="extrabold"
            lineHeight="1.08"
            letterSpacing="tight"
          >
            Votre agence immobilière, pilotée depuis{' '}
            <Box as="span" color="primary.fg">
              un seul espace
            </Box>
            .
          </BaseText>

          <BaseText fontSize={{ base: 'md', md: 'lg' }} color="fg.muted" maxW="xl">
            Biens, réservations, prospects, visites et factures : tout est réuni, sans tableur ni
            groupe WhatsApp. Vos clients, eux, réservent depuis l’application mobile.
          </BaseText>

          <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
            <Link href={APP_ROUTES.AUTH.ONBOARD}>
              <BaseButton
                size="lg"
                width={{ base: 'full', sm: 'auto' }}
                rightIcon={<Icons.ArrowRight aria-hidden />}
              >
                Créer mon agence gratuitement
              </BaseButton>
            </Link>
            <Link href={`#${ANCHORS.video}`}>
              <BaseButton
                size="lg"
                variant="outline"
                width={{ base: 'full', sm: 'auto' }}
                leftIcon={<Icons.VoicePlay aria-hidden />}
              >
                Voir la vidéo · 20 s
              </BaseButton>
            </Link>
          </Flex>

          <Flex as="ul" gap={{ base: 2, sm: 5 }} wrap="wrap" listStyleType="none">
            {REASSURANCE.map((item) => (
              <HStack as="li" key={item} gap={1.5} color="fg.muted">
                <Box color="success.fg" aria-hidden>
                  <Icons.DoubleCheck />
                </Box>
                <BaseText variant={TextVariant.S} color="inherit">
                  {item}
                </BaseText>
              </HStack>
            ))}
          </Flex>
        </Stack>
      </MotionBox>

      <Box position="relative" px={{ lg: 6 }} py={{ lg: 8 }}>
        <DashboardMockup
          userName="Awa Diop"
          role="Gérante"
          company="Keur Immo"
          properties={24}
          rent={185000}
          location="Dakar"
        />
        <FloatingCard
          top="0"
          right="-8px"
          delay={0.9}
          icon={<NavIcons.Bookings aria-hidden />}
          title="Réservation confirmée"
          meta="Studio Plateau · 05/08 → 10/08"
        />
        <FloatingCard
          bottom="0"
          left="-12px"
          delay={1.2}
          icon={<Icons.Wallet aria-hidden />}
          title="Paiement reçu par Wave"
          meta="210 000 XOF · Moussa Sarr"
        />
      </Box>
    </Grid>
  </LandingSection>
);
