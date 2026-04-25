import { Flex, Button, Badge } from '@chakra-ui/react';
import { BillingCycleToggleProps } from './interface/pricing-types';
import { BaseFormatNumber } from '_components/custom';

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
      <Button
        onClick={() => onChange('MONTHLY')}
        rounded={'full'}
        variant={value === 'MONTHLY' ? 'solid' : 'outline'}
        bgColor={value === 'MONTHLY' ? 'primary.500' : 'inherit'}
        color={value === 'MONTHLY' ? 'white' : 'inherit'}
        borderColor={value === 'MONTHLY' ? 'primary.500' : 'none'}
        border={value === 'MONTHLY' ? 'inherit' : 'none'}
      >
        Mensuel
      </Button>

      <Button
        onClick={() => onChange('YEARLY')}
        px={2.5}
        py={2.5}
        variant={value === 'YEARLY' ? 'solid' : 'outline'}
        bgColor={value === 'YEARLY' ? 'primary.500' : 'inherit'}
        color={value === 'YEARLY' ? 'white' : 'inherit'}
        borderColor={value === 'YEARLY' ? 'primary.500' : 'none'}
        border={value === 'YEARLY' ? 'inherit' : 'none'}
        rounded={'full'}
      >
        Annuel
        {yearlySavings ? (
          <Badge colorPalette={'teal'}>
            -<BaseFormatNumber value={yearlySavings / 100} style="percent" />
          </Badge>
        ) : null}
      </Button>
    </Flex>
  );
};
