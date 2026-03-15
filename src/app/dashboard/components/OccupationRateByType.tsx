"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BaseContainer,
  BaseText,
  CustomSkeletonLoader,
  TextVariant,
} from "_components/custom";
import { NoDataAnimation } from "_components/custom/data-table/NoDataAnimation";
import { IoBarChartOutline } from "react-icons/io5";
import { OccupationRateByTypeBarChartProps } from "./types/chart";

export const OccupationRateByType = ({
  data,
  isLoading,
}: OccupationRateByTypeBarChartProps) => {
  const chart = useChart({
    data,
    series: [
      {
        name: "occupationRate",
        label: "Taux d'occupation",
        color: "yellow.solid",
      },
    ],
  });

  return (
    <BaseContainer
      title="Taux d’occupation par type de logement"
      textVariant={TextVariant.M}
      loader={isLoading}
      icon={<IoBarChartOutline />}
      iconColor="tertiary"
      rounded="2xl"
      width="full"
      height="full"
      p={4}
      numberOfLines={2}
    >
      {isLoading ? (
        <CustomSkeletonLoader type="BAR_CHART" width="full" statisticBars={8} />
      ) : !data?.length ? (
        <NoDataAnimation animationType="folder" />
      ) : (
        <Chart.Root maxH="md" chart={chart} mt={"30px"}>
          <BarChart data={chart.data} barCategoryGap={"25%"} responsive>
            <CartesianGrid
              stroke={chart.color("border.muted")}
              vertical={false}
            />
            <XAxis
              dataKey={chart.key("propertyType")}
              axisLine={false}
              tickLine={false}
              tickMargin={6}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              cursor={false}
              animationDuration={100}
              content={
                <Chart.Tooltip formatter={(value: number) => `${value}%`} />
              }
            />

            <Legend content={<Chart.Legend />} />

            {chart.series.map((item) => (
              <Bar
                key={item.name}
                dataKey={chart.key(item.name)}
                fill={chart.color(item.color)}
                stroke={chart.color(item.color)}
                radius={[6, 6, 0, 0]}
                isAnimationActive
              />
            ))}
          </BarChart>
        </Chart.Root>
      )}
    </BaseContainer>
  );
};
