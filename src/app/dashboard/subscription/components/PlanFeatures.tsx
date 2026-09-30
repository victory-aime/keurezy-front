import { Flex, SimpleGrid, Stack } from '@chakra-ui/react';
import { BaseText, Icons, TextVariant } from '_components/custom';
import { MODELS } from '_types/*';
import { featureLabel, formatFeatureLimit } from '_utils/subscription';

type Feature = MODELS.IAgencySubscriptionOverview['features'][number];

/** Une fonctionnalité : incluse (coche) ou proposée par un autre plan (cadenas, atténuée). */
const FeatureItem = ({ feature }: { feature: Feature }) => {
  const detail = feature.included
    ? formatFeatureLimit(feature.name, feature.limit) || feature.description
    : 'Disponible avec un autre plan';

  return (
    <Flex as="li" gap={3} alignItems="flex-start" opacity={feature.included ? 1 : 0.7}>
      <Flex
        mt={0.5}
        boxSize={6}
        flexShrink={0}
        alignItems="center"
        justifyContent="center"
        rounded="full"
        bg={feature.included ? 'tertiary.50' : 'bg.muted'}
        color={feature.included ? 'tertiary.600' : 'fg.muted'}
        aria-hidden
      >
        {feature.included ? <Icons.Check size={18} /> : <Icons.Lock size={12} />}
      </Flex>
      <Stack gap={0}>
        <BaseText variant={TextVariant.M} fontWeight="medium">
          {featureLabel(feature.name)}
          <Flex as="span" srOnly>
            {feature.included ? ' (incluse)' : ' (non incluse)'}
          </Flex>
        </BaseText>
        {detail && (
          <BaseText variant={TextVariant.S} color="fg.muted">
            {detail}
          </BaseText>
        )}
      </Stack>
    </Flex>
  );
};

/** « Fonctionnalités de votre plan » : incluses d'abord, puis celles des autres plans. */
export const PlanFeatures = ({ features }: { features: Feature[] }) => {
  const sorted = [...features].sort((a, b) => Number(b.included) - Number(a.included));
  return (
    <SimpleGrid as="ul" columns={{ base: 1, md: 2 }} gap={4} listStyleType="none">
      {sorted.map((feature) => (
        <FeatureItem key={feature.name} feature={feature} />
      ))}
    </SimpleGrid>
  );
};
