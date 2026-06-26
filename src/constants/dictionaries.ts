import { MenuProps } from 'antd';

export enum ExpenseType {
  Expense = 'Расход',
  Salary = 'Зарплата',
  Procurement = 'Закупки',
  ServiceUtilities = 'Комм. усл.',
  Other = 'Другое',
  Rent = 'Аренда',
  ReturnDeposit = 'Возвр. депоз.',
  Taxes = 'Налоги',
}

export const EXPENSE_TYPE = [
  { value: ExpenseType.Procurement, label: ExpenseType.Procurement },
  { value: ExpenseType.Expense, label: ExpenseType.Expense },
  { value: ExpenseType.Salary, label: ExpenseType.Salary },
  { value: ExpenseType.Rent, label: ExpenseType.Rent },
  { value: ExpenseType.ServiceUtilities, label: ExpenseType.ServiceUtilities },
  { value: ExpenseType.ReturnDeposit, label: ExpenseType.ReturnDeposit },
  { value: ExpenseType.Taxes, label: ExpenseType.Taxes },
];

export enum AppNameValue {
  Grafit = 'Grafit',
  Pavlenko = 'Apart',
  Alatau = 'Alatau',
}

export enum AppName {
  Grafit = 'Графит',
  Pavlenko = 'Павленко',
  Alatau = 'Алатау',
}

export const APP_NAME = [
  { value: AppNameValue.Grafit, label: AppName.Grafit },
  { value: AppNameValue.Pavlenko, label: AppName.Pavlenko },
  { value: AppNameValue.Alatau, label: AppName.Alatau },
];

export enum MenuTypeValue {
  BathSupplies = 'Банные принадлежности',
  Kitchen = 'Кухня',
  Bar = 'Бар',
  Sauna = 'Баня',
}

export enum MenuType {
  BathSupplies = 'Bath supplies',
  Kitchen = 'Kitchen',
  Bar = 'Bar',
  Sauna = 'Sauna',
}

export const MENU_TYPE = [
  { value: MenuType.Sauna, label: MenuTypeValue.Sauna },
  { value: MenuType.Bar, label: MenuTypeValue.Bar },
  { value: MenuType.Kitchen, label: MenuTypeValue.Kitchen },
  { value: MenuType.BathSupplies, label: MenuTypeValue.BathSupplies },
];

export enum Product {
  SaunaOne = 7500,
  SaunaTwo = 7500,
  SaunaThree = 5000,
  SaunaFour = 5000,

  SaunaOneValue = 'Каб. 1',
  SaunaTwoValue = 'Каб. 2',
  SaunaThreeValue = 'Каб. 3',
  SaunaFourValue = 'Каб. 4',
}

export const PRODUCT_MAP = {
  '1': 'Каб. 1',
  '2': 'Каб. 2',
  '3': 'Каб. 3',
  '4': 'Каб. 4',
};

export const PRODUCT_PRICE_MAP = {
  '1': Product.SaunaOne,
  '2': Product.SaunaTwo,
  '3': Product.SaunaThree,
  '4': Product.SaunaFour,
};

export const PRODUCT = [
  {
    value: '1',
    label: Product.SaunaOneValue,
    optyFlg: false,
    payFlg: false,
    storageFlg: false,
  },
  {
    value: '2',
    label: Product.SaunaTwoValue,
    optyFlg: true,
    payFlg: true,
    storageFlg: false,
  },
  {
    value: '3',
    label: Product.SaunaThreeValue,
    optyFlg: true,
    payFlg: true,
    storageFlg: false,
  },
  {
    value: '4',
    label: Product.SaunaFourValue,
    optyFlg: false,
    payFlg: true,
    storageFlg: false,
  },
];

export enum Payment {
  GoldAN = 'Gold А',
  GoldVK = 'Gold V',
  Cash = 'Налом',
  No = 'Нет',
}

export const PAYMENT_TYPE = [
  { value: Payment.GoldAN, label: Payment.GoldAN },
  { value: Payment.GoldVK, label: Payment.GoldVK },
  { value: Payment.Cash, label: Payment.Cash },
  { value: Payment.No, label: Payment.No },
];

export enum Recommendation {
  Frieds = 'Друзья',
  Hamzat = 'Хамзат',
  TwoGis = '2gis',
  Instagram = 'Inst',
}

export const RECOMMENDATION_TYPE = [
  { value: Recommendation.Frieds, label: Recommendation.Frieds },
  { value: Recommendation.Hamzat, label: Recommendation.Hamzat },
  { value: Recommendation.TwoGis, label: Recommendation.TwoGis },
  { value: Recommendation.Instagram, label: Recommendation.Instagram },
];

export const ItemsReport: MenuProps['items'] = [
  { label: 'Линия', key: 'line' },
];

export enum STEP_STATUS {
  Process = 'process',
  Finish = 'finish',
  Error = 'error',
}

export enum BUTTON_TEXT {
  Ok = 'OK',
  Cancel = 'Отмена',
  Add = 'Добавить',
  Save = 'Сохранить',
  Edit = 'Изменить',
}

export enum MODAL_TEXT {
  OptyCloseText = 'Подтвердите оплату брони!',
  DeleteOrderItemText = 'Подтвердите удаление позиции!',
  NotFound = 'Не найдено',
  UpdateOptyPaymentDate = 'Подтвердите изменение даты платежа',
}
