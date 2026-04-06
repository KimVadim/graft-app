import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getDailyReportData } from '../service/appServiceBackend';
import { PaymentProgreesBar } from '../components/PaymentProgressBar';
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  LabelList,
  Legend,
  YAxis,
} from 'recharts'
import { MenuComp } from '../components/Menu';
import { setDeilyReport } from '../slices/dailyReportSlice';
import { ChartAreaInteractive } from '../components/SectionCards';
import { SectionCards } from '../components/section-cards';
import { CapsuleTabs } from 'antd-mobile';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

export const IncomeReportcn: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalPayment, setIsModalPayment] = useState(false);
  const loadOrders = useCallback(async () => {
    try {
      const response = await getDailyReportData();

      dispatch(setDeilyReport(response?.dailyReport));
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  const dailyReportData = useSelector((state: RootState) => state.dailyReport.dailyReport);
  const chartData = (dailyReportData || []).slice(0, 30);
  dayjs.extend(weekOfYear);
  const getWeeklyData = (data: any[]) => {
    const weeks: Record<string, any> = {};

    data.forEach((item) => {
      // Группируем по году и номеру недели (например, "2024-w12")
      const weekKey = `${dayjs(item.order_dt).year()}-w${dayjs(item.order_dt).week()}`;

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          // Сохраняем дату начала недели для отображения на оси X
          order_dt: dayjs(item.order_dt).startOf('week').format('YYYY-MM-DD'),
          total_revenue: 0,
          total_profit: 0,
          count: 0,
        };
      }

      weeks[weekKey].total_revenue += Number(item.total_revenue || 0);
      weeks[weekKey].total_profit += Number(item.total_profit || 0);
      weeks[weekKey].count += 1;
    });

    return Object.values(weeks);
  };
  console.log(getWeeklyData)
  return (
    <div style={{ paddingTop: '10px', paddingLeft: '0px', width: '390px', maxWidth: '100%', margin: '0 auto' }}>
      <Row align="middle" gutter={15}>
        <Col flex="auto" style={{ maxWidth: '115px' }}>
          <MenuComp/>
        </Col>
        <Col>
          <strong>Отчёт по доходам</strong>
        </Col>
      </Row>
      <Row align="middle" gutter={15}>
        <Col flex="auto" style={{ maxWidth: '500px', marginTop: '10px' }}>
          <PaymentProgreesBar
            setIsPaymentModal={setIsModalPayment}
            isPaymentModal={isModalPayment}
          />
        </Col>
      </Row>
      <CapsuleTabs style={{ marginTop: 12 }}>
        <CapsuleTabs.Tab title='Сводка' key='Dashboard'>
           <SectionCards/>
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Дневной' key='DailyReport'>
          <ResponsiveContainer width="100%" height={900}>
            <BarChart data={chartData} margin={{ top: 10, right: 50, left: 25, bottom: 10 }} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="order_dt"
                tickLine={false}
                axisLine={false}
                width={50}
                tick={({ x, y, payload }) => {
                  const date = new Date(payload.value);
                  const day = date.getDate();
                  const month = date.toLocaleString("ru-RU", { month: "short" }).slice(0, 3);
                  const weekday = date.toLocaleString("ru-RU", { weekday: "short" }).slice(0, 2);
                  return (
                    <text x={x} y={y} textAnchor="end" dominantBaseline="middle" fontSize={13} fill="#1f2937">
                      {`${weekday} ${day} ${month}`}
                    </text>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "5px" }}
                formatter={(value) => (
                  <span style={{ color: "#1f2937", fontSize: 16 }}>{value}</span>
                )}
              />
              <Bar dataKey="total_profit" name="Прибыль" fill="#98bff6">
                <LabelList
                  position="right"
                  fill="#1f2937"
                  fontSize={11}
                  formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
                />
              </Bar>
              <Bar dataKey="total_revenue" name="Доход" fill="#4f46e5">
                <LabelList
                  position="right"
                  fill="#1f2937"
                  fontSize={11}
                  formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Недельный' key='WeeklyReport'>
          <ResponsiveContainer width="100%" height={300}>
            <ChartAreaInteractive/>
          </ResponsiveContainer>
        </CapsuleTabs.Tab>
      </CapsuleTabs>
    </div>
  );
};
