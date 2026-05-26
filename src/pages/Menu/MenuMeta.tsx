import { Table, Tag } from "antd";

export enum MenuFieldLabel {
  MenuNameLabel = 'Название',
  MenuTypeLabel = 'Тип',
  SalesLabel = 'Цена',
  PercentLabel = 'Процент',
  CountLabel = 'Колличество',
  PriceLabel = 'Себестоимость',
  AmountLabel = 'Сумма cебестоимости',
  SalesAmountLabel = 'Сумма продажи',
  StatusLabel = 'Статус',
  CommentLabel = 'Комментарий'
}

export enum MenuFieldData {
  Id = 'id',
  MenuName = 'menu_name',
  MenuType = 'menu_type',
  Sales = 'sales',
  Percent = 'percent',
  CreatedAt = 'created_at',
  Count = 'count',
  Price = 'price',
  Amount = 'amount',
  SalesAmount = 'sales_amount',
  Status = 'status',
  Comment = 'comment',
  TypeName = 'type_name',
}

export interface AddMenu {
  [MenuFieldData.MenuName]: string;
  [MenuFieldData.MenuType]: string;
  [MenuFieldData.Sales]: number;
  [MenuFieldData.Percent]: string;
  [MenuFieldData.Count]: string;
  [MenuFieldData.Price]: string;
  [MenuFieldData.Amount]: string;
  [MenuFieldData.SalesAmount]: string;
  [MenuFieldData.Status]: string;
  [MenuFieldData.Comment]: string;
  [MenuFieldData.TypeName]: string;
}

export type MenuType = {
  [MenuFieldData.Id]: string;
  [MenuFieldData.MenuName]: string;
  [MenuFieldData.MenuType]: string;
  [MenuFieldData.Sales]: number;
  [MenuFieldData.Percent]: string;
  [MenuFieldData.Count]: string;
  [MenuFieldData.Price]: string;
  [MenuFieldData.Amount]: string;
  [MenuFieldData.SalesAmount]: string;
  [MenuFieldData.Status]: string;
  [MenuFieldData.Comment]: string;
  [MenuFieldData.TypeName]: string;
};

export const menuMeta = [{
  title: MenuFieldLabel.MenuNameLabel,
  dataIndex: MenuFieldData.MenuName,
  key: MenuFieldData.MenuName,
  render: (value: string, record: any) => {
    return <>
      <Tag color={"#0881f2"}>{value && value.substring(0, 14)+'...'}</Tag>
      <Tag color={"#69930f"}>{record?.[MenuFieldData.TypeName]}</Tag>
    </>
  },
  width: 260,
}, {
    title: MenuFieldLabel.SalesLabel,
    dataIndex: MenuFieldData.Sales,
    key: MenuFieldData.Sales,
    width: 90,
      render: (value: string) => {
      const rawSum = Number(String(value).replace(/\s/g, "")).toLocaleString("ru-RU") || 0

      return (
        <Tag color={"red"}>{rawSum}</Tag>
      )
    },
  }, Table.EXPAND_COLUMN];