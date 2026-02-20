import { Button, Spin, Table, Row, Col, Input } from "antd";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getOrderAllData } from "../service/appServiceBackend.ts";
import { ModalTitle, OrderFieldData, OrderStatus, OrderType } from "../constants/appConstant.ts";
import '../App.css';
import { CapsuleTabs, Toast } from "antd-mobile";
import { MenuComp } from "../components/Menu.tsx";
import { PaymentProgreesBar } from "../components/PaymentProgressBar.tsx";
import { opportunityMeta } from "./AllApplicationMeta.tsx";
import { setOrder } from "../slices/orderSlice.ts";
import { setOrderItem } from "../slices/orderitemSlice.ts";
import { setMenu } from "../slices/menuSlice.ts";

export const Opportunity: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPayment, setIsModalPayment] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const isCalledRef = useRef(false);
  const optyData = useSelector((state: RootState) => state.order.order) as unknown as OrderType[];

  useEffect(() => {
    if (!isCalledRef.current) {
      setLoading(true);
      getOrderAllData()
      .then((response) => {
        dispatch(setOrder(response?.order));
        dispatch(setOrderItem(response?.orderItem));
        dispatch(setMenu(response?.menu));
      })
      .finally(() => {
        setLoading(false)
      });
      isCalledRef.current = true;
    }
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (!searchText) return optyData;
    return optyData.filter(item =>
      item[OrderFieldData.SaunaNum]?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      item[OrderFieldData.FirstName]?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, optyData]);

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
      <CapsuleTabs>
        <CapsuleTabs.Tab title='Бронь' key='fruits'>
          <Table
            rowKey="uid"
            scroll={{ x: 395 }}
            title={() => <>
              <Row align="middle" gutter={15}>
                <Col flex="auto" style={{ maxWidth: '111px' }}>
                  <MenuComp/>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={() => {
                      setLoading(true);
                      getOrderAllData()
                      .then((response) => {
                        dispatch(setOrder(response?.order));
                        dispatch(setOrderItem(response?.orderItem));
                        dispatch(setMenu(response?.menu));
                      })
                      .finally(() => {
                        setLoading(false)
                        Toast.show({content: 'Договора обновлены!', duration: 3000 });
                      });
                    }}
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
            </>
            }
            columns={opportunityMeta}
            dataSource={filteredData
            .filter(x => x[OrderFieldData.Status] === OrderStatus.Reservation)
            .sort((a, b) =>
              new Date(a[OrderFieldData.OrderDt]).getTime() - new Date(b[OrderFieldData.OrderDt]).getTime()
            )}
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
            title={() => <>
              <Row align="middle" gutter={15}>
                <Col flex="auto" style={{ maxWidth: '111px' }}>
                  <MenuComp/>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={() => {
                      setLoading(true);
                      getOrderAllData()
                      .then((response) => {
                        dispatch(setOrder(response?.order));
                        dispatch(setOrderItem(response?.orderItem));
                        dispatch(setMenu(response?.menu));
                      })
                      .finally(() => {
                        setLoading(false)
                        Toast.show({content: 'Договора обновлены!', duration: 3000 });
                      });
                    }}
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
            </>
            }
            columns={opportunityMeta}
            dataSource={filteredData.filter((x)=> x[OrderFieldData.Status]===OrderStatus.Pay)}
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
