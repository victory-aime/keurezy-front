import { Flex } from '@chakra-ui/react';
import { BillingCycleToggleProps } from './interface/pricing-types';
import { BaseBadge, BaseButton, BaseFormatNumber } from '_components/custom';

export const BillingCycleToggle = ({ value, onChange, yearlySavings }: BillingCycleToggleProps) => {
  return (
    <Flex
      display={'inline-flex'}
      alignItems={'center'}
      gap={2}
      p={2}
      rounded={'full'}
      border={'1px'}
      borderColor={'border'}
      bgColor={'bg.muted'}
      mt={4}
    >
      <BaseButton
        size="sm"
        rounded="full"
        colorType={value === 'MONTHLY' ? 'primary' : 'neutral'}
        variant={value === 'MONTHLY' ? 'solid' : 'ghost'}
        aria-pressed={value === 'MONTHLY'}
        onClick={() => onChange('MONTHLY')}
      >
        Mensuel
      </BaseButton>
      <BaseButton
        size="sm"
        rounded="full"
        colorType={value === 'YEARLY' ? 'primary' : 'neutral'}
        variant={value === 'YEARLY' ? 'solid' : 'ghost'}
        aria-pressed={value === 'YEARLY'}
        onClick={() => onChange('YEARLY')}
      >
        Annuel
        {yearlySavings ? (
          <BaseBadge color="success" variant="solid" size="sm" p={1}>
            -<BaseFormatNumber value={yearlySavings / 100} style="percent" />
          </BaseBadge>
        ) : null}
      </BaseButton>
    </Flex>
  );
};
