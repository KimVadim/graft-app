import { MenuProps } from 'antd';

export enum ExpenseType {
  Deposit = 'Депозит',
  Return = 'Возврат',
  Expense = 'Расход',
  Income = 'Пополнение',
  Removal = 'Снятие',
  TenantUtilities = 'Комм. Жильцы',
  AlatauUtilities = 'Комм. Алатау',
  PavlenkoUtilities = 'Комм. Павленко',
  Other = 'Другое',
}

export const EXPENSE_TYPE = [
  { value: ExpenseType.Expense, label: ExpenseType.Expense },
  { value: ExpenseType.Income, label: ExpenseType.Income },
  { value: ExpenseType.Removal, label: ExpenseType.Removal },
  { value: ExpenseType.TenantUtilities, label: ExpenseType.TenantUtilities },
  { value: ExpenseType.AlatauUtilities, label: ExpenseType.AlatauUtilities },
  {
    value: ExpenseType.PavlenkoUtilities,
    label: ExpenseType.PavlenkoUtilities,
  },
  { value: ExpenseType.Other, label: ExpenseType.Other },
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
  SaunaOne: 'Каб. 1',
  SaunaTwo: 'Каб. 2',
  SaunaThree: 'Каб. 3',
  SaunaFour: 'Каб. 4',
};

export const PRODUCT_PRICE_MAP = {
  SaunaOne: Product.SaunaOne,
  SaunaTwo: Product.SaunaTwo,
  SaunaThree: Product.SaunaThree,
  SaunaFour: Product.SaunaFour,
};

export const PRODUCT = [
  {
    value: 'SaunaOne',
    label: Product.SaunaOneValue,
    optyFlg: false,
    payFlg: false,
    storageFlg: false,
  },
  {
    value: 'SaunaTwo',
    label: Product.SaunaTwoValue,
    optyFlg: true,
    payFlg: true,
    storageFlg: false,
  },
  {
    value: 'SaunaThree',
    label: Product.SaunaThreeValue,
    optyFlg: true,
    payFlg: true,
    storageFlg: false,
  },
  {
    value: 'SaunaFour',
    label: Product.SaunaFourValue,
    optyFlg: false,
    payFlg: true,
    storageFlg: false,
  },
];

export const productMap = {
  [Product.SaunaFour]: Product.SaunaFourValue,
  [Product.SaunaTwo]: Product.SaunaTwoValue,
};

export enum Payment {
  GoldAN = 'Gold А',
  GoldVK = 'Gold V',
  Cash = 'Налом',
  No = ' Нет',
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
}

export enum MODAL_TEXT {
  OptyCloseText = 'Подтвердите закрытие договора!',
  NotFound = 'Не найдено',
  UpdateOptyPaymentDate = 'Подтвердите изменение даты платежа',
}
