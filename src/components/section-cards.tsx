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

const cards = [
  {
    label: "Общий доход (тыс.)",
    value: "625",
    trend: "up",
    badge: "+12.5%",
    footerMain: "Рост в этом месяце",
    footerSub: "Посетители за последние 6 месяцев",
  },
  {
    label: "Количество заказов",
    value: "1 234",
    trend: "down",
    badge: "−20%",
    footerMain: "Снижение на 20%",
    footerSub: "Нужно усилить привлечение",
  },
  {
    label: "Средний чек",
    value: "45 678",
    trend: "up",
    badge: "+12.5%",
    footerMain: "Высокая лояльность",
    footerSub: "Показатели выше целевых",
  },
  {
    label: "Среднее время",
    value: "5.5",
    trend: "up",
    badge: "+4.5%",
    footerMain: "Стабильный рост",
    footerSub: "Соответствует прогнозу",
  },
]

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => (
        <Card key={card.label} className="@container/card">
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {card.value} / {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {card.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
                {card.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footerMain}
              {card.trend === "up"
                ? <IconTrendingUp className="size-4" />
                : <IconTrendingDown className="size-4" />}
            </div>
            <div className="text-muted-foreground">{card.footerSub}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}