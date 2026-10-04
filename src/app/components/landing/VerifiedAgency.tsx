import { Box, Circle, Flex, Grid, HStack, Stack } from '@chakra-ui/react';
import { BaseTag, BaseIcon, BaseText, Icons, TextVariant } from '_components/custom';
import { LandingSection, Reveal, SectionHeading } from './Section';

const PROOFS = [
  { title: 'Statuts de l’agence', text: 'La forme juridique et l’existence de la société.' },
  { title: 'Attestation NINEA', text: 'L’identification fiscale de l’agence.' },
  { title: 'Extrait RCCM', text: 'L’immatriculation au registre du commerce.' },
];

/** Fiche publique d'une agence, telle que la voient les clients. */
const AgencyCard = () => (
  <Box
    rounded="2xl"
    borderWidth="1px"
    borderColor="border"
    bg="bg.panel"
    shadow="lg"
    overflow="hidden"
    aria-hidden
  >
    <Box h="88px" bgGradient="to-r" gradientFrom="primary.solid" gradientTo="primary.emphasized" />
    <Stack px={6} pb={6} gap={4} mt="-32px">
      <Circle
        size="16"
        bg="bg.panel"
        borderWidth="3px"
        borderColor="bg.panel"
        shadow="md"
        color="primary.fg"
        fontWeight="extrabold"
        fontSize="lg"
      >
        KI
      </Circle>
      <Stack gap={1}>
        <HStack gap={2} wrap="wrap">
          <BaseText fontSize="xl" fontWeight="bold">
            Keur Immo
          </BaseText>
          <BaseTag
            variant="surface"
            colorPalette="success"
            label={'Agence vérifiée'}
            icon={<Icons.Shield />}
          />
        </HStack>
        <HStack gap={1} color="fg.muted">
          <Icons.MapPin />
          <BaseText variant={TextVariant.S} color="inherit">
            Plateau, Dakar
          </BaseText>
        </HStack>
      </Stack>
      <Grid templateColumns="repeat(3, 1fr)" gap={3}>
        {[
          { value: '24', label: 'biens' },
          { value: '6', label: 'à la nuit' },
          { value: '18', label: 'au mois' },
        ].map((stat) => (
          <Stack key={stat.label} gap={0} p={3} rounded="lg" bg="bg.muted" textAlign="center">
            <BaseText fontWeight="bold">{stat.value}</BaseText>
            <BaseText variant={TextVariant.XS} color="fg.muted">
              {stat.label}
            </BaseText>
          </Stack>
        ))}
      </Grid>
      <Flex gap={2}>
        <Box
          flex={1}
          textAlign="center"
          py={2}
          rounded="md"
          bg="primary.solid"
          color="primary.contrast"
          fontSize="sm"
          fontWeight="semibold"
        >
          Voir les biens
        </Box>
        <Box
          flex={1}
          textAlign="center"
          py={2}
          rounded="md"
          borderWidth="1px"
          borderColor="border"
          fontSize="sm"
          fontWeight="semibold"
        >
          Contacter
        </Box>
      </Flex>
    </Stack>
  </Box>
);

/** Confiance : ce que contrôle Keurezy avant d'accorder le badge. */
export const VerifiedAgency = () => (
  <LandingSection>
    <Grid
      templateColumns={{ base: '1fr', lg: '1.1fr 1fr' }}
      gap={{ base: 10, lg: 16 }}
      alignItems="center"
    >
      <Box>
        <SectionHeading
          align="start"
          eyebrow="Agence vérifiée"
          title="Le badge qui rassure vos clients"
          subtitle="Keurezy contrôle les pièces légales de votre agence. Une fois les pièces validées, le badge apparaît sur la fiche de votre agence."
        />
        <Stack as="ul" gap={4} listStyleType="none" mt={{ base: -4, md: -6 }}>
          {PROOFS.map((proof, index) => (
            <Reveal as="li" key={proof.title} delay={index * 0.1}>
              <HStack gap={4} alignItems="flex-start">
                <BaseIcon boxSize="10" color="warning.solid" flexShrink={0}>
                  <Icons.Paper aria-hidden />
                </BaseIcon>
                <Stack gap={0}>
                  <BaseText fontWeight="semibold">{proof.title}</BaseText>
                  <BaseText variant={TextVariant.S} color="fg.muted">
                    {proof.text}
                  </BaseText>
                </Stack>
              </HStack>
            </Reveal>
          ))}
        </Stack>
      </Box>
      <Reveal maxW="md" width="full" mx="auto">
        <AgencyCard />
      </Reveal>
    </Grid>
  </LandingSection>
);
