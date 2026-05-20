'use client';

import { Chart, useChart } from '@chakra-ui/charts';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Box, Text } from '@chakra-ui/react';
import { CustomSkeletonLoader } from '_components/custom';
import { NoDataAnimation } from '_components/custom/data-table/NoDataAnimation';

export type DonutDataItem = {
  name: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  title: string;
  data: DonutDataItem[];
  isLoading?: boolean;
};

export default function DonutChart({ title, data, isLoading }: DonutChartProps) {
  const chart = useChart({
    data,
    series: [{ name: 'value', label: title, color: 'teal.solid' }],
  });

  if (isLoading) {
    return <CustomSkeletonLoader type="DONUT_CHART" width="full" />;
  }

  if (!data?.length) {
    return <NoDataAnimation animationType="folder" />;
  }

  return (
    <Box p={5} borderRadius="2xl" shadow="sm" width="full">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        {title}
      </Text>
      <Chart.Root chart={chart} maxH="320px">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chart.data}
              dataKey={chart.key('value')}
              nameKey={chart.key('name')}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={3}
              labelLine={false}
              label={({ percent = 0 }) => `${Math.round(percent * 100)}%`}
            >
              {chart.data.map((entry: any) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<Chart.Tooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Chart.Root>
    </Box>
  );
}
