'use client';

import { Chart, useChart } from '@chakra-ui/charts';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

import { BaseContainer } from '_components/custom';

export function StatsChart({ data }: { data: { type: string; allocation: number }[] }) {
  const chartData = data?.map((d) => ({
    type: d.type,
    allocation: d.allocation,
  }));

  const chart = useChart({
    data: chartData,
    series: [{ name: 'allocation', color: 'purple' }],
  });

  return (
    <BaseContainer>
      <Chart.Root maxH="md" chart={chart} mt={'30px'}>
        <BarChart data={chart.data} barCategoryGap={'25%'} responsive>
          <CartesianGrid stroke={chart.color('border.muted')} vertical={false} />
          <XAxis dataKey={chart.key('type')} axisLine={false} tickLine={false} tickMargin={6} />
          <YAxis axisLine={false} tickLine={false} />

          <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip />} />

          <Legend content={<Chart.Legend />} />

          {chart.series.map((item) => (
            <Bar
              key={item.name}
              dataKey={chart.key('allocation')}
              fill={chart.color(item.color)}
              stroke={chart.color(item.color)}
              radius={[6, 6, 0, 0]}
              isAnimationActive
            />
          ))}
        </BarChart>
      </Chart.Root>
    </BaseContainer>
  );
}
