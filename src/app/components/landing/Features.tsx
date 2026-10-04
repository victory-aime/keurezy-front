import { Box, Circle, Flex, Grid, HStack, Stack, Tabs } from '@chakra-ui/react';
import { BaseAccordion, BaseTag, BaseText, Icons, TextVariant } from '_components/custom';
import { ANCHORS, FEATURES, type Feature } from './content';
import { LandingSection, SectionHeading } from './Section';

const initials = (name: string) =>
  name
    .split(/[\s·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

/** Petite fenêtre qui imite l'écran correspondant du tableau de bord. */
const FeaturePreview = ({ preview }: { preview: Feature['preview'] }) => (
  <Box
    rounded="xl"
    borderWidth="1px"
    borderColor="border"
    bg="bg.panel"
    shadow="md"
    overflow="hidden"
    aria-hidden
  >
    <Flex
      px={4}
      py={3}
      borderBottomWidth="1px"
      borderColor="border"
      justifyContent="space-between"
      alignItems="center"
    >
      <BaseText variant={TextVariant.S} fontWeight="semibold">
        {preview.title}
      </BaseText>
      <HStack gap={1}>
        <Box boxSize="2" rounded="full" bg="border.emphasized" />
        <Box boxSize="2" rounded="full" bg="border.emphasized" />
        <Box boxSize="2" rounded="full" bg="border.emphasized" />
      </HStack>
    </Flex>
    <Stack gap={0}>
      {preview.rows.map((row, index) => (
        <Flex
          key={row.title}
          px={4}
          py={3}
          gap={3}
          alignItems="center"
          borderTopWidth={index ? '1px' : 0}
          borderColor="border"
          animationName="fade-in"
          animationDuration="moderate"
          animationDelay={`${index * 90}ms`}
          animationFillMode="backwards"
          _motionReduce={{ animation: 'none' }}
        >
          <Circle
            size="8"
            bg="primary.subtle"
            color="primary.fg"
            fontSize="xs"
            fontWeight="bold"
            flexShrink={0}
          >
            {initials(row.title)}
          </Circle>
          <Stack gap={0} flex={1} minW={0}>
            <BaseText variant={TextVariant.S} fontWeight="medium" truncate>
              {row.title}
            </BaseText>
            <BaseText variant={TextVariant.XS} color="fg.muted" truncate>
              {row.meta}
            </BaseText>
          </Stack>
          {row.tag && (
            <BaseTag variant="surface" colorPalette={row.tag.color} label={row.tag.label} />
          )}
        </Flex>
      ))}
    </Stack>
  </Box>
);

const FeaturePanel = ({ feature }: { feature: Feature }) => (
  <Grid
    templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
    gap={{ base: 6, lg: 10 }}
    alignItems="center"
    pt={{ md: 2 }}
  >
    <Stack gap={4}>
      <BaseText as="h3" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
        {feature.title}
      </BaseText>
      <BaseText color="fg.muted">{feature.description}</BaseText>
      <Stack as="ul" gap={2} listStyleType="none">
        {feature.bullets.map((bullet) => (
          <HStack as="li" key={bullet} gap={2} alignItems="flex-start">
            <Box color="success.fg" pt={0.5} aria-hidden>
              <Icons.DoubleCheck />
            </Box>
            <BaseText variant={TextVariant.S}>{bullet}</BaseText>
          </HStack>
        ))}
      </Stack>
    </Stack>
    <FeaturePreview preview={feature.preview} />
  </Grid>
);

/**
 * Onglets verticaux de la page d'accueil. `BaseTabs` n'est pas utilisable ici : son conteneur lit
 * le thème de l'agence connectée, absent d'une page publique.
 */
const FeatureTabs = () => (
  <Tabs.Root
    defaultValue={FEATURES[0].label}
    orientation="vertical"
    variant="plain"
    lazyMount
    display="grid"
    gridTemplateColumns="260px minmax(0, 1fr)"
    gap={10}
    alignItems="start"
  >
    <Tabs.List gap={1} position="sticky" top="96px">
      {FEATURES.map((feature) => (
        <Tabs.Trigger
          key={feature.label}
          value={feature.label}
          justifyContent="flex-start"
          gap={3}
          px={4}
          py={3}
          height="auto"
          rounded="lg"
          color="fg.muted"
          fontWeight="medium"
          borderWidth="1px"
          borderColor="transparent"
          transition="all 0.2s"
          _hover={{ bg: 'bg.subtle', color: 'fg' }}
          _selected={{ bg: 'primary.subtle', color: 'primary.fg', borderColor: 'primary.muted' }}
        >
          <feature.icon size={18} aria-hidden />
          {feature.label}
        </Tabs.Trigger>
      ))}
    </Tabs.List>
    {FEATURES.map((feature) => (
      <Tabs.Content
        key={feature.label}
        value={feature.label}
        p={0}
        _open={{ animationName: 'fade-in', animationDuration: 'moderate' }}
        _motionReduce={{ animation: 'none' }}
      >
        <FeaturePanel feature={feature} />
      </Tabs.Content>
    ))}
  </Tabs.Root>
);

/** Fonctionnalités par onglets (verticaux sur grand écran, accordéon sur mobile). */
export const Features = () => (
  <LandingSection id={ANCHORS.features}>
    <SectionHeading
      eyebrow="Fonctionnalités"
      title="Tout ce que fait votre agence, au même endroit"
      subtitle="Cinq espaces reliés entre eux, dans un seul tableau de bord, sur ordinateur comme sur mobile."
    />
    <Box display={{ base: 'none', md: 'block' }}>
      <FeatureTabs />
    </Box>
    <Box display={{ base: 'block', md: 'none' }}>
      <BaseAccordion
        items={FEATURES.map((feature) => ({
          label: feature.label,
          icon: <feature.icon aria-hidden />,
          content: <FeaturePanel feature={feature} />,
        }))}
      />
    </Box>
  </LandingSection>
);
