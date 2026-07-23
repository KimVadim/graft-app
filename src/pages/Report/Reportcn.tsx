import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Col, Row, Spin, DatePicker } from 'antd';
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
import { ChartAreaInteractive } from './WeeklySectionCards';
import { Tabs } from 'antd-mobile';
import { getDailyReportData, getMonthlyReportData, getMonthlySalesProductReportData, getWeeklyReportData } from '../../service/appServiceBackend';
import { setWeeklyReport } from '../../slices/weeklyReportSlice';
import { setMonthlyReport } from '../../slices/monthlyReportSlice';
import { SectionCards } from './SectionCards';
import { setMonthlySalesProductReport } from '../../slices/monthlySalesProductReportSlice';
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";

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
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = React.useState<boolean>(false);
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const dailyReport = await getDailyReportData();
      dispatch(setDeilyReport(dailyReport?.dailyReport));

      const weeklyReport = await getWeeklyReportData();
      dispatch(setWeeklyReport(weeklyReport?.weeklyReport));

      const monthlyReport = await getMonthlyReportData();
      dispatch(setMonthlyReport(monthlyReport?.monthlyReport));

      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false)
    }
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const monthlySalesProductReport = await getMonthlySalesProductReportData(
        selectedDate.month() + 1,
        selectedDate.year()
      );
      console.log('monthlySalesProductReport', monthlySalesProductReport)
      dispatch(setMonthlySalesProductReport(monthlySalesProductReport?.monthlySalesProductReport));

    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const dailyReportData = useSelector((state: RootState) => state.dailyReport.dailyReport);
  const monthlyReportData = useSelector((state: RootState) => state.monthlyReport.monthlyReport);
  const monthlySalesProductReportData = useSelector((state: RootState) => state.monthlySalesProductReport.monthlySalesProductReport);
  const chartData = useMemo(() =>
    (dailyReportData || []).slice(0, 21),
    [dailyReportData]
  );
  const ROW_HEIGHT = 30; // высота под один товар (2 бара + gap)
  const MARGIN = 20; // легенда + margin.top + margin.bottom

  const chartHeight = useMemo(() => {
    return monthlySalesProductReportData.length * ROW_HEIGHT + MARGIN;
  }, [monthlySalesProductReportData]);

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
      <Tabs>
        <Tabs.Tab title='Дневной' key='DailyReport'>
          <ResponsiveContainer width="100%" height={500} style={{marginBottom: '40px'}}>
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
              <Bar dataKey="total_profit" name="Прибыль" fill="#98bff6" barSize={7} radius={[0, 6, 6, 0]}>
                <LabelList
                  position="right"
                  fill="#1f2937"
                  fontSize={11}
                  formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
                />
              </Bar>
              <Bar dataKey="total_revenue" name="Доход" fill="#4f46e5" barSize={5} radius={[0, 6, 6, 0]}>
                <LabelList
                  position="right"
                  fill="#1f2937"
                  fontSize={11}
                  formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <SectionCards/>
        </Tabs.Tab>
        <Tabs.Tab title='По неделям' key='WeeklyReport'>
          <ChartAreaInteractive/>
        </Tabs.Tab>
        <Tabs.Tab title='По месяцам' key='MonthlyReport'>
          <ResponsiveContainer width="100%" height={300} style={{marginBottom: '40px'}}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f2937',
              marginTop: '16px',
              paddingLeft: '10px',
              borderLeft: '4px solid #4f46e5',
              whiteSpace: 'nowrap'
            }}>Доход за последний год</h3>
            <BarChart data={monthlyReportData} margin={{ top: 10, right: 50, left: 25, bottom: 10 }} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="month_label"
                tickLine={false}
                axisLine={false}
                width={50}
                interval={0}
              />
              <Legend
                wrapperStyle={{ paddingTop: "5px" }}
                formatter={(value) => (
                  <span style={{ color: "#1f2937", fontSize: 16 }}>{value}</span>
                )}
              />
              <Bar dataKey="sauna_profit" name="Приб. баня" fill="#cee0f9" barSize={7} radius={[0, 6, 6, 0]}>
                <LabelList
                  position="right"
                  fill="#1f2937"
                  fontSize={11}
                  formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
                />
              </Bar>
              <Bar dataKey="total_profit" name="Прибыль" fill="#98bff6" barSize={7} radius={[0, 6, 6, 0]}>
                <LabelList
                  position="right"
                  fill="#1f2937"
                  fontSize={11}
                  formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
                />
              </Bar>
              <Bar dataKey="total_revenue" name="Доход" fill="#4f46e5" barSize={5} radius={[0, 6, 6, 0]}>
                <LabelList
                  position="right"
                  fill="#1f2937"
                  fontSize={11}
                  formatter={(value) => Math.round(Number(value) / 1000).toLocaleString("ru-RU")}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={chartHeight} style={{marginBottom: '40px'}}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                gap: 16,
                width: "100%",
                marginTop: 16,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#1f2937",
                  paddingLeft: 10,
                  borderLeft: "4px solid #4f46e5",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Отчет по продажам
              </h3>

              <DatePicker.MonthPicker
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                allowClear={false}
                format="MMM YY"
                style={{
                  width: 120,
                  flexShrink: 0,
                }}
                locale={locale}
              />
            </div>
            <BarChart
              data={monthlySalesProductReportData}
              layout="vertical"
              margin={{ top: 15, right: 70, left: 10, bottom: 15 }}
              barCategoryGap={18}
            >
              <XAxis type="number" hide />

              <YAxis
                type="category"
                dataKey="item_name"
                width={150}
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{
                  fontSize: 13,
                  fill: "#374151",
                }}
              />

              <Legend
                wrapperStyle={{
                  paddingBottom: 10,
                  fontSize: 14,
                }}
                formatter={(value) => (
                  <span style={{ color: "#1f2937", fontSize: 16 }}>{value}</span>
                )}
              />

              <Bar
                dataKey="total_quantity"
                name="Количество"
                fill="#4f46e5"
                barSize={8}
                radius={[0, 6, 6, 0]}
              >
                <LabelList
                  dataKey="total_quantity"
                  position="right"
                  offset={8}
                  fill="#111827"
                  fontSize={12}
                  fontWeight={600}
                  formatter={(v) => `${v} ед.`}
                />
              </Bar>

              <Bar
                dataKey="profit_margin_pct"
                name="Прибыль"
                fill="#93c5fd"
                barSize={5}
                radius={[0, 6, 6, 0]}
              >
                <LabelList
                  dataKey="profit_margin_pct"
                  position="right"
                  offset={8}
                  fill="#374151"
                  fontSize={12}
                  formatter={(v) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Tabs.Tab>
      </Tabs>
    </div>
    </Spin>
  );
};
