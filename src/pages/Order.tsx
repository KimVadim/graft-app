import { Button, Spin, Table, Row, Col, Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { OpportunityModal } from "../components/OrderModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getMenuData, getOrderAllData } from "../service/appServiceBackend";
import { OrderFieldData, OrderStatus, OrderType } from "../constants/appConstant";
// @ts-ignore
import '../index.css';
import { Tabs, Toast } from "antd-mobile";
import { MenuComp } from "../components/Menu";
import { orderMeta } from "./AllApplicationMeta";
import { setOrder } from "../slices/orderSlice";
import { setMenu } from "../slices/menuSlice";

export const Order: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OrderType | null>(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const optyData = useSelector((state: RootState) => state.order.order) as unknown as OrderType[];
  const loadOrders = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      const response = await getOrderAllData();

      dispatch(setOrder(response?.orders));

      const responseMenu = await getMenuData();

      dispatch(setMenu(responseMenu?.menu));

      if (showToast) {
        Toast.show({ content: 'Заказы обновлены!', duration: 3000 });
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const normalizePhone = (value?: string) => value?.replace(/\D/g, '') ?? '';
  const normalizeText = (str?: string) => str?.toLowerCase().replace(/\s+/g, " ").trim() ?? "";
  const filteredData = useMemo(() => {
    const text = normalizeText(searchText);
    const phoneSearch = normalizePhone(searchText);

    if (!text && !phoneSearch) return optyData;

    return optyData.filter(item => {
      const firstName = normalizeText(item[OrderFieldData.FirstName]);
      const phone = normalizePhone(item[OrderFieldData.Phone]);

      if (phoneSearch && phone.includes(phoneSearch)) return true;
      if (text && firstName.includes(text)) return true;

      return false;
    });
  }, [searchText, optyData]);

  const sortOrders = (a: OrderType, b: OrderType) => {
    const dateA = new Date(a[OrderFieldData.CreatedAt]).getTime();
    const dateB = new Date(b[OrderFieldData.CreatedAt]).getTime();

    if (dateA !== dateB) return dateA - dateB;

    const saunaA = Number(a[OrderFieldData.SaunaNum]) || 0;
    const saunaB = Number(b[OrderFieldData.SaunaNum]) || 0;

    if (saunaA !== saunaB) return saunaA - saunaB;

    const timeA = a[OrderFieldData.StartTime] || "";
    const timeB = b[OrderFieldData.StartTime] || "";

    return timeA.localeCompare(timeB);
  };
  const reservationData = useMemo(() => {
    return (filteredData || [])
      .filter(x => [OrderStatus.Reservation].includes(x[OrderFieldData.Status] as OrderStatus))
      .sort(sortOrders);
  }, [filteredData]);

  const paidData = useMemo(() => {
    return (filteredData || []).filter(
      x => [OrderStatus.Cancel, OrderStatus.Pay].includes(x[OrderFieldData.Status] as OrderStatus)
    );
  }, [filteredData]);

  const actions = {
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    handleRowClick: (record: any) => {
      setSelectedRecord(record);
      setIsModalOpen(true);
    },
  };

  return (
    <>
      <Spin spinning={loading}>
        <Row align="middle" gutter={[8, 8]} wrap>
          <Col flex="auto" style={{ maxWidth: '115px' }}>
            <MenuComp/>
          </Col>
          <Col>
            <Input
              placeholder="Поиск по номеру квартиры..."
              value={searchText}
              onChange={actions.handleSearch}
              style={{ width: '100%', maxWidth: 140 }}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => loadOrders(true)}
            >
              Обновить
            </Button>
          </Col>
        </Row>
        <Tabs>
          <Tabs.Tab title='Бронь' key='fruits'>
            <Table
              rowKey="uid"
              scroll={{ x: 385 }}
              columns={orderMeta}
              dataSource={reservationData}
              size='middle'
              pagination={{
                position: ['bottomCenter'],
                pageSize: 20
              }}
              onRow={(record) => ({
                onClick: () => actions.handleRowClick(record),
              })}
            />
          </Tabs.Tab>
          <Tabs.Tab title='Оплаченые' key='vegetables'>
            <Table
              rowKey="uid"
              scroll={{ x: 385 }}
              columns={orderMeta}
              dataSource={paidData}
              size='middle'
              pagination={{
                position: ['bottomCenter'],
                pageSize: 20
              }}
              onRow={(record) => ({
                onClick: () => actions.handleRowClick(record),
              })}
            />
          </Tabs.Tab>
        </Tabs>
      </Spin>
      <OpportunityModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        record={selectedRecord}
      />
    </>
  );
}
