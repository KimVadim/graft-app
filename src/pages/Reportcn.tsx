import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.ts';
import { getDailyReportData } from '../service/appServiceBackend.ts';
import { PaymentProgreesBar } from '../components/PaymentProgressBar.tsx';
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  LabelList,
  Legend,
  YAxis,
} from 'recharts'
import { MenuComp } from '../components/Menu.tsx';
import { setDeilyReport } from '../slices/dailyReportSlice.ts';

export const IncomeReportcn: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalPayment, setIsModalPayment] = useState(false);
  const loadOrders = useCallback(async (showToast = false) => {
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
  const chartData = (dailyReportData || [])
  .map((item: any) => ({
    ...item,
    total_revenue: Number(String(item.total_revenue).replace(/\s/g, "")),
    total_price: Number(String(item.total_price).replace(/\s/g, "")),
    total_profit: Number(String(item.total_profit).replace(/\s/g, "")),
  })).slice(0, 30);
  return (
    <div style={{ paddingTop: '10px', paddingLeft: '15px' }}>
      <Row align="middle" gutter={15}>
        <Col flex="auto" style={{ maxWidth: '111px' }}>
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
     <ResponsiveContainer width="100%" height={800}>
      <BarChart data={chartData} margin={{ top: 0, right: 50, left: 20, bottom: 5 }} layout="vertical">
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
    </div>
  );
};

