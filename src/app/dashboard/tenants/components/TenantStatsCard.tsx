import { Flex, SimpleGrid } from "@chakra-ui/react";
import { BaseStats, Icons } from "_components/custom";
import { MODELS, ENUM } from "_types/*";

export const TenantStatsCard = ({
  rentalAgreementList,
  isLoading,
}: {
  rentalAgreementList: MODELS.IRentalAgencyListResponse[];
  isLoading?: boolean;
}) => {
  const stats = [
    {
      label: "Total locataires",
      value: rentalAgreementList?.length,
      color: "primary.500",
    },
    {
      label: "Actifs",
      value: rentalAgreementList?.filter(
        (p) => p.status === ENUM.COMMON.Status.ACTIVE,
      ).length,
      color: "tertiary.500",
    },
    {
      label: "En retard",
      value: rentalAgreementList?.filter(
        (p) => p.status !== ENUM.COMMON.Status.ACTIVE,
      ).length,
      color: "danger.500",
    },
  ];
  return (
    <Flex width={"full"} gap={4}>
      <SimpleGrid
        width={"full"}
        mt={"40px"}
        columns={{ base: 1, sm: 3 }}
        gap={4}
      >
        {stats.map((s, i) => (
          <BaseStats
            key={i}
            icon={<Icons.Bath />}
            iconBgColor={s.color}
            title={s.label}
            value={s.value || 0}
            isLoading={isLoading}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
