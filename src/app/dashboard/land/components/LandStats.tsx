import { Flex, SimpleGrid } from "@chakra-ui/react";
import { BaseStats, Icons } from "_components/custom";
import { MODELS, ENUM } from "_types/*";

export const LandStatsCard = ({
  lands,
  isLoading,
}: {
  lands: MODELS.ILandDto[];
  isLoading?: boolean;
}) => {
  const values = lands?.reduce(
    (acc, p) => {
      if (p.status === ENUM.COMMON.Status.SOLD) {
        acc.count += 1;
      }
      return acc;
    },
    { count: 0 },
  );

  const stats = [
    {
      label: "Total",
      value: lands?.length,
      color: "primary.500",
      icon: <Icons.Map />,
    },
    {
      label: "Disponibles",
      value: lands?.filter((p) => p.status === ENUM.COMMON.Status.AVAILABLE)
        .length,
      color: "tertiary.500",
      icon: <Icons.Check />,
    },
    {
      label: "Vente en cours",
      value: lands?.filter(
        (p) => p.status === ENUM.COMMON.Status.CURRENTLY_ON_SALE,
      ).length,
      color: "blue.500",
      icon: <Icons.Bell />,
    },
    {
      label: "Vendu",
      value: values?.count,
      color: "orange.500",
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
            currency={ENUM.COMMON.Currency.XOF}
            isLoading={isLoading}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
