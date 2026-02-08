import { Col, Row, Select, Table } from "antd";
import React, { useState } from "react";
import { RootState } from "../store.ts";
import { useSelector } from "react-redux";
import { paymentsMeta } from "./AllApplicationMeta.tsx";
import { ModalTitle, PaymentsFieldData, PaymentsType } from "../constants/appConstant.ts";
import { PaymentProgreesBar } from "../components/PaymentProgressBar.tsx";
import { MenuComp } from "../components/Menu.tsx";

const { Option } = Select;

export const Payments: React.FC = () => {
  const date = new Date();
  const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string | null>(month);
  const [isModalPayment, setIsModalPayment] = useState(false);
  const paymentsData = useSelector((state: RootState) => state.quote.quote) as unknown as PaymentsType[];
  const months = Array.from(
    new Set(
      paymentsData.map((item) => {
        const date = new Date(item[PaymentsFieldData.Created]);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}`;
      }).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    )
  );

  const filteredData = selectedMonth
  ? paymentsData.filter((item) => {
      const date = new Date(item[PaymentsFieldData.Created]);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formatted = `${year}-${month}`;
      return formatted === selectedMonth;
    })
  : paymentsData;

  return (
    <div style={{ padding: 5, display: 'flex', justifyContent: 'center'}}>
      <Row align="middle" gutter={15} >
        <Col flex="auto" style={{ maxWidth: "111px" }}>
          <MenuComp/>
        </Col>
        <Col>
          <strong>{ModalTitle.Payments}</strong>
        </Col>
        <Col>
          <Select
            placeholder="Фильтр по месяцу"
            style={{ width: 200 }}
            allowClear
            onChange={(value) => setSelectedMonth(value)}
            value={selectedMonth}
          >
            {months.map((month) => (
              <Option key={String(month)} value={String(month)}>
                {month}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
        <Row align="middle" gutter={15}>
          <Col flex="auto" style={{ maxWidth: '500px', marginTop: '10px', marginBottom: '10px' }}>
            <PaymentProgreesBar
              setIsPaymentModal={setIsModalPayment}
              isPaymentModal={isModalPayment}
            />
          </Col>
        </Row>
      <Table
        rowKey="ID"
        scroll={{ x: 395 }}
        columns={paymentsMeta}
          dataSource={[...filteredData].sort(
          (a, b) =>
            new Date(b[PaymentsFieldData.Created]).getTime() -
            new Date(a[PaymentsFieldData.Created]).getTime()
        )}
        size="middle"
        pagination={{
          position: ["bottomCenter"],
          pageSize: 50,
        }}
      />
    </div>
  );
};