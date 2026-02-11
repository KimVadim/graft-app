import { Row, Space, Table, Tag, Typography } from "antd";
import { ContactField, ContactFieldData, ExpenseField, ExpenseFieldData, OpportunityField, OpportunityFieldData, PaymentsField, PaymentsFieldData, Stage } from "../constants/appConstant.ts"
import { RootState } from "../store.ts";
import { useSelector } from "react-redux";
import { PRODUCT_MAP, productMap } from "../constants/dictionaries.ts";

export type ProductKey = keyof typeof PRODUCT_MAP;

export const opportunityMeta = [{
  title: OpportunityField.OrderNameLabel,
  dataIndex: OpportunityFieldData.Status,
  key: OpportunityFieldData.Status,
  render: (status: String, record: any) => {
  return (
    <>
      <Tag color={"#2db7f5"}>
        {PRODUCT_MAP[record?.[OpportunityFieldData.SaunaNum] as ProductKey]}
      </Tag>

      <Tag color={status === Stage.Signed ? "green" : "red"}>
        {status}
      </Tag>

      <Tag color="blue">
        {`${record?.[OpportunityFieldData.StartTime]}-${record?.[OpportunityFieldData.EndTime]}`}
      </Tag>
    </>
  );
},
  width: 265,
  }, {
    title: OpportunityField.FullNameLabel,
    dataIndex: OpportunityFieldData.FirstName,
    key: OpportunityFieldData.FirstName,
    ellipsis: true,
    render: (full_name: String, record: any) => {
      return <><strong className="full-name">{full_name}</strong><br/></>
  },
}];


export const expenseMeta = [{
  title: ExpenseField.ExpenseLabel,
  dataIndex: ExpenseFieldData.ApartNum,
  key: ExpenseFieldData.ApartNum,
  render: (status: String, record: any) => {
    const date = new Date(record?.[ExpenseFieldData.ExpenseDate]);
    const apartNum = record?.[ExpenseFieldData.ApartNum];

    return <>
      <Tag color={"#2db7f5"}>{record?.[ExpenseFieldData.Type]}</Tag>
      <Tag color="blue">
        {`${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}.${date.getFullYear().toString().slice(-2)}`}
      </Tag>
      {apartNum && <Tag color={"red"}>{apartNum}</Tag>}
    </>
  },
  width: 260,
}, {
    title: ExpenseField.AmountLabel,
    dataIndex: ExpenseFieldData.Sum,
    key: ExpenseField.Amount,
    width: 90,
      render: (status: string, record: any) => {
      const rawSum = Number(record?.[ExpenseFieldData.Sum]) || 0
      const expenseSum = rawSum.toLocaleString("ru-RU")

      return (
        <Tag color={rawSum > 0 ? "green" : "red"}>
          {expenseSum}
        </Tag>
      )
    },
  }, Table.EXPAND_COLUMN];

export const contactMeta = [
  {
    title: ContactField.ContactLabel,
    dataIndex: ContactFieldData.FirstName,
    key: ContactFieldData.FirstName,
    render: (status: string, record: any) => {
      return (
        <>
          <Tag color="#2db7f5">{record?.[ContactFieldData.Type]}</Tag>
          <Tag color="blue">{record?.[ContactFieldData.FirstName]}</Tag>
        </>
      );
    },
    width: 200,
  },
  {
    key: 'action',
    width: 30,
    render: (_: any, record: any) => (
      <Space size="middle">
        <a
          className="phone-link"
          href={`tel:${record?.[ContactFieldData.Phone]}`}
          style={{ textDecoration: "none", color: "blue" }}
        >
          Позвонить
        </a>
      </Space>
    ),
  },
  Table.EXPAND_COLUMN,
];


const PaymentCell = ({ status, record }: { status: string; record: any }) => {
  const date = new Date(record?.[PaymentsFieldData.Created]);
  const optyData = useSelector((state: RootState) => state.order.order);
  const filteredOpty = optyData.filter((x) => x[OpportunityFieldData.Id] === record[PaymentsFieldData.OptyId]);
  const { Text } = Typography;
  return (
    <>
      <Row wrap={false}>
        <Tag color="#2db7f5">{filteredOpty?.[0]?.[OpportunityFieldData.SaunaNum] || "N/A"}</Tag>
        <Tag color="blue">{date.toLocaleDateString("ru-RU")}</Tag>
        <Tag color="green">{productMap[record?.[PaymentsFieldData.Product] as keyof typeof productMap]}</Tag>
        <Tag color="red">{Math.floor(Number(record?.[PaymentsFieldData.Amount])/1000)?.toLocaleString("ru-RU")}</Tag>
        <Text type="secondary">
          {(() => {
            const fullName = filteredOpty?.[0]?.[OpportunityFieldData.FirstName];
            if (!fullName) return '';

            const trimmed = fullName.trim();
            const spaceIndex = trimmed.indexOf(' ');

            if (spaceIndex === -1) return trimmed;

            const firstName = trimmed.substring(0, spaceIndex);
            const lastNameFirstChar = trimmed.substring(spaceIndex + 1, spaceIndex + 2);

            return `${firstName} ${lastNameFirstChar}`;
          })()}
        </Text>
      </Row>
    </>
  );
};

export const paymentsMeta = [{
  title: PaymentsField.PaymentsLabel,
  dataIndex: PaymentsField.Payment,
  key: PaymentsField.Payment,
  render: (status: string, record: any) => <PaymentCell status={status} record={record} />,
  width: 235,
}];