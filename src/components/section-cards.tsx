import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "./ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { useSelector } from "react-redux";
import { RootState } from "../store";
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
dayjs.extend(isoWeek)

export function SectionCards() {
  const deilyReportData = useSelector((state: RootState) => state.dailyReport.dailyReport);
  const today = dayjs()
  const currentWeek = today.isoWeek()
  const prevWeek = today.subtract(1, "week").isoWeek()
  const currentWeekday = today.isoWeekday()
  const currentWeekData = deilyReportData.filter(d => {
    const dt = dayjs(d.day)
    return dt.isoWeek() === currentWeek && dt.isoWeekday() <= currentWeekday
  })
  const currentWeekSum = currentWeekData
    .reduce((sum, d) => sum + Number(d.total_profit || 0), 0)

  const currentWeekCount = currentWeekData
  .reduce((sum, d) => sum + Number(d.orders_count || 0), 0)
  const prevWeekData = deilyReportData.filter(d => {
    const dt = dayjs(d.day)
    return dt.isoWeek() === prevWeek && dt.isoWeekday() <= currentWeekday - 1
  })

  const prevWeekSum = prevWeekData
    .reduce((sum, d) => sum + Number(d.total_profit || 0), 0)

  const prevWeekCount = prevWeekData
  .reduce((sum, d) => sum + Number(d.orders_count || 0), 0)

  const percent =
    prevWeekSum === 0
      ? 0
      : ((currentWeekSum - prevWeekSum) / prevWeekSum) * 100
  const ordersDiff = currentWeekCount - prevWeekCount

  const ordersPercent = prevWeekCount === 0
    ? 0
    : Math.round((ordersDiff / prevWeekCount) * 100)

  const ordersTrend = ordersDiff >= 0 ? "up" : "down"

  const currentWeekRevenue = currentWeekData
    .reduce((sum, d) => sum + Number(d.total_revenue || 0), 0)

  const prevWeekRevenue = prevWeekData
    .reduce((sum, d) => sum + Number(d.total_revenue || 0), 0)

  const avgCheckCurrent =
    currentWeekCount === 0 ? 0 : currentWeekRevenue / currentWeekCount

  const avgCheckPrev =
    prevWeekCount === 0 ? 0 : prevWeekRevenue / prevWeekCount

  const avgPercent =
    avgCheckPrev === 0
      ? 0
      : ((avgCheckCurrent - avgCheckPrev) / avgCheckPrev) * 100

  const avgProfitCurrent =
  currentWeekCount === 0 ? 0 : currentWeekSum / currentWeekCount

  const avgProfitPrev =
    prevWeekCount === 0 ? 0 : prevWeekSum / prevWeekCount

  const avgProfitPercent =
    avgProfitPrev === 0
      ? 0
      : ((avgProfitCurrent - avgProfitPrev) / avgProfitPrev) * 100

  const cards = [
    {
      label: "Доход за неделю",
      value: currentWeekSum.toLocaleString("ru-RU"),
      valuePrev: prevWeekSum.toLocaleString("ru-RU"),
      trend: percent >= 0 ? "up" : "down",
      badge: `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`,
      footerMain: percent >= 0
        ? `Текущая vs прошлая Рост на ${percent.toFixed(1)}%`
        : `Текущая vs прошлая Сниж. на ${percent.toFixed(1)}%`,
      footerSub: "Сравнение одинаковых дней недели",
    }, {
      label: "Количество заказов",
      value: currentWeekCount.toLocaleString("ru-RU"),
      valuePrev: prevWeekCount.toLocaleString("ru-RU"),
      trend: ordersTrend,
      badge: `${ordersPercent > 0 ? "+" : ""}${ordersPercent}%`,
      footerMain: ordersDiff >= 0
        ? `Текущая vs прошлая Рост на ${Math.abs(ordersPercent)}%`
        : `Текущая vs прошлая Сниж. на ${Math.abs(ordersPercent)}%`,
      footerSub: "Сравнение одинаковых дней недели",
    }, {
      label: "Средний чек",
      value: Math.round(avgCheckCurrent).toLocaleString("ru-RU"),
      valuePrev: Math.round(avgCheckPrev).toLocaleString("ru-RU"),
      trend: avgPercent >= 0 ? "up" : "down",
      badge: `${avgPercent > 0 ? "+" : ""}${avgPercent.toFixed(1)}%`,
      footerMain: avgPercent >= 0
        ? `Текущая vs прошлая Рост на ${avgPercent.toFixed(1)}%`
        : `Текущая vs прошлая Сниж. на ${Math.abs(avgPercent).toFixed(1)}%`,
      footerSub: "Сравнение одинаковых дней недели",
    }, {
      label: "Средняя прибыль на чек",
      value: Math.round(avgProfitCurrent).toLocaleString("ru-RU"),
      valuePrev: Math.round(avgProfitPrev).toLocaleString("ru-RU"),
      trend: avgProfitPercent >= 0 ? "up" : "down",
      badge: `${avgProfitPercent > 0 ? "+" : ""}${avgProfitPercent.toFixed(1)}%`,
      footerMain: avgProfitPercent >= 0
        ? `Текущая vs прошлая Рост на ${avgProfitPercent.toFixed(1)}%`
        : `Текущая vs прошлая Сниж. на ${Math.abs(avgProfitPercent).toFixed(1)}%`,
      footerSub: "Сравнение одинаковых дней недели",
    },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => (
        <Card key={card.label} className="@container/card">
          <CardHeader>
            <CardDescription className="text-xs">{card.label}</CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-xm">
              {card.value} / {card.valuePrev}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {card.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
                {card.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start text-xs">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footerMain}
              {card.trend === "up"
                ? <IconTrendingUp className="size-4" />
                : <IconTrendingDown className="size-4" />}
            </div>
            <div className="text-muted-foreground text-[11px]">{card.footerSub}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}