import { useSelector } from "react-redux";
import { RootState } from "../../store";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { CHART_CONFIGS } from "./ChartConfit";
import { WeeklyBarChart } from "./BarChart";
dayjs.extend(weekOfYear);

export function ChartAreaInteractive() {
  const weeklyReportData = useSelector((state: RootState) => state.weeklyReport.weeklyReport);

  return (
    <div style={{ marginBottom: '50px' }}>
      {CHART_CONFIGS.map(config => (
        <WeeklyBarChart key={config.title} data={weeklyReportData.slice(0, 12)} {...config} />
      ))}
    </div>
  );
}
