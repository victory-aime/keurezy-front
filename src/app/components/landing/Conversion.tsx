import { Box, Circle, Flex, HStack, SimpleGrid, Skeleton, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BaseAccordion,
  BaseButton,
  BaseText,
  CustomSkeletonLoader,
  Icons,
  TextVariant,
  BaseIcon,
} from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { CommonModule } from '_store/state-management';
import { ENUM } from '_types/*';
import { PlanChooser } from '../../dashboard/subscription/components/PlanChooser';
import { getFilteredPlans } from '../pricing/functions/pricing';
import { ANCHORS, FAQ, STEPS } from './content';
import { LandingSection, Reveal, SectionHeading } from './Section';

/** Les trois vraies étapes de l'inscription. */
export const Steps = () => (
  <LandingSection muted>
    <SectionHeading
      eyebrow="Comment ça marche"
      title="Votre agence en ligne en quelques minutes"
      subtitle="Trois étapes, sans document à fournir pour commencer."
    />
    <SimpleGrid
      as="ol"
      listStyleType="none"
      columns={{ base: 1, md: 3 }}
      gap={{ base: 4, md: 6 }}
      position="relative"
    >
      {STEPS.map(({ icon: Icon, title, description }, index) => (
        <Reveal as="li" key={title} delay={index * 0.12} height="full">
          <Stack
            height="full"
            gap={4}
            p={6}
            rounded="2xl"
            bg="bg"
            borderWidth="1px"
            borderColor="border"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <BaseIcon boxSize="12" color="primary.solid">
                <Icon size={20} aria-hidden />
              </BaseIcon>
              <BaseText
                fontSize="3xl"
                fontWeight="extrabold"
                color="border.emphasized"
                lineHeight="1"
                aria-hidden
              >
                0{index + 1}
              </BaseText>
            </Flex>
            <Stack gap={1}>
              <BaseText as="h3" fontSize="lg" fontWeight="bold">
                {title}
              </BaseText>
              <BaseText variant={TextVariant.S} color="fg.muted">
                {description}
              </BaseText>
            </Stack>
          </Stack>
        </Reveal>
      ))}
    </SimpleGrid>
  </LandingSection>
);

/** Tarifs : le même sélecteur que l'inscription et le tableau de bord. */
export const Pricing = () => {
  const router = useRouter();
  const [cycle, setCycle] = useState<ENUM.BillingCycle>('MONTHLY');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: allPacks, isError } = CommonModule.getAllPacksQueries({});
  const plans = getFilteredPlans(allPacks) ?? [];

  return (
    <LandingSection id={ANCHORS.pricing}>
      <SectionHeading
        eyebrow="Tarifs"
        title="Commencez gratuitement, évoluez quand vous voulez"
        subtitle="Prix en francs CFA, sans engagement. Changez de plan à tout moment depuis votre tableau de bord."
      />
      <Box maxW="7xl" mx="auto">
        {isError ? (
          <Stack alignItems="center" gap={3} py={10}>
            <BaseText color="fg.muted">Les offres n’ont pas pu être chargées.</BaseText>
            <Link href={APP_ROUTES.AUTH.ONBOARD}>
              <BaseButton variant="outline">Voir les offres à l’inscription</BaseButton>
            </Link>
          </Stack>
        ) : !plans.length ? (
          <CustomSkeletonLoader type="PRODUCT_LIST_CARD" width={'full'} height={'400px'} />
        ) : (
          <PlanChooser
            plans={plans}
            billingCycle={cycle}
            onCycleChange={setCycle}
            selectedPlanId={selectedId}
            onSelect={setSelectedId}
          />
        )}
        {/* Le choix n'emmène pas tout de suite : les flèches du clavier changent la sélection */}
        {plans.length > 0 && (
          <Flex justifyContent="center" mt={8}>
            <BaseButton
              size="lg"
              disabled={!selectedId}
              rightIcon={<Icons.ArrowRight aria-hidden />}
              onClick={() =>
                selectedId &&
                router.push(`${APP_ROUTES.AUTH.ONBOARD}?planId=${selectedId}&billingCycle=${cycle}`)
              }
            >
              {selectedId ? 'Commencer avec ce plan' : 'Choisissez un plan'}
            </BaseButton>
          </Flex>
        )}
        <Flex justifyContent="center" alignItems="center" gap={2} mt={6} color="fg.muted">
          <Icons.Ticket aria-hidden />
          <BaseText variant={TextVariant.S} color="inherit">
            Un code promo ? Vous le saisirez à l’inscription, au moment de choisir votre plan.
          </BaseText>
        </Flex>
      </Box>
    </LandingSection>
  );
};

export const Faq = () => (
  <LandingSection id={ANCHORS.faq} muted>
    <SectionHeading eyebrow="FAQ" title="Les questions qu’on nous pose" />
    <Box maxW="3xl" mx="auto">
      <BaseAccordion
        items={FAQ.map(({ question, answer }) => ({
          label: question,
          content: (
            <BaseText color="fg.muted" px={3} pb={2}>
              {answer}
            </BaseText>
          ),
        }))}
      />
    </Box>
  </LandingSection>
);

export const FinalCta = () => (
  <LandingSection>
    <Reveal>
      <Stack
        alignItems="center"
        textAlign="center"
        gap={5}
        px={{ base: 6, md: 12 }}
        py={{ base: 12, md: 16 }}
        rounded="3xl"
        bg="primary.solid"
        color="primary.contrast"
      >
        <BaseText
          as="h2"
          fontSize={{ base: '2xl', md: '4xl' }}
          fontWeight="bold"
          color="inherit"
          maxW="2xl"
          lineHeight="1.15"
        >
          Lancez votre agence sur Keurezy aujourd’hui
        </BaseText>
        <BaseText fontSize={{ base: 'md', md: 'lg' }} color="inherit" opacity={0.9} maxW="xl">
          Gratuit pour commencer, sans engagement. Votre espace est prêt en quelques minutes.
        </BaseText>
        <Link href={APP_ROUTES.AUTH.ONBOARD}>
          <BaseButton size="lg" colorType="secondary" rightIcon={<Icons.ArrowRight aria-hidden />}>
            Créer mon agence gratuitement
          </BaseButton>
        </Link>
      </Stack>
    </Reveal>
  </LandingSection>
);
