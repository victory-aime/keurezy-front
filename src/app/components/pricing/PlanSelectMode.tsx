import { Flex, Button } from '@chakra-ui/react';
import { Icons } from '_components/custom';
import { ENUM } from '_types/*';
import { PlanSelectProps } from './interface/pricing-types';

export const PlanSelectorMode = ({ value, onChange }: PlanSelectProps) => {
  const tabs: { id: ENUM.PricingType; label: string; Icon: typeof Icons.CreditCard }[] = [
    { id: 'COMMISSION', label: 'Commission', Icon: Icons.Wallet },
    { id: 'SUBSCRIPTION', label: 'Abonnement', Icon: Icons.CreditCard },
  ];
  return (
    <Flex
      alignItems={'center'}
      display={'inline-flex'}
      gap={2}
      p={2}
      rounded={'xl'}
      border={'1px'}
      borderColor={'border'}
      shadow={'lg'}
    >
      {tabs.map(({ id, label, Icon }) => (
        <Button
          key={id}
          onClick={() => onChange(id)}
          px={2.5}
          py={2.5}
          variant={value === id ? 'solid' : 'outline'}
          bgColor={value === id ? 'primary.500' : 'outline'}
          color={value === id ? 'white' : 'inherit'}
          aria-pressed={value === id}
        >
          <Icon />
          {label}
        </Button>
      ))}
    </Flex>
  );
};
