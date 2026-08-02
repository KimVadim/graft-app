import React, { useEffect, useCallback } from 'react';
import { Col, Row, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { MenuComp } from '../../components/Menu';
import { getMonthlyApartReportData } from '../../service/appServiceBackend';
import "dayjs/locale/ru";
import { WeeklyBarChart } from './BarChart';
import { CHART_APART_CONFIGS } from './ChartConfit';
import { setMonthlyApartReport } from '../../slices/monthlyApartReportSlice';

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

export const IncomeReportpa: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = React.useState<boolean>(false);
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const monthlyReport = await getMonthlyApartReportData();
      dispatch(setMonthlyApartReport(monthlyReport?.monthlyReport));

      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false)
    }
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const monthlyApartReportData = useSelector((state: RootState) => state.monthlyApartReport.monthlyApartReport);
  console.log('monthlyApartReportData', monthlyApartReportData);
  return (
    <Spin spinning={loading} >
    <div style={{ paddingTop: '10px', paddingLeft: '0px', width: '390px', maxWidth: '100%', margin: '0 auto' }}>
      <Row align="middle" gutter={15}>
        <Col flex="auto" style={{ maxWidth: '120px' }}>
          <MenuComp/>
        </Col>
        <Col>
          <strong>Отчёт по аренде</strong>
        </Col>
      </Row>
      <div style={{ marginBottom: '50px' }}>
        {CHART_APART_CONFIGS.map(config => (
          <WeeklyBarChart key={config.title} data={monthlyApartReportData.slice(0, 15)} {...config} />
        ))}
      </div>
    </div>
    </Spin>
  );
};
