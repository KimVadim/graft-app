import React, { useState, useMemo, useEffect } from 'react';
import { Col, Row, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store.ts';
import { getMonthPaymentData } from '../service/appServiceBackend.ts';
import { PaymentProgreesBar } from '../components/PaymentProgressBar.tsx';
import { CapsuleTabs, Divider } from 'antd-mobile'
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  LabelList,
  Legend,
} from 'recharts'
import { MenuComp } from '../components/Menu.tsx';

const { Text } = Typography;

export const IncomeReportcn: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const selectedMonth = 'last12months';
  const [isModalPayment, setIsModalPayment] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMonthPaymentData(dispatch);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  const monthPaymentData = useSelector((state: RootState) => state.monthPayment.monthPayments);
  const memoizedMonthPaymentData = useMemo(() => monthPaymentData, [monthPaymentData]);
  const getLastSixMonths = (countMonth: number) =>
  [...Array(countMonth)].map((_, i) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });
  const filteredData = useMemo(() => {
    if (selectedMonth === 'last12months') {
      const lastSixMonths = getLastSixMonths(12);
      return memoizedMonthPaymentData.filter((item) => lastSixMonths.includes(item.month));
    } else if (selectedMonth === 'last6months') {
      const lastSixMonths = getLastSixMonths(6);
      return memoizedMonthPaymentData.filter((item) => lastSixMonths.includes(item.month));
    } else if (selectedMonth === 'last3months') {
      const lastSixMonths = getLastSixMonths(3);
      return memoizedMonthPaymentData.filter((item) => lastSixMonths.includes(item.month));
    } else if (selectedMonth) {
      return memoizedMonthPaymentData.filter((item) => item.month === selectedMonth);
    }
    return memoizedMonthPaymentData;
  }, [memoizedMonthPaymentData, selectedMonth]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KZT',
      maximumFractionDigits: 0,
    }).format(value);

  const calcSum = (data, type: string) => data.filter((x) => x.type === type).reduce((sum, item) => sum + Number(item.value), 0);

  const sums = useMemo(() => ({
    payment: calcSum(filteredData, 'Аренда'),
    deposit: calcSum(filteredData, 'Депозит'),
    depositReturn: calcSum(filteredData, 'Депозит возврат'),
    expenses: calcSum(filteredData, 'Расход'),
    serviceAlatau: calcSum(filteredData, 'Комм. Алатау'),
    servicePavlenko: calcSum(filteredData, 'Комм. Павленко'),
    storage: calcSum(filteredData, 'Склад'),
  }), [filteredData])

  const SummaryRow: React.FC<{ label: string; value: number; type?: "success" | "warning" | "danger" }> = ({ label, value, type }) => (
    <Text type={type}>{`${label}: ${formatCurrency(value)}`}</Text>
  );

  const chartData = [
    { month: "02 fev", total: 100000, sauna: 80000,  kitchen: 20000},
    { month: "03 fev", total: 90000, sauna: 70000,  kitchen: 20000},
    { month: "04 fev", total: 80000, sauna: 60000,  kitchen: 20000},
  ]

  return (
    <div style={{ padding: '24px' }}>
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

      <CapsuleTabs>
        <CapsuleTabs.Tab title='Доходы' key='fruits'>
          <div style={{ width: '100%' }}>
            <div style={{ marginTop: '16px' }}>
              <Divider contentPosition='left' style={{
                  color: '#1677ff',
                  borderColor: '#98bff6ff',
              }}>Платежи</Divider>
              <SummaryRow label="Аренда" value={sums.payment} type="success" />
              <br/>
              <SummaryRow label="Склад" value={sums.storage} type="success" />
              <br/>
              <SummaryRow label="Итого" value={sums.payment + sums.storage} type="success" />
              <br/>
              <SummaryRow label="Расходы" value={sums.expenses} type="danger" />
              <br/>
              <SummaryRow label="Прибыль" value={(sums.payment + sums.storage) - sums.expenses} type="success" />
              <Divider contentPosition='left' style={{
                  color: '#1677ff',
                  borderColor: '#98bff6ff',
              }}>Депозиты</Divider>
              <SummaryRow label="Депозиты" value={sums.deposit} type="warning" />
              <br/>
              <SummaryRow label="Депозит возврат" value={sums.depositReturn} type="danger" />
              <br/>
              <SummaryRow label="Разница" value={sums.deposit - sums.depositReturn} type="success" />
            </div>
          </div>
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Расходы' key='vegetables' >
          <div style={{ width: '100%' }}>
            <div style={{ marginTop: '16px'}}>
              <SummaryRow label="Расходы" value={sums.expenses} type="danger" />
              <br/>
              <SummaryRow label="Комм. Алатау" value={sums.serviceAlatau} type="warning" />
              <br/>
              <SummaryRow label="Комм. Павленко" value={sums.servicePavlenko} type="warning" />
            </div>
          </div>

        </CapsuleTabs.Tab>
      </CapsuleTabs>
      <ResponsiveContainer width="100%" height={400}> {/* Увеличьте высоту */}
        <BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#1f2937", fontSize: 14 }}>
                {value}
              </span>
            )}
          />
          <Bar dataKey="total" name="Комп" fill="#98bff6">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={12}
              offset={5}
            />
          </Bar>
          <Bar dataKey="sauna" name="Тел" fill="#4f46e5">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={12}
              offset={5}
            />
          </Bar>
          <Bar dataKey="kitchen" name="Тел" fill="#516b56">
            <LabelList
              position="top"
              fill="#1f2937"
              fontSize={12}
              offset={5}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

