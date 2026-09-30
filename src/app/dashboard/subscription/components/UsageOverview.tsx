import { Flex, Progress, Stack, StackSeparator } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BaseText, Icons, TextVariant } from '_components/custom';
import { MODELS } from '_types/*';
import { featureLabel, usageRemainingLabel } from '_utils/subscription';

type Usage = MODELS.IAgencySubscriptionOverview['usage'][number];

/** Couleur de la jauge : sobre par défaut, accent léger près de la limite (jamais rouge). */
const PALETTE: Record<MODELS.SubscriptionUsageState, string> = {
  OK: 'primary',
  NEAR_LIMIT: 'orange',
  REACHED: 'orange',
  UNLIMITED: 'primary',
};

/** Jauge fine animée de 0 à la valeur réelle (~500 ms), immédiate en reduced motion. */
const UsageBar = ({ usage, reduceMotion }: { usage: Usage; reduceMotion: boolean }) => {
  const target = usage.percentage ?? 0;
  const [value, setValue] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (reduceMotion) return setValue(target);
    const frame = requestAnimationFrame(() => setValue(target));
    return () => cancelAnimationFrame(frame);
  }, [target, reduceMotion]);

  return (
    <Progress.Root
      value={value}
      max={100}
      size="xs"
      colorPalette={PALETTE[usage.state]}
      aria-label={`${featureLabel(usage.feature)} : ${target} % utilisés`}
    >
      <Progress.Track rounded="full" bg="bg.muted">
        <Progress.Range
          rounded="full"
          transition={reduceMotion ? 'none' : 'width 500ms ease-out'}
        />
      </Progress.Track>
    </Progress.Root>
  );
};

/** Message sous la jauge, seulement quand la limite approche ou est atteinte. */
const LimitHint = ({ usage }: { usage: Usage }) => {
  if (usage.state === 'NEAR_LIMIT') {
    return (
      <Flex alignItems="center" gap={1.5} color="orange.600">
        <Icons.Warn aria-hidden />
        <BaseText variant={TextVariant.XS} color="inherit">
          Bientôt atteinte : un plan supérieur vous laissera plus de marge.
        </BaseText>
      </Flex>
    );
  }
  if (usage.state === 'REACHED') {
    return (
      <Flex alignItems="center" gap={1.5} color="orange.700">
        <Icons.Lock aria-hidden />
        <BaseText variant={TextVariant.XS} color="inherit">
          Limite atteinte : il n’est plus possible d’en ajouter avec ce plan.
        </BaseText>
      </Flex>
    );
  }
  return null;
};

/** Une ligne de consommation : nom, utilisé / limite, reste, pourcentage et jauge. */
const UsageLimitItem = ({ usage, reduceMotion }: { usage: Usage; reduceMotion: boolean }) => (
  <Stack gap={2} py={3} as="li">
    <Flex justifyContent="space-between" alignItems="baseline" gap={3} wrap="wrap">
      <BaseText variant={TextVariant.M} fontWeight="medium">
        {featureLabel(usage.feature)}
      </BaseText>
      <Flex gap={3} alignItems="baseline">
        <BaseText variant={TextVariant.S}>
          {usage.limit === null
            ? `${usage.used} utilisés`
            : `${usage.used} / ${usage.limit} utilisés`}
        </BaseText>
        <BaseText variant={TextVariant.S} color="fg.muted">
          {usageRemainingLabel(usage)}
        </BaseText>
        {usage.percentage !== null && (
          <BaseText variant={TextVariant.S} fontWeight="medium" minW="3.5ch" textAlign="right">
            {usage.percentage} %
          </BaseText>
        )}
      </Flex>
    </Flex>
    {usage.limit !== null && <UsageBar usage={usage} reduceMotion={reduceMotion} />}
    <LimitHint usage={usage} />
  </Stack>
);

/** « Votre utilisation » : les valeurs et états viennent du backend, rien n'est recalculé ici. */
export const UsageOverview = ({
  usage,
  reduceMotion,
}: {
  usage: Usage[];
  reduceMotion: boolean;
}) => {
  if (usage.length === 0) {
    return (
      <BaseText variant={TextVariant.S} color="fg.muted">
        Aucune limite de consommation sur votre plan.
      </BaseText>
    );
  }
  return (
    <Stack as="ul" gap={0} separator={<StackSeparator />} listStyleType="none">
      {usage.map((item) => (
        <UsageLimitItem key={item.feature} usage={item} reduceMotion={reduceMotion} />
      ))}
    </Stack>
  );
};
