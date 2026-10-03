import { Box, Circle, Flex, HStack, SimpleGrid, Stack, VStack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import Link from 'next/link';
import {
  BaseText,
  FormCheckbox,
  FormPhonePicker,
  FormTextInput,
  Icons,
  TextVariant,
} from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { MotionBox } from '_constants/motion';
import { useAgencyCheck } from '_context/agency-context';
import { MODELS } from '_types/*';
import { DashboardMockup } from './DashboardMockup';
import { DirectLive } from './DirectLive';
import { GridContainer } from './GridContainer';
import { OnboardCardWrapper } from './OnboardCardWrapper';

/** Ce qui se passe après l'inscription : la vérification se prépare sur la page Agence. */
const NEXT_STEPS = [
  { icon: Icons.Rocket, text: 'Votre espace est prêt dès la fin de l’inscription.' },
  {
    icon: Icons.Paper,
    text: 'Sur la page Agence, joignez vos statuts, votre attestation NINEA et votre extrait RCCM.',
  },
  { icon: Icons.Shield, text: 'Keurezy vérifie votre agence : le badge rassure vos clients.' },
];

/**
 * Étape 3 « Agence » : l'essentiel seulement (nom, e-mail, téléphone, adresse) et les conditions.
 * Description et pièces justificatives se complètent ensuite sur la page Agence.
 */
export const StepBusiness = () => {
  const { isCheckingName } = useAgencyCheck();
  const { values } = useFormikContext<{
    account: MODELS.IAuthSignUp;
    business: MODELS.ICreateAgency;
  }>();

  return (
    <GridContainer alignItems="start">
      <VStack gap={6} align="stretch">
        <VStack gap={2} align="flex-start">
          <Flex
            bg="tertiary.subtle"
            color="tertiary.fg"
            borderRadius="full"
            px={3}
            py={1}
            alignItems="center"
            gap={1}
          >
            <Icons.Target size={11} aria-hidden />
            Agence
          </Flex>
          <BaseText as="h2" fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }} fontWeight="bold">
            Parlez-nous de votre agence
          </BaseText>
          <BaseText color="fg.muted">
            L’essentiel pour démarrer : le reste se complète depuis votre tableau de bord.
          </BaseText>
        </VStack>

        <OnboardCardWrapper>
          <Stack gap={5}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <FormTextInput
                required
                name="business.name"
                label="Nom de l’agence"
                placeholder="Keur Immo"
                isVerified={isCheckingName}
              />
              <FormTextInput
                required
                name="business.email"
                label="E-mail de l’agence"
                type="email"
                placeholder="contact@keur-immo.sn"
              />
              <FormPhonePicker
                required
                name="business.phone"
                label="Téléphone"
                listAvailableCountries={['sn']}
              />
              <FormTextInput
                required
                name="business.address"
                label="Adresse"
                placeholder="Rue 10, Dakar"
                leftAccessory={<Icons.MapPin />}
              />
            </SimpleGrid>
            <FormCheckbox
              name="business.acceptTerms"
              label={
                <>
                  J’accepte les{' '}
                  <Link
                    href={APP_ROUTES.TERMS_OF_USE}
                    target="_blank"
                    rel="noopener"
                    style={{ textDecoration: 'underline' }}
                  >
                    conditions générales d’utilisation de Keurezy
                  </Link>
                </>
              }
            />
          </Stack>
        </OnboardCardWrapper>
      </VStack>

      <Box>
        <DirectLive />
        <MotionBox
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <DashboardMockup
            userName={values?.account.name || 'Jean Dupont'}
            company={values?.business.name}
            properties={200}
            rent={3000}
            location="Dakar"
            animated
          />
        </MotionBox>

        {/* Et ensuite ? Les étapes apparaissent l'une après l'autre */}
        <OnboardCardWrapper mt={6} p={5}>
          <Stack gap={3}>
            <BaseText fontWeight="semibold">Et ensuite ?</BaseText>
            {NEXT_STEPS.map(({ icon: Icon, text }, index) => (
              <MotionBox
                key={text}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.15, duration: 0.4 }}
              >
                <HStack alignItems="flex-start" gap={3}>
                  <Circle size="8" flexShrink={0} bg="primary.subtle" color="primary.fg">
                    <Icon aria-hidden />
                  </Circle>
                  <BaseText variant={TextVariant.S} color="fg.muted" pt={1}>
                    {text}
                  </BaseText>
                </HStack>
              </MotionBox>
            ))}
          </Stack>
        </OnboardCardWrapper>
      </Box>
    </GridContainer>
  );
};
