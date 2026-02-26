import { Flex, SimpleGrid } from "@chakra-ui/react";
import { BaseStats, Icons } from "_components/custom";
import { MODELS, ENUM } from "_types/*";

export const RentalStatsCard = ({
  rentalList,
  isLoading,
}: {
  rentalList: any[];
  isLoading?: boolean;
}) => {
  const stats = [
    {
      label: "Total",
      value: rentalList?.length,
      icon: <Icons.Clipboard />,
      iconBgColor: "primary.500",
    },
    {
      label: "En attente",
      value: rentalList?.filter((p) => p.status === ENUM.COMMON.Status.PENDING)
        .length,
      icon: <Icons.Timer />,
      iconBgColor: "warning.500",
    },
    {
      label: "Acceptées",
      value: rentalList?.filter((p) => p.status === ENUM.COMMON.Status.ACCEPTED)
        .length,
      icon: <Icons.Check />,
      iconBgColor: "tertiary.500",
    },
    {
      label: "Rejetées",
      value: rentalList?.filter((p) => p.status === ENUM.COMMON.Status.REJECTED)
        .length,
      icon: <Icons.Close />,
      iconBgColor: "red.500",
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
            iconBgColor={s.iconBgColor}
            title={s.label}
            value={s.value || 0}
            isLoading={isLoading}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
