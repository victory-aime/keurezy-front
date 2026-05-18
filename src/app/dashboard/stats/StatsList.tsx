'use client';

import { Box, SimpleGrid, Stack, Text, Spinner } from '@chakra-ui/react';
import { StatsModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import DonutChart, { DonutDataItem } from './components/DonutChart';
import KpiCard from './components/KpiCard';
import DateRangePicker from './components/DateRangePicker';
import { BaseContainer, BaseStats, Icons } from '_components/custom';
import { useState } from 'react';

export function StatsList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
  const kpis = [ 
    {
      title: 'Biens',
      value: data?.properties?.total ?? 0,
      description: 'Total des biens',
      color: 'green.600',
    },
    {
      title: 'personne intéressées',
      value: data?.leads?.total ?? 0,
      description: 'Nouveaux prospects',
      color: 'blue.600',
    },
    {
      title: 'Visites',
      value: data?.visits?.total ?? 0,
      description: 'Visites planifiées',
      color: 'purple.600',
    },
    {
      title: 'Tickets',
      value: data?.tickets?.total ?? 0,
      description: 'Demandes en cours',
      color: 'red.600',
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
      color: 'green.solid',
    },
    {
      type: 'Leads',
      allocation: data?.leads?.total || 0,
      color: 'blue.solid',
    },
    {
      type: 'Visites',
      allocation: data?.visits?.total || 0,
      color: 'purple.solid',
    },
    {
      type: 'Tickets',
      allocation: data?.tickets?.total || 0,
      color: 'red.solid',
    },
  ];

  return (
   
      <BaseContainer title="Statistiques de l'agence" description="Vue d'ensemble des indicateurs clés de performance de votre agence immobilière"isFilterActive={isFilterOpen}onToggleFilter={()=>setIsFilterOpen(!isFilterOpen)} filterComponent={<DateRangePicker
          onChange={({ startDate, endDate }) => {
            console.log('Période sélectionnée', startDate, endDate); 
          }}
        />}  withActionButtons actionsButtonProps={{onToggleFilter(){}}}>
      

      {isLoading ? (
        <Box py={20} textAlign="center">
          <Spinner size="xl" />
        </Box>
      ) : (
        <>
          <SimpleGrid width={'full'} columns={{ base: 1, sm: 4, }} gap={4}>
            {stats.map((kpi) => (
              <BaseStats
                key={kpi.label}
                title={kpi.label}
                value={kpi.value}
                icon={kpi.icon}
                iconBgColor={kpi.color}
                isLoading ={isLoading}
              />
            ))}
          </SimpleGrid>

          <SimpleGrid width={'full'} columns={{ base: 1, lg: 2 }} gap={4}>
            <BarChart data={chartData} />
            <DonutChart title="Tickets par statut" data={donutData} />
          </SimpleGrid>

          <LineChart
            title="Évolution des indicateurs"
            data={lineChartData}
            xKey="category"
            series={[{ name: 'value', label: 'Total', color: 'blue.solid' }]}
          />
        </>
      )}
      </BaseContainer>
  );
}
