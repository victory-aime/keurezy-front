'use client';

import { SimpleGrid, VStack } from '@chakra-ui/react';
import { StatsModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import { StatsChart } from './components/BarChart';
import LineChart from './components/LineChart';
import { DonutDataItem } from './components/DonutChart';
import { BaseContainer, BaseStats, Icons } from '_components/custom';

export function StatsList() {
  const { user } = useUserContext();
  const { data, isLoading } = StatsModule.getAgencyStats({
    params: { agencyId: user?.agencyId ?? '' },
    queryOptions: { enabled: !!user?.agencyId },
  });

  const stats = [
    {
      label: 'Biens',
      value: data?.properties?.total ?? 0,
      description: 'Total des biens',
      color: 'green.600',
      icon: <Icons.RiBuildingLine />,
    },
    {
      label: 'personne intéressées',
      value: data?.leads?.total ?? 0,
      description: 'Nouveaux prospects',
      color: 'blue.600',
      icon: <Icons.FaUsers />,
    },
    {
      label: 'Visites',
      value: data?.visits?.total ?? 0,
      description: 'Visites planifiées',
      color: 'purple.600',
      icon: <Icons.Calendar />,
    },
    {
      label: 'Tickets',
      value: data?.tickets?.total ?? 0,
      description: 'Demandes en cours',
      color: 'red.600',
      icon: <Icons.Ticket />,
    },
  ];

  const donutData: DonutDataItem[] = [
    { name: 'Ouverts', value: data?.tickets?.open ?? 0, color: '#E53E3E' },
    { name: 'En cours', value: data?.tickets?.inProgress ?? 0, color: '#3182CE' },
    { name: 'Résolus', value: data?.tickets?.resolved ?? 0, color: '#38A169' },
  ];

  const lineChartData = [
    { category: 'Biens', value: data?.properties?.total ?? 0 },
    { category: 'Leads', value: data?.leads?.total ?? 0 },
    { category: 'Visites', value: data?.visits?.total ?? 0 },
    { category: 'Tickets', value: data?.tickets?.total ?? 0 },
  ];

  const chartData = [
    {
      type: 'Biens',
      allocation: data?.properties?.total || 0,
    },
    {
      type: 'Leads',
      allocation: data?.leads?.total || 0,
    },
    {
      type: 'Visites',
      allocation: data?.visits?.total || 0,
    },
  ];

  return (
    <BaseContainer
      title="Statistiques de l'agence"
      description="Vue d'ensemble des indicateurs clés de performance de votre agence immobilière"
      border={'none'}
      loader={isLoading}
      numberOfLines={2}
    >
      <SimpleGrid width={'full'} columns={{ base: 1, sm: 4 }} gap={4} mt={10}>
        {stats.map((kpi) => (
          <BaseStats
            key={kpi.label}
            title={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            iconBgColor={kpi.color}
            isLoading={isLoading}
          />
        ))}
      </SimpleGrid>
      <VStack gap={8} alignItems={'flex-start'} width={'full'}>
        <StatsChart data={chartData} />
        <LineChart
          title="Évolution des indicateurs"
          data={lineChartData}
          xKey="category"
          series={[{ name: 'value', label: 'Total', color: 'blue.solid' }]}
        />
      </VStack>
    </BaseContainer>
  );
}
