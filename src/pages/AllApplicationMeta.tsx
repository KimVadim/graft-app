import { Space, Table, Tag } from "antd";
import { ContactField, ContactFieldData, ExpenseField, ExpenseFieldData, OrderField, OrderFieldData, OrderItemField, OrderItemFieldData, Stage } from "../constants/appConstant.ts"
import { PRODUCT_MAP } from "../constants/dictionaries.ts";
import dayjs from "dayjs";

export type ProductKey = keyof typeof PRODUCT_MAP;

export const opportunityMeta = [{
  title: OrderField.OrderNameLabel,
  dataIndex: OrderFieldData.Status,
  key: OrderFieldData.Status,
  render: (status: String, record: any) => {
  return (
      <>
        <Tag color={"#2db7f5"}>
          {PRODUCT_MAP[record?.[OrderFieldData.SaunaNum] as ProductKey]}
        </Tag>

        <Tag color={status === Stage.Signed ? "green" : "red"}>
          {status}
        </Tag>
        <Tag color={"green"}>
          {dayjs(record?.[OrderFieldData.OrderDt]).format("DD.MM.YY")}
        </Tag>
        <Tag color="blue">
          {`${record?.[OrderFieldData.StartTime]}-${record?.[OrderFieldData.EndTime]}`}
        </Tag>
      </>
    );
  },
  width: 310,
  }, {
    title: OrderField.FullNameLabel,
    dataIndex: OrderFieldData.FirstName,
    key: OrderFieldData.FirstName,
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

export const orderItemMeta = [
  {
    title: OrderItemField.ItemNameLabel,
    dataIndex: OrderItemFieldData.ItemName,
    key: OrderItemFieldData.ItemName,
    width: 40,
  }, {
    title: 'Кол.',
    dataIndex: 'item_count',
    key: 'item_count',
    width: 30,
  }, {
    title: 'Цена',
    dataIndex: 'sales',
    key: 'sales',
    width: 30,
  }, {
    title: 'Сумма',
    dataIndex: 'amount',
    key: 'amount',
    width: 30,
  }
];