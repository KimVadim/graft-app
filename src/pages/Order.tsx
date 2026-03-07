import { Button, Spin, Table, Row, Col, Input } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { OpportunityModal } from "../components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store.ts";
import { getOrderAllData } from "../service/appServiceBackend.ts";
import { OrderFieldData, OrderStatus, OrderType } from "../constants/appConstant.ts";
import '../App.css';
import { CapsuleTabs, Toast } from "antd-mobile";
import { MenuComp } from "../components/Menu.tsx";
import { opportunityMeta } from "./AllApplicationMeta.tsx";
import { setOrder } from "../slices/orderSlice.ts";
import { setOrderItem } from "../slices/orderitemSlice.ts";
import { setMenu } from "../slices/menuSlice.ts";

export const Opportunity: React.FC = () => {
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

      dispatch(setOrder(response?.order));
      dispatch(setOrderItem(response?.orderItem));
      dispatch(setMenu(response?.menu));

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
    const dateA = new Date(a[OrderFieldData.OrderDt]).getTime();
    const dateB = new Date(b[OrderFieldData.OrderDt]).getTime();

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
        <Row align="middle" gutter={15}>
          <Col flex="auto" style={{ maxWidth: '111px' }}>
            <MenuComp/>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => loadOrders(true)}
            >
              Обновить
            </Button>
          </Col>
          <Col>
            <Input
              placeholder="Поиск по номеру квартиры..."
              value={searchText}
              onChange={actions.handleSearch}
              style={{ width: 150 }}
            />
          </Col>
        </Row>
      <CapsuleTabs>
        <CapsuleTabs.Tab title='Бронь' key='fruits'>
          <Table
            rowKey="uid"
            scroll={{ x: 395 }}
            columns={opportunityMeta}
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
        </CapsuleTabs.Tab>
        <CapsuleTabs.Tab title='Оплаченые' key='vegetables' >
          <Table
            rowKey="uid"
            scroll={{ x: 395 }}
            columns={opportunityMeta}
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
        </CapsuleTabs.Tab>
      </CapsuleTabs>
      </Spin>
      <OpportunityModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        record={selectedRecord}
      />
    </>
  );
}
