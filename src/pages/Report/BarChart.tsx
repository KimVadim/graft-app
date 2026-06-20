import React, { JSX } from 'react';
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface WeeklyBarChartProps {
  data: any[];
  title: string;
  accentColor: string;
  height: number;
  bars: { dataKey: string; name: string; fill: string; size: number }[];
  customTick?: (props: any) => JSX.Element;
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ data, title, accentColor, height, bars, customTick }) => (
  <div style={{ marginTop: '30px' }}>
  <ResponsiveContainer width="100%" height={height}>
    <h3 style={{
      fontSize: '18px', fontWeight: 600, color: '#1f2937',
      paddingLeft: '10px', marginTop: '16px',
      borderLeft: `4px solid ${accentColor}`, whiteSpace: 'nowrap'
    }}>
      {title}
    </h3>
    <BarChart data={data} margin={{ top: 10, right: 50, left: 25, bottom: 10 }} layout="vertical">
      <XAxis type="number" hide />
      <YAxis
        type="category" dataKey="week_label"
        tickLine={false} axisLine={false}
        width={90} interval={0}
        tick={customTick ?? { fontSize: 12, fill: 'var(--text)' }}
      />
      <Legend
        wrapperStyle={{ paddingTop: '5px' }}
        formatter={(value) => <span style={{ color: '#1f2937', fontSize: 16 }}>{value}</span>}
      />
      {bars.map(bar => (
        <Bar key={bar.dataKey} dataKey={bar.dataKey} name={bar.name} fill={bar.fill} barSize={bar.size}>
          <LabelList
            position="right" fill="#1f2937" fontSize={11}
            formatter={(value) => Math.round(Number(value) / 1000).toLocaleString('ru-RU')}
          />
        </Bar>
      ))}
    </BarChart>
  </ResponsiveContainer>
  </div>
);