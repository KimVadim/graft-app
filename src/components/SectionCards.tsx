import { useSelector } from "react-redux";
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { RootState } from "../store";
import { useMemo } from "react";
import dayjs from "dayjs";

import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);
export function ChartAreaInteractive() {
  const dailyReportData = useSelector((state: RootState) => state.dailyReport.dailyReport);
  const weeklyData = useMemo(() => {
    if (!dailyReportData || dailyReportData.length === 0) return [];

    const weeksMap: Record<string, any> = {};

    dailyReportData.forEach((item) => {
      const date = dayjs(item.order_dt);
      const weekKey = `${date.year()}-W${date.week()}`;

      if (!weeksMap[weekKey]) {
        const start = date.startOf('week').format("DD.MM");
        const end = date.endOf('week').format("DD.MM");
        weeksMap[weekKey] = {
          weekLabel: `${start} - ${end}`,
          order_dt: date.startOf('week').toISOString(),
          total_revenue: 0,
          total_profit: 0,
        };
      }

      weeksMap[weekKey].total_revenue += Number(item.total_revenue || 0);
      weeksMap[weekKey].total_profit += Number(item.total_profit || 0);
    });
    return Object.values(weeksMap).slice(-16);
  }, [dailyReportData]);

  return (
    <ResponsiveContainer width="100%" height={1000}>
      <BarChart data={weeklyData} margin={{ top: 10, right: 50, left: 25, bottom: 10 }} layout="vertical">
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="weekLabel"
          tickLine={false}
          axisLine={false}
          width={90}
          interval={0}
          tick={{ fontSize: 12, fill: 'var(--text)' }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "5px" }}
          formatter={(value) => (
            <span style={{ color: "#1f2937", fontSize: 16 }}>{value}</span>
          )}
        />
        <Bar dataKey="total_profit" name="Прибыль" fill="#98bff6" barSize={7}>
          <LabelList
            position="right"
            fill="#1f2937"
            fontSize={11}
            formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
          />
        </Bar>
        <Bar dataKey="total_revenue" name="Доход" fill="#4f46e5" barSize={5}>
          <LabelList
            position="right"
            fill="#1f2937"
            fontSize={11}
            formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
