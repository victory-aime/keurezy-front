import { Flex, SimpleGrid } from "@chakra-ui/react";
import { BaseStats, Icons } from "_components/custom";
import { MODELS, ENUM } from "_types/*";

export const AppartStatsCard = ({
  properties,
  isLoading,
}: {
  properties: MODELS.IProperty[];
  isLoading?: boolean;
}) => {
  const values = properties?.reduce(
    (acc, p) => {
      if (p.status !== ENUM.COMMON.Status.AVAILABLE) {
        acc.count += 1;
        acc.revenue += Number(p.price ?? 0);
      }
      return acc;
    },
    { count: 0, revenue: 0 },
  );

  const stats = [
    {
      label: "Total",
      value: properties?.length,
      color: "primary.500",
      icon: <Icons.RiBuildingLine />,
    },
    {
      label: "Disponibles",
      value: properties?.filter(
        (p) => p.status === ENUM.COMMON.Status.AVAILABLE,
      ).length,
      color: "tertiary.500",
      icon: <Icons.Check />,
    },
    {
      label: "Occupés",
      value: values?.count,
      color: "danger.500",
      icon: <Icons.Close />,
    },
    {
      label: "Revenu mensuel",
      value: values?.revenue,
      color: "secondary.500",
      isAmount: true,
      icon: <Icons.Payment />,
    },
  ];
  return (
    <Flex width={"full"} gap={4}>
      <SimpleGrid
        width={"full"}
        mt={"40px"}
        columns={{ base: 1, sm: 4 }}
        gap={4}
      >
        {stats.map((s, i) => (
          <BaseStats
            key={i}
            icon={s.icon}
            iconBgColor={s.color}
            title={s.label}
            value={s.value || 0}
            isNumber={s.isAmount}
            currency={ENUM.COMMON.Currency.XOF}
            isLoading={isLoading}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
