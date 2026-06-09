import { Badge, Box, Flex, Float, For, List, Span } from '@chakra-ui/react';
import {
  BaseBadge,
  BaseText,
  TextVariant,
  TextWeight,
  BaseFormatNumber,
  BaseButton,
  Icons,
} from '_components/custom';
import { MotionBox } from '_constants/motion';
import { ENUM } from '_types/*';
import { PlanCardProps } from './interface/pricing-types';
import { formatLimit, getCommercialFeatures, getPricing } from './functions/pricing';
import { t } from 'i18next';

export const PlanCard = ({
  plan,
  billingCycle,
  index,
  onSelect,
  isSelected = false,
}: PlanCardProps) => {
  const isSubscription = plan.pricingType === 'SUBSCRIPTION';

  const pricing = isSubscription ? getPricing(plan, billingCycle) : undefined;

  // Subscription plan with no valid pricing → don't render
  if (isSubscription && !pricing) return null;

  const yearlyPricing = plan.pricings?.find((p) => p.billingCycle === 'YEARLY');
  const yearlySavings = yearlyPricing?.discountPercentage ?? null;

  return (
    <MotionBox
      key={plan.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      border={'1px solid'}
      p={8}
      position={'relative'}
      rounded={'xl'}
      borderColor={plan.popular ? 'primary.500' : 'bg.muted'}
      shadow={plan.popular ? '2xl' : 'xs'}
      scale={plan.popular ? '1.1' : 'none'}
      textAlign={'center'}
      width={'full'}
    >
      {isSelected && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Vous avez sélectionné ce plan
        </Badge>
      )}

      {!isSelected && plan.popular && (
        <Float placement={'top-center'}>
          <BaseBadge label="Populaire" borderRadius={'full'} />
        </Float>
      )}
      <BaseText variant={TextVariant.L} weight={TextWeight.SemiBold}>
        {t(`SUBSCRIPTION.PLANS.${plan.name}`)}
      </BaseText>

      {/*<BaseText variant={TextVariant.S}>*/}
      {/*  {t(`SUBSCRIPTION.DESCRIPTIONS.${plan.name}`)}*/}
      {/*</BaseText>*/}

      <Box mt={2} mb={3}>
        {plan.pricingType === 'COMMISSION' ? (
          <Box>
            <Span fontSize={'xl'} fontWeight={'bold'}>
              <BaseFormatNumber
                value={(plan.commissionRate && plan.commissionRate / 100) ?? 0}
                style="percent"
              />
            </Span>
            <Span fontSize={'sm'} ml={1}>
              par acquisition
            </Span>
          </Box>
        ) : pricing ? (
          <Flex alignItems={'baseline'} gap={1}>
            <Span fontSize={'xl'} fontWeight={'bold'}>
              <BaseFormatNumber
                value={pricing.price}
                currencyCode={pricing.currency as ENUM.COMMON.Currency}
              />
            </Span>
            <Span fontSize={'sm'}>{billingCycle === 'YEARLY' ? '/an' : '/mois'}</Span>

            {billingCycle === 'YEARLY' && yearlySavings ? (
              <Badge variant="solid" colorPalette={'teal'}>
                Économie -{yearlySavings}%
              </Badge>
            ) : null}
          </Flex>
        ) : null}
      </Box>

      <BaseButton
        width={'full'}
        variant={plan.popular ? 'solid' : 'outline'}
        colorType={plan.popular ? 'primary' : 'neutral'}
        onClick={() =>
          onSelect({
            planId: plan.id,
            billingCycle: isSubscription ? billingCycle : undefined,
          })
        }
      >
        <BaseText color={plan.popular ? 'inherit' : 'none'}>Choisir ce plan</BaseText>
      </BaseButton>

      <For each={getCommercialFeatures(plan)}>
        {(features, index) => (
          <List.Root key={index} gap="2" variant="plain" align="start" mt={4} spaceY={1}>
            <List.Item key={features.label} alignItems={'flex-start'} gap={0} fontSize={'sm'}>
              <List.Indicator asChild color="tertiary.500">
                <Icons.Check size={20} />
              </List.Indicator>
              {formatLimit(features)}
            </List.Item>
          </List.Root>
        )}
      </For>
    </MotionBox>
  );
};
