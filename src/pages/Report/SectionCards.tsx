import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useMemo } from "react";
import dayjs from "dayjs";

import weekOfYear from "dayjs/plugin/weekOfYear";
import { CHART_CONFIGS } from "./ChartConfit";
import { WeeklyBarChart } from "./BarChart";
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
      {CHART_CONFIGS.map(config => (
        <WeeklyBarChart key={config.title} data={weeklyData} {...config} />
      ))}
    </>
  );
}
