'use client';

import { Chart, useChart } from '@chakra-ui/charts';
import { Line, LineChart as RechartsLineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Box, Text } from '@chakra-ui/react';
import { CustomSkeletonLoader } from '_components/custom';
import { NoDataAnimation } from '_components/custom/data-table/NoDataAnimation';

export type LineSeriesItem = {
  name: string;
  label: string;
  color: string;
};

type LineChartProps = {
  title: string;
  data: Array<Record<string, any>>;
  xKey: string;
  series: LineSeriesItem[];
  isLoading?: boolean;
};

export default function LineChart({ title, data, xKey, series, isLoading }: LineChartProps) {
  const chart = useChart({
    data,
    series,
  });

  if (isLoading) {
    return <CustomSkeletonLoader type="LINE_CHART" width="full" />;
  }

  if (!data?.length) {
    return <NoDataAnimation animationType="folder" />;
  }

  return (
    <Box bg="white" p={5} borderRadius="2xl" shadow="sm" width="full">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        {title}
      </Text>
      <Chart.Root chart={chart} maxH="360px">
        <ResponsiveContainer width="100%" height={340}>
          <RechartsLineChart data={chart.data}>
            <CartesianGrid stroke={chart.color('border.muted')} vertical={false} />
            <XAxis dataKey={chart.key(xKey)} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={<Chart.Tooltip />} />
            <Legend content={<Chart.Legend />} />
            {chart.series.map((item) => (
              <Line
                key={item.name}
                type="monotone"
                dataKey={chart.key(item.name)}
                stroke={chart.color(item.color)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </Chart.Root>
    </Box>
  );
}
