import { Flex, SimpleGrid } from '@chakra-ui/react';
import { BaseStats, Icons } from '_components/custom';
import { MODELS, ENUM } from '_types/*';
import { useMemo } from 'react';

export const LeadsStatsCard = ({
  agencyLeadsList,
  isLoading,
}: {
  agencyLeadsList: MODELS.ILeadsAgency[];
  isLoading?: boolean;
}) => {
  const { allAgencyLeads, pendingAgencyLeads, rejectedAgencyLeads, acceptedAgencyLeads } =
    useMemo(() => {
      return {
        allAgencyLeads: agencyLeadsList?.length,
        pendingAgencyLeads: agencyLeadsList?.filter((p) => p.status === ENUM.COMMON.Status.PENDING)
          .length,
        acceptedAgencyLeads: agencyLeadsList?.filter(
          (p) => p.status === ENUM.COMMON.Status.ACCEPTED,
        ).length,
        rejectedAgencyLeads: agencyLeadsList?.filter(
          (p) => p.status === ENUM.COMMON.Status.REJECTED,
        ).length,
      };
    }, [agencyLeadsList]);

  const stats = [
    {
      label: 'Total',
      value: allAgencyLeads,
      icon: <Icons.Clipboard />,
      iconBgColor: 'primary.500',
    },
    {
      label: 'En attente',
      value: pendingAgencyLeads,
      icon: <Icons.Timer />,
      iconBgColor: 'warning.500',
    },
    {
      label: 'Acceptées',
      value: acceptedAgencyLeads,
      icon: <Icons.Check />,
      iconBgColor: 'tertiary.500',
    },
    {
      label: 'Rejetées',
      value: rejectedAgencyLeads,
      icon: <Icons.Close />,
      iconBgColor: 'red.500',
    },
  ];
  return (
    <Flex width={'full'} gap={4}>
      <SimpleGrid width={'full'} mt={'40px'} columns={{ base: 1, sm: 4 }} gap={4}>
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
