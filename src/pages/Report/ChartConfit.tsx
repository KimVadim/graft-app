export const CHART_CONFIGS = [
  {
    title: 'Детализация: Общий доход',
    accentColor: '#4f46e5',
    height: 300,
    label: 'week_label',
    bars: [
      { dataKey: 'total_profit', name: 'Прибыль', fill: '#98bff6', size: 7 },
      { dataKey: 'total_revenue', name: 'Доход', fill: '#4f46e5', size: 5 },
    ],
  },
  {
    title: 'Детализация: Доход баня',
    accentColor: '#15803d',
    height: 300,
    label: 'week_label',
    bars: [
      {
        dataKey: 'sauna_profit',
        name: 'Баня приб.',
        fill: '#4ade80',
        size: 7,
      },
      {
        dataKey: 'sauna_revenue',
        name: 'Баня дох.',
        fill: '#15803d',
        size: 5,
      },
    ],
  },
  {
    title: 'Детализация: Доход бар',
    accentColor: '#8e9508',
    height: 300,
    label: 'week_label',
    bars: [
      {
        dataKey: 'bar_profit',
        name: 'Бар приб.',
        fill: '#ccd709',
        size: 7,
      },
      {
        dataKey: 'bar_revenue',
        name: 'Бар дох.',
        fill: '#8e9508',
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
        dataKey: 'kitchen_profit',
        name: 'Кухня приб.',
        fill: '#67e8f9',
        size: 7,
      },
      {
        dataKey: 'kitchen_revenue',
        name: 'Кухня дох.',
        fill: '#0ea5a4',
        size: 5,
      },
    ],
  },
  {
    title: 'Детализация: Банные принадлежности',
    accentColor: '#048858',
    height: 300,
    label: 'week_label',
    bars: [
      {
        dataKey: 'bath_supplies_profit',
        name: 'Бан. прин. приб.',
        fill: '#0ed88e',
        size: 7,
      },
      {
        dataKey: 'bath_supplies_revenue',
        name: 'Бан. прин. дох.',
        fill: '#048858',
        size: 5,
      },
    ],
  },
];

export const CHART_APART_CONFIGS = [
  {
    title: 'Детализация: Общий доход',
    accentColor: '#4f46e5',
    height: 370,
    label: 'month_label',
    bars: [
      { dataKey: 'payment_amt', name: 'Аренда', fill: '#98bff6', size: 7 },
      { dataKey: 'storage_amt', name: 'Склады', fill: '#4f46e5', size: 5 },
    ],
  },
  {
    title: 'Детализация: Количество платежей',
    accentColor: '#15803d',
    height: 370 ,
    label: 'month_label',
    bars: [
      {
        dataKey: 'payment_count',
        name: 'Плат. аренда',
        fill: '#4ade80',
        size: 7,
      },
      {
        dataKey: 'storage_count',
        name: 'Плат. склад',
        fill: '#15803d',
        size: 5,
      },
    ],
  },
  {
    title: 'Детализация: Депозиты',
    accentColor: '#8e9508',
    height: 370,
    label: 'month_label',
    bars: [
      {
        dataKey: 'deposit_amt',
        name: 'Депозит',
        fill: '#ccd709',
        size: 7,
      },
      {
        dataKey: 'return_deposit_amt',
        name: 'Возв. депозита',
        fill: '#8e9508',
        size: 5,
      },
    ],
  },
  {
    title: 'Детализация: Количество депозитов',
    accentColor: '#0ea5a4',
    height: 370,
    label: 'month_label',
    bars: [
      {
        dataKey: 'deposit_count',
        name: 'Кол. депозит',
        fill: '#67e8f9',
        size: 7,
      },
      {
        dataKey: 'return_deposit_count',
        name: 'Кол. возв. депозита',
        fill: '#0ea5a4',
        size: 5,
      },
    ],
  },
];
