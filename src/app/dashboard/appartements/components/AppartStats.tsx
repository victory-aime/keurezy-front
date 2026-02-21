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
  const stats = [
    {
      label: "Total",
      value: properties?.length,
      color: "primary.500",
    },
    {
      label: "Disponibles",
      value: properties?.filter(
        (p) => p.status === ENUM.COMMON.Status.AVAILABLE,
      ).length,
      color: "tertiary.500",
    },
    {
      label: "Occupés",
      value: properties?.filter(
        (p) => p.status !== ENUM.COMMON.Status.AVAILABLE,
      ).length,
      color: "danger.500",
    },
    {
      label: "Revenu mensuel",
      value: properties?.reduce((s, p) => s + (p?.price ?? 0), 0),
      color: "secondary.500",
      isAmount: true,
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
            icon={<Icons.Bath />}
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
