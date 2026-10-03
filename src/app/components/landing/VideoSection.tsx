import { Box, Circle, Flex, Grid, HStack, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { BaseButton, BaseText, Icons, TextVariant } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { ANCHORS } from './content';
import { PromoVideo } from './PromoVideo';
import { LandingSection, Reveal, SectionHeading } from './Section';

const CHAPTERS = [
  'Biens & annonces',
  'Réservations sans double location',
  'Prospects & messagerie',
  'Paiement mobile & factures',
];

/** « Keurezy en 20 secondes » : la vidéo 9:16 et ses chapitres. */
export const VideoSection = () => (
  <LandingSection id={ANCHORS.video} muted>
    <Grid
      templateColumns={{ base: '1fr', lg: '1fr 360px' }}
      gap={{ base: 10, lg: 20 }}
      alignItems="center"
      maxW="5xl"
      mx="auto"
    >
      <Box>
        <SectionHeading
          align="start"
          eyebrow="En 20 secondes"
          title="Keurezy, c’est quoi ?"
          subtitle="Un seul espace pour gérer votre parc, vos réservations, vos clients et vos encaissements. La vidéo résume l’essentiel."
        />
        <Stack as="ol" gap={3} listStyleType="none" mt={{ base: -4, md: -6 }} mb={8}>
          {CHAPTERS.map((chapter, index) => (
            <HStack as="li" key={chapter} gap={3}>
              <Circle
                size="8"
                bg="primary.subtle"
                color="primary.fg"
                fontSize="sm"
                fontWeight="bold"
              >
                {index + 1}
              </Circle>
              <BaseText variant={TextVariant.S} fontWeight="medium">
                {chapter}
              </BaseText>
            </HStack>
          ))}
        </Stack>
        <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
          <Link href={APP_ROUTES.AUTH.ONBOARD}>
            <BaseButton
              width={{ base: 'full', sm: 'auto' }}
              rightIcon={<Icons.ArrowRight aria-hidden />}
            >
              Créer mon agence gratuitement
            </BaseButton>
          </Link>
        </Flex>
      </Box>
      <Reveal maxW="360px" width="full" mx="auto">
        <PromoVideo />
      </Reveal>
    </Grid>
  </LandingSection>
);
