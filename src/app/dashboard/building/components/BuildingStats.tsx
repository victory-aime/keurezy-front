import { Flex, SimpleGrid } from '@chakra-ui/react';
import { BaseStats, Icons } from '_components/custom';
import { MODELS, ENUM } from '_types/*';

export const BuildingStatsCard = ({
  buildings,
  isLoading,
}: {
  buildings: MODELS.IBuilding[];
  isLoading?: boolean;
}) => {
  const values = buildings?.reduce(
    (acc, p) => {
      if (p.status === ENUM.COMMON.Status.UNAVAILABLE) {
        acc.count += 1;
      }
      return acc;
    },
    { count: 0 },
  );

  const stats = [
    {
      label: 'Total',
      value: buildings?.length,
      color: 'primary.500',
      icon: <Icons.RiBuildingLine />,
    },
    {
      label: 'Disponibles',
      value: buildings?.filter((p) => p.status === ENUM.COMMON.Status.AVAILABLE).length,
      color: 'tertiary.500',
      icon: <Icons.Check />,
    },
    {
      label: 'Indisponible',
      value: values?.count,
      color: 'orange.500',
      icon: <Icons.Close />,
    },
  ];
  return (
    <Flex width={'full'} gap={4}>
      <SimpleGrid width={'full'} mt={'40px'} columns={{ base: 1, sm: 3 }} gap={4}>
        {stats.map((s, i) => (
          <BaseStats
            key={i}
            icon={s.icon}
            iconBgColor={s.color}
            title={s.label}
            value={s.value || 0}
            currency={ENUM.COMMON.Currency.XOF}
            isLoading={isLoading}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
