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
          revenue_sauna_total: 0,
          profit_sauna_total: 0,
          revenue_kitchen_total: 0,
          profit_kitchen_total: 0,
        };
      }

      weeksMap[weekKey].total_revenue += item.total_revenue || 0;
      weeksMap[weekKey].total_profit += item.total_profit || 0;
      weeksMap[weekKey].revenue_sauna_total += item.revenue_sauna_total || 0;
      weeksMap[weekKey].profit_sauna_total += item.profit_sauna_total || 0;
      weeksMap[weekKey].revenue_kitchen_total += item.revenue_kitchen_total || 0;
      weeksMap[weekKey].profit_kitchen_total += item.profit_kitchen_total || 0;
    });
    return Object.values(weeksMap).slice(-16);
  }, [dailyReportData]);

  return (
    <>
    <h3 style={{
      fontSize: '18px',
      fontWeight: 600,
      color: '#1f2937',
      paddingLeft: '10px',
      marginTop: '16px',
      borderLeft: '4px solid #4f46e5',
      whiteSpace: 'nowrap'
    }}>
      Детализация: Общий доход
    </h3>
    <ResponsiveContainer width="100%" height={700}>
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
    <h3 style={{
      fontSize: '18px',
      fontWeight: 600,
      color: '#1f2937',
      paddingLeft: '10px',
      marginTop: '16px',
      borderLeft: '4px solid #15803d',
      whiteSpace: 'nowrap'
    }}>
      Детализация: Доход баня
    </h3>
    <ResponsiveContainer width="100%" height={750}>
      <BarChart
        data={weeklyData}
        margin={{ top: 10, right: 50, left: 25, bottom: 10 }}
        layout="vertical"
      >
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
        <Bar dataKey="profit_sauna_total" name="Баня приб." fill="#4ade80" barSize={7}>
          <LabelList
            position="right"
            fill="#1f2937"
            fontSize={11}
            formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
          />
        </Bar>
        <Bar dataKey="revenue_sauna_total" name="Баня дох." fill="#15803d" barSize={5}>
          <LabelList
            position="right"
            fill="#1f2937"
            fontSize={11}
            formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <h3 style={{
      fontSize: '18px',
      fontWeight: 600,
      color: '#1f2937',
      paddingLeft: '10px',
      marginTop: '16px',
      borderLeft: '4px solid #0ea5a4',
      whiteSpace: 'nowrap'
    }}>
      Детализация: Доход кухня
    </h3>
    <ResponsiveContainer width="100%" height={2000}>
      <BarChart
        data={weeklyData}
        margin={{ top: 10, right: 50, left: 25, bottom: 30 }}
        layout="vertical"
      >
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
        <Bar dataKey="profit_kitchen_total" name="Кухня приб." fill="#67e8f9" barSize={7}>
          <LabelList
            position="right"
            fill="#1f2937"
            fontSize={11}
            formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
          />
        </Bar>
        <Bar dataKey="revenue_kitchen_total" name="Кухня дох." fill="#0ea5a4" barSize={5}>
          <LabelList
            position="right"
            fill="#1f2937"
            fontSize={11}
            formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </>
  )
}
