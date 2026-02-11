import { Button, Spin, Table, Row, Col, Input } from "antd";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { OpportunityModal } from "../../src/components/OpportunityModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getOrder, getSheetDataParam } from "../service/appServiceBackend.ts";
import { ModalTitle, OpportunityFieldData, OrderType } from "../constants/appConstant.ts";
import '../App.css';
import { Toast } from "antd-mobile";
import { MenuComp } from "../components/Menu.tsx";
import { PaymentProgreesBar } from "../components/PaymentProgressBar.tsx";
import { opportunityMeta } from "./AllApplicationMeta.tsx";
import { setOrder } from "../slices/orderSlice.ts";

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
      getOrder()
      .then((response) => {
        dispatch(setOrder(response?.order));
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
      item[OpportunityFieldData.SaunaNum]?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      item[OpportunityFieldData.FirstName]?.toString().toLowerCase().includes(searchText.toLowerCase())
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
        <Table
          rowKey="uid"
          scroll={{ x: 395 }}
          title={() => <>
            <Row align="middle" gutter={15}>
              <Col flex="auto" style={{ maxWidth: '111px' }}>
                <MenuComp/>
              </Col>
              <Col>
                <strong>{ModalTitle.AllOpportunity}</strong>
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
            <Row align="middle" gutter={15}>
              <PaymentProgreesBar
                setIsPaymentModal={setIsModalPayment}
                isPaymentModal={isModalPayment}
              />
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    setLoading(true);
                    getSheetDataParam('Renter')
                    .then((response) => {
                      dispatch(setOrder(response?.opportunities));
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
            </Row>
          </>
          }
          columns={opportunityMeta}
          dataSource={filteredData}
          size='middle'
          pagination={{
            position: ['bottomCenter'],
            pageSize: 20
          }}
          onRow={(record) => ({
            onClick: () => actions.handleRowClick(record),
          })}
        />
      </Spin>
      <OpportunityModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        record={selectedRecord}
      />
    </>
  );
}
