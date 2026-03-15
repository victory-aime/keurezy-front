import { Flex, SimpleGrid } from "@chakra-ui/react";
import { BaseStats, Icons } from "_components/custom";
import { MODELS, ENUM } from "_types/*";
import { useMemo } from "react";

export const ApplicationStatsCard = ({
  agencyApplicationList,
  isLoading,
}: {
  agencyApplicationList: MODELS.IApplicationAgencyListResponse;
  isLoading?: boolean;
}) => {
  const {
    allAgencyApplication,
    pendingAgencyApplication,
    rejectedAgencyApplication,
    acceptedAgencyApplication,
  } = useMemo(() => {
    return {
      allAgencyApplication: agencyApplicationList?.totalItems,
      pendingAgencyApplication: agencyApplicationList?.content?.filter(
        (p) => p.status === ENUM.COMMON.Status.PENDING,
      ).length,
      acceptedAgencyApplication: agencyApplicationList?.content?.filter(
        (p) => p.status === ENUM.COMMON.Status.ACCEPTED,
      ).length,
      rejectedAgencyApplication: agencyApplicationList?.content?.filter(
        (p) => p.status === ENUM.COMMON.Status.REJECTED,
      ).length,
    };
  }, [agencyApplicationList]);

  const stats = [
    {
      label: "Total",
      value: allAgencyApplication,
      icon: <Icons.Clipboard />,
      iconBgColor: "primary.500",
    },
    {
      label: "En attente",
      value: pendingAgencyApplication,
      icon: <Icons.Timer />,
      iconBgColor: "warning.500",
    },
    {
      label: "Acceptées",
      value: acceptedAgencyApplication,
      icon: <Icons.Check />,
      iconBgColor: "tertiary.500",
    },
    {
      label: "Rejetées",
      value: rejectedAgencyApplication,
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
