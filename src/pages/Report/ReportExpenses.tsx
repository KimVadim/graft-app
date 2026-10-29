import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Col, DatePicker, Row, Spin, Collapse, Progress, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import { AppDispatch, RootState } from '../../store';
import { MenuComp } from '../../components/Menu';
import { getExpensesReportData } from '../../service/appServiceBackend';
import { setMonthlyExpensesReport } from '../../slices/monthlyExpensesReportSlice';
import { ChartColorsBar } from '../../constants/appConstant';

dayjs.locale('ru');

interface ExpenseRow {
  year: number;
  month: number;
  app_name: string; // на что/на кого относится расход (Alatau, Apart, Grafit)
  source: string;   // откуда оплачено
  type: string;     // категория
  total: number;
}

interface TypeGroup {
  type: string;
  total: number;
  sources: { source: string; total: number }[];
}

interface AppGroup {
  appName: string;
  total: number;
  types: TypeGroup[];
}

const fmt = (n: number) => `${Math.round(n).toLocaleString('ru-RU')} ₸`;

const groupRows = (rows: ExpenseRow[]): AppGroup[] => {
  const apps = new Map<string, Map<string, Map<string, number>>>();

  rows.forEach(({ app_name, type, source, total }) => {
    if (!apps.has(app_name)) apps.set(app_name, new Map());
    const types = apps.get(app_name)!;
    if (!types.has(type)) types.set(type, new Map());
    const sources = types.get(type)!;
    sources.set(source, (sources.get(source) ?? 0) + Number(total));
  });

  return Array.from(apps.entries())
    .map(([appName, types]) => {
      const typeGroups: TypeGroup[] = Array.from(types.entries())
        .map(([type, sources]) => {
          const sourceList = Array.from(sources.entries())
            .map(([source, total]) => ({ source, total }))
            .sort((a, b) => b.total - a.total);
          return {
            type,
            total: sourceList.reduce((s, x) => s + x.total, 0),
            sources: sourceList,
          };
        })
        .sort((a, b) => b.total - a.total);

      return {
        appName,
        total: typeGroups.reduce((s, x) => s + x.total, 0),
        types: typeGroups,
      };
    })
    .sort((a, b) => b.total - a.total);
};

const sumBySource = (rows: ExpenseRow[]) => {
  const map = new Map<string, number>();
  rows.forEach(({ source, total }) => map.set(source, (map.get(source) ?? 0) + Number(total)));
  return Array.from(map.entries())
    .map(([source, total]) => ({ source, total }))
    .sort((a, b) => b.total - a.total);
};

const TypeBlock: React.FC<{ group: TypeGroup; appTotal: number }> = ({ group, appTotal }) => {
  const percent = appTotal > 0 ? (group.total / appTotal) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <Row justify="space-between" align="middle">
        <span style={{ fontWeight: 600 }}>{group.type}</span>
        <span style={{ fontWeight: 600 }}>{fmt(group.total)}</span>
      </Row>
      <Progress percent={Number(percent.toFixed(1))} showInfo={false} size="small" strokeColor={ChartColorsBar.Primary} />
      {group.sources.map(s => (
        <Row key={s.source} justify="space-between" style={{ fontSize: 12, color: '#6b6b6b' }}>
          <span>опл. / {s.source}</span>
          <span>{fmt(s.total)}</span>
        </Row>
      ))}
    </div>
  );
};

export const ExpensesReportpa: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const report = await getExpensesReportData(selectedDate.month() + 1, selectedDate.year());
      dispatch(setMonthlyExpensesReport(report?.reportExpenses ?? []));
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, selectedDate]); // selectedDate в зависимостях — иначе смена месяца не перезагружает данные

  useEffect(() => {
    loadData();
  }, [loadData]);

  const rows: ExpenseRow[] = useSelector(
    (state: RootState) => state.monthlyExpensesReport.monthlyExpensesReport,
  ) ?? [];

  const groups = useMemo(() => groupRows(rows), [rows]);
  const paidBySource = useMemo(() => sumBySource(rows), [rows]);
  const grandTotal = useMemo(() => groups.reduce((s, g) => s + g.total, 0), [groups]);

  return (
    <Spin spinning={loading}>
      <div style={{ paddingTop: 10, width: 390, maxWidth: '100%', margin: '0 auto', paddingBottom: 50 }}>
        <Row align="middle" gutter={15}>
          <Col flex="auto" style={{ maxWidth: 120 }}>
            <MenuComp />
          </Col>
          <Col>
            <strong>Отчёт по расходам</strong>
          </Col>
        </Row>

        <Row justify="space-between" align="bottom" style={{ padding: '14px 12px 10px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: '#6b6b6b' }}>Всего за месяц</div>
            <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>{fmt(grandTotal)}</div>
          </div>
          <DatePicker.MonthPicker
            value={selectedDate}
            onChange={date => date && setSelectedDate(date)}
            allowClear={false}
            format="MMMM YYYY"
            style={{ width: 170 }}
            locale={locale}
          />
        </Row>

        {groups.length > 1 && (
          <div style={{ padding: '12px 12px' }}>
            <div style={{ fontSize: 12, color: '#6b6b6b', marginBottom: 2 }}>Кто сколько потратил</div>
            {groups.map(g => (
              <Row key={g.appName} justify="space-between" style={{ fontSize: 13, padding: '2px 0' }}>
                <span>{g.appName}</span>
                <span>
                  {fmt(g.total)}
                  <span style={{ color: ChartColorsBar.Primary, marginLeft: 8 }}>
                    {grandTotal > 0 ? `${Math.round((g.total / grandTotal) * 100)}%` : ''}
                  </span>
                </span>
              </Row>
            ))}
          </div>
        )}

        {paidBySource.length > 0 && (
          <div style={{ padding: '12px 12px' }}>
            <div style={{ fontSize: 12, color: '#6b6b6b', marginBottom: 2 }}>Кто сколько оплатил</div>
            {paidBySource.map(p => (
              <Row key={p.source} justify="space-between" style={{ fontSize: 13, padding: '2px 0' }}>
                <span>{p.source}</span>
                <span>{fmt(p.total)}</span>
              </Row>
            ))}
          </div>
        )}

        {groups.length === 0 && !loading ? (
          <Empty description="Нет расходов за выбранный месяц" style={{ marginTop: 40 }} />
        ) : (
          <Collapse
            bordered={false}
            defaultActiveKey={groups.slice(0, 1).map(g => g.appName)}
            items={groups.map(g => ({
              key: g.appName,
              label: (
                <Row justify="space-between" style={{ width: '100%', paddingRight: 8 }}>
                  <strong>{g.appName}</strong>
                  <strong>{fmt(g.total)}</strong>
                </Row>
              ),
              children: g.types.map(t => <TypeBlock key={t.type} group={t} appTotal={g.total} />),
            }))}
          />
        )}
      </div>
    </Spin>
  );
};