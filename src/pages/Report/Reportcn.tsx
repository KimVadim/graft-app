import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Col, Row, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { PaymentProgreesBar } from '../../components/PaymentProgressBar';
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  LabelList,
  Legend,
  YAxis,
} from 'recharts'
import { MenuComp } from '../../components/Menu';
import { setDeilyReport } from '../../slices/dailyReportSlice';
import { ChartAreaInteractive } from './SectionCards';
import { SectionCards } from '../../components/section-cards';
import { CapsuleTabs } from 'antd-mobile';
import { getDailyReportData, getWeeklyReportData } from '../../service/appServiceBackend';
import { setWeeklyReport } from '../../slices/weeklyReportSlice';

export const dailyCustomTick = ({ x, y, payload }: any) => {
  const date = new Date(payload.value);
  const day = date.getDate();
  const month = date.toLocaleString("ru-RU", { month: "short" }).slice(0, 3);
  const weekday = date.toLocaleString("ru-RU", { weekday: "short" }).slice(0, 2);
  return (
    <text x={x} y={y} textAnchor="end" dominantBaseline="middle" fontSize={13} fill="#1f2937">
      {`${weekday} ${day} ${month}`}
    </text>
  );
};

export const IncomeReportcn: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalPayment, setIsModalPayment] = useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const dailyReport = await getDailyReportData();
      dispatch(setDeilyReport(dailyReport?.dailyReport));

      const weeklyReport = await getWeeklyReportData();
      dispatch(setWeeklyReport(weeklyReport?.weeklyReport));

      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false)
    }
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  const dailyReportData = useSelector((state: RootState) => state.dailyReport.dailyReport);
  const chartData = useMemo(() =>
    (dailyReportData || []).slice(0, 30),
    [dailyReportData]
  );

  return (
    <Spin spinning={loading} >
    <div style={{ paddingTop: '10px', paddingLeft: '0px', width: '390px', maxWidth: '100%', margin: '0 auto' }}>
      <Row align="middle" gutter={15}>
        <Col flex="auto" style={{ maxWidth: '120px' }}>
          <MenuComp/>
        </Col>
        <Col>
          <strong>Отчёт по доходам</strong>
        </Col>
      </Row>
      <Row align="middle" gutter={15}>
        <Col flex="auto" style={{ maxWidth: '500px'}}>
          <PaymentProgreesBar
            setIsPaymentModal={setIsModalPayment}
            isPaymentModal={isModalPayment}
          />
        </Col>
      </Row>
      <CapsuleTabs>
        <CapsuleTabs.Tab title='Сводка' key='Dashboard'>
           <SectionCards/>
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Дневной' key='DailyReport'>
          <ResponsiveContainer width="100%" height={680}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f2937',
              marginTop: '16px',
              paddingLeft: '10px',
              borderLeft: '4px solid #4f46e5',
              whiteSpace: 'nowrap'
            }}>Детализация: Доход за 30 дней</h3>
            <BarChart data={chartData} margin={{ top: 10, right: 50, left: 25, bottom: 10 }} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="day"
                tickLine={false}
                axisLine={false}
                width={50}
                interval={0}
                tick={({ x, y, payload }) => {
                  const [year, month, day] = payload.value.split("-").map(Number);

                  const date = new Date(year, month - 1, day);

                  const monthName = date
                    .toLocaleString("ru-RU", { month: "short" })
                    .replace(".", "").slice(0, 3);;

                  const weekday = date
                    .toLocaleString("ru-RU", { weekday: "short" })
                    .slice(0, 2);

                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fontSize={13}
                      fill="#1f2937"
                    >
                      {`${weekday} ${day} ${monthName}`}
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
              <Bar dataKey="total_profit" name="Прибыль" fill="#98bff6" barSize={7}>
                <LabelList
                  position="right"
                  fill="#1f2937"
                  fontSize={11}
                  formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
                />
              </Bar>
              <Bar dataKey="total_revenue" name="Доход" fill="#4f46e5" barSize={5}>
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
          <ChartAreaInteractive/>
        </CapsuleTabs.Tab>
      </CapsuleTabs>
    </div>
    </Spin>
  );
};
