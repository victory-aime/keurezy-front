"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import {
  BaseContainer,
  BaseFormatNumber,
  CustomSkeletonLoader,
  TextVariant,
} from "_components/custom";
import { NoDataAnimation } from "_components/custom/data-table/NoDataAnimation";
import { BiLineChart } from "react-icons/bi";
import { MODELS } from "_types/*";

export const MonthlyRevenueAreaChart = ({
  data,
  isLoading,
}: {
  data: MODELS.IMonthlyRevenueStats[];
  isLoading?: boolean;
}) => {
  const { t } = useTranslation();

  const chartData = data?.map((d) => ({
    month: t(`COMMON.MONTHS.${d.month}`).slice(0, 3),
    received: d.receivedAmount,
    remaining: d.remainingAmount,
    expected: d.receivedAmount + d.remainingAmount,
  }));

  const chart = useChart({
    data: chartData,
    series: [
      { name: "received", label: t("CHART.RECEIVED"), color: "purple.solid" },
      { name: "remaining", label: t("CHART.REST_AMOUNT"), color: "red.solid" },
      { name: "expected", label: t("CHART.EXPECTED"), color: "teal.solid" },
    ],
  });

  if (isLoading) {
    return <CustomSkeletonLoader type={"LINE_CHART"} width={"full"} />;
  }

  if (
    !chartData ||
    chartData.every(
      (d) => d.expected === 0 && (d.received === 0 || d.remaining === 0),
    )
  ) {
    <NoDataAnimation />;
  }

  return (
    <BaseContainer
      title={"Suivi des revenus locatifs"}
      textVariant={TextVariant.M}
      loader={isLoading}
      icon={<BiLineChart />}
      iconColor={"success"}
      rounded={"2xl"}
      width={"full"}
      numberOfLines={2}
      p={4}
    >
      <Chart.Root chart={chart} maxH="md" mt={"30px"}>
        <AreaChart data={chart.data} responsive>
          <CartesianGrid
            stroke={chart.color("border")}
            vertical={false}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey={chart.key("month")}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={chart.formatNumber({
              style: "currency",
              currency: "XAF",
              notation: "compact",
            })}
          />
          <Tooltip
            cursor={false}
            animationDuration={100}
            content={
              <Chart.Tooltip
                formatter={(value: number) => (
                  <BaseFormatNumber value={value} />
                )}
              />
            }
          />
          <Legend content={<Chart.Legend />} />
          {chart.series?.map((item) => (
            <defs key={item.name}>
              <Chart.Gradient
                id={`${item.name}-gradient`}
                stops={[
                  { offset: "0%", color: item.color, opacity: 0.3 },
                  { offset: "100%", color: item.color, opacity: 0.05 },
                ]}
              />
            </defs>
          ))}
          {chart.series.map((item) => (
            <Area
              key={item.name}
              type="monotone"
              isAnimationActive
              dataKey={chart.key(item.name)}
              fill={`url(#${item.name}-gradient)`}
              stroke={chart.color(item.color)}
              strokeWidth={2}
              stackId="a"
            />
          ))}
        </AreaChart>
      </Chart.Root>
    </BaseContainer>
  );
};
