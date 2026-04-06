import { useSelector } from "react-redux";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis } from "recharts"
import { RootState } from "../store";


export function ChartAreaInteractive() {
  const dailyReportData = useSelector((state: RootState) => state.dailyReport.dailyReport);
  const chartData = (dailyReportData || []).slice(0, 90);

  return (
    <AreaChart data={chartData}>
      <defs>
        <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="5%"
            stopColor="var(--color-desktop)"
            stopOpacity={1.0}
          />
          <stop
            offset="95%"
            stopColor="var(--color-desktop)"
            stopOpacity={0.1}
          />
        </linearGradient>
        <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="5%"
            stopColor="var(--color-mobile)"
            stopOpacity={0.8}
          />
          <stop
            offset="95%"
            stopColor="var(--color-mobile)"
            stopOpacity={0.1}
          />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="order_dt"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        minTickGap={32}
        tickFormatter={(value) => {
          const date = new Date(value)
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        }}
      />
      <Tooltip
        labelFormatter={(value) =>
          new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        }
        formatter={(value, name) => [
          Number(value ?? 0).toLocaleString(),
          name === "total_revenue" ? "Доход" : "Прибыль",
        ]}
      />
      <Area
        dataKey="total_revenue"
        type="natural"
        fill="url(#fillMobile)"
        stroke="var(--color-mobile)"
        stackId="a"
      />
      <Area
        dataKey="total_profit"
        type="natural"
        fill="url(#fillDesktop)"
        stroke="var(--color-desktop)"
        stackId="a"
      />
    </AreaChart>
  )
}
