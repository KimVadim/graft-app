import { Table, Tag } from "antd";

export enum ExpenseFieldLabel {
  ProductLabel = 'Продукт',
  AmountLabel = 'Сумма',
  OptyNameLabel = 'Договор',
  ExpenseTypeLabel = 'Тип',
  AppNameLabel = 'Назначение',
  ApartNumLabel = 'Номер квартиры',
  SourceLabel = 'Счёт',
  CommentLabel = 'Комментарий',
  ExpenseLabel = 'Тип / Дата расхода',
  ExpenseNameLabel = 'Название',
  ExpenseDateLabel = 'Дата расхода',
}

export enum ExpenseFieldData {
  Id = 'id',
  ExpenseDate = 'created_at',
  Source = 'source',
  Comment = 'comment',
  Amount = 'amount',
  Type = 'type',
  ExpenseName = 'expense_name',
  AppName = 'app_name',
}

export interface AddExpense {
  [ExpenseFieldData.ExpenseName]: string;
  [ExpenseFieldData.Type]: string;
  [ExpenseFieldData.Amount]: number;
  [ExpenseFieldData.Comment]: string;
  [ExpenseFieldData.Source]: string;
  [ExpenseFieldData.ExpenseDate]: string;
  [ExpenseFieldData.AppName]: string;
}

export type ExpenseType = {
  [ExpenseFieldData.Id]: string;
  [ExpenseFieldData.Type]: string;
  [ExpenseFieldData.ExpenseDate]: string;
  [ExpenseFieldData.Comment]: string;
  [ExpenseFieldData.Amount]: string;
  [ExpenseFieldData.ExpenseName]: string;
  [ExpenseFieldData.AppName]: string;
};

export const expenseMeta = [{
  title: ExpenseFieldLabel.ExpenseLabel,
  dataIndex: ExpenseFieldData.Type,
  key: ExpenseFieldData.Type,
  render: (value: string, record: any) => {
    const date = new Date(record?.[ExpenseFieldData.ExpenseDate]);

    return <>
      <Tag color={"#096bec"}>{record?.[ExpenseFieldData.AppName]}</Tag>
      <Tag color={"#69930f"}>{value}</Tag>
      <Tag color="blue">
        {`${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}.${date.getFullYear().toString().slice(-2)}`}
      </Tag>
    </>
  },
  width: 265,
}, {
    title: ExpenseFieldLabel.AmountLabel,
    dataIndex: ExpenseFieldData.Amount,
    key: ExpenseFieldData.Amount,
    width: 90,
      render: (value: string) => {
      const rawSum = Number(String(value).replace(/\s/g, "")).toLocaleString("ru-RU") || 0

      return (
        <Tag color={"red"}>{rawSum}</Tag>
      )
    },
  }, Table.EXPAND_COLUMN];