export const CHART_CONFIGS = [
  {
    title: 'Детализация: Общий доход',
    accentColor: '#4f46e5',
    height: 300,
    bars: [
      { dataKey: 'total_profit', name: 'Прибыль', fill: '#98bff6', size: 7 },
      { dataKey: 'total_revenue', name: 'Доход', fill: '#4f46e5', size: 5 },
    ],
  },
  {
    title: 'Детализация: Доход баня',
    accentColor: '#15803d',
    height: 300,
    bars: [
      {
        dataKey: 'profit_sauna_total',
        name: 'Баня приб.',
        fill: '#4ade80',
        size: 7,
      },
      {
        dataKey: 'revenue_sauna_total',
        name: 'Баня дох.',
        fill: '#15803d',
        size: 5,
      },
    ],
  },
  {
    title: 'Детализация: Доход кухня',
    accentColor: '#0ea5a4',
    height: 300,
    bars: [
      {
        dataKey: 'profit_kitchen_total',
        name: 'Кухня приб.',
        fill: '#67e8f9',
        size: 7,
      },
      {
        dataKey: 'revenue_kitchen_total',
        name: 'Кухня дох.',
        fill: '#0ea5a4',
        size: 5,
      },
    ],
  },
];
