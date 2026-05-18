'use client';

import { Chart, useChart } from '@chakra-ui/charts';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Rectangle, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Box, Text } from '@chakra-ui/react';

type ChartDataItem = {
  type: string;
  allocation: number;
  color: string;
};

type Props = {
  data: ChartDataItem[];
};

export default function BarChart({ data }: Props) {
  const chart = useChart({
    data,
  });

  return (
    <Box bg="white" p={5} borderRadius="xl" shadow="md">
      <Text mb={4} fontWeight="bold" fontSize="lg">
        Statistiques Agence
      </Text>

      <Chart.Root chart={chart} maxH="400px">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={chart.data}>
            <CartesianGrid vertical={false} stroke={chart.color('border.muted')} />

            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey={chart.key('type')}
            />

            <YAxis axisLine={false} tickLine={false} />

            <Bar
              dataKey={chart.key('allocation')}
              radius={[10, 10, 0, 0]}
              shape={(props: any) => (
                <Rectangle {...props} fill={chart.color(props.payload.color)} />
              )}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </Chart.Root>
    </Box>
  );
}