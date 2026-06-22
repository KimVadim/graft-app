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
  const weeklyReportData = useSelector((state: RootState) => state.weeklyReport.weeklyReport);

  const today = dayjs()
  const currentWeekNumber = today.isoWeek()
  const currentYear = today.year()
  const prevWeekDay = today.subtract(1, "week")
  const prevWeekNumber = prevWeekDay.isoWeek()
  const prevYear = prevWeekDay.year()

  const currentWeek = weeklyReportData.find(
    d => d.week_number === currentWeekNumber && d.year === currentYear
  )
  const prevWeek = weeklyReportData.find(
    d => d.week_number === prevWeekNumber && d.year === prevYear
  )

  function diff(curr: number, prev: number) {
    const delta = curr - prev
    const percent = prev === 0 ? 0 : (delta / prev) * 100
    return { delta, percent, trend: delta >= 0 ? "up" : "down" as "up" | "down" }
  }

  const profitCurr = Number(currentWeek?.total_profit || 0)
  const profitPrev = Number(prevWeek?.total_profit || 0)
  const profit = diff(profitCurr, profitPrev)

  const countCurr = Number(currentWeek?.orders_count || 0)
  const countPrev = Number(prevWeek?.orders_count || 0)
  const orders = diff(countCurr, countPrev)

  const revCurr = Number(currentWeek?.total_revenue || 0)
  const revPrev = Number(prevWeek?.total_revenue || 0)
  const avgCheckCurr = countCurr === 0 ? 0 : revCurr / countCurr
  const avgCheckPrev = countPrev === 0 ? 0 : revPrev / countPrev
  const avgCheck = diff(avgCheckCurr, avgCheckPrev)

  const avgProfitCurr = countCurr === 0 ? 0 : profitCurr / countCurr
  const avgProfitPrev = countPrev === 0 ? 0 : profitPrev / countPrev
  const avgProfit = diff(avgProfitCurr, avgProfitPrev)

  function footerMain(d: ReturnType<typeof diff>) {
    const pct = Math.abs(d.percent).toFixed(1)
    return d.trend === "up"
      ? `Текущая vs прошлая  Рост на ${pct}%`
      : `Текущая vs прошлая  Сниж. на ${pct}%`
  }

  const currentLabel = currentWeek?.week_label ?? `Нед. ${currentWeekNumber}`
  const prevLabel = prevWeek?.week_label ?? `Нед. ${prevWeekNumber}`
  const footerSub = `${currentLabel} vs ${prevLabel}`

  const cards = [
    {
      label: "Прибыль за неделю",
      value: profitCurr.toLocaleString("ru-RU"),
      valuePrev: profitPrev.toLocaleString("ru-RU"),
      d: profit,
      badge: `${profit.percent > 0 ? "+" : ""}${profit.percent.toFixed(1)}%`,
      footerMain: footerMain(profit),
    },
    {
      label: "Количество заказов",
      value: countCurr.toLocaleString("ru-RU"),
      valuePrev: countPrev.toLocaleString("ru-RU"),
      d: orders,
      badge: `${orders.percent > 0 ? "+" : ""}${Math.round(orders.percent)}%`,
      footerMain: footerMain(orders),
    },
    {
      label: "Средний чек",
      value: Math.round(avgCheckCurr).toLocaleString("ru-RU"),
      valuePrev: Math.round(avgCheckPrev).toLocaleString("ru-RU"),
      d: avgCheck,
      badge: `${avgCheck.percent > 0 ? "+" : ""}${avgCheck.percent.toFixed(1)}%`,
      footerMain: footerMain(avgCheck),
    },
    {
      label: "Средняя прибыль на чек",
      value: Math.round(avgProfitCurr).toLocaleString("ru-RU"),
      valuePrev: Math.round(avgProfitPrev).toLocaleString("ru-RU"),
      d: avgProfit,
      badge: `${avgProfit.percent > 0 ? "+" : ""}${avgProfit.percent.toFixed(1)}%`,
      footerMain: footerMain(avgProfit),
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
                {card.d.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
                {card.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-center text-center text-xs">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footerMain}
              {card.d.trend === "up"
                ? <IconTrendingUp className="size-4" />
                : <IconTrendingDown className="size-4" />}
            </div>
            <div className="text-muted-foreground text-[11px]">{footerSub}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}