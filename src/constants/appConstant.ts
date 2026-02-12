export enum ModalTitle {
  AllOpportunity = 'Все договора',
  AddExpense = 'Добавить расход',
  AddOpportunity = 'Добавить договор',
  AddPayment = 'Добавить платеж',
  Expenses = 'Расходы',
  OrderDetail = 'Детали брони',
  PaymentsMonthProgress = 'Платежи за текущий месяц',
  Contacts = 'Контакты',
  Payments = 'Платежи',
}

export enum FieldPlaceholder {
  MenuName = 'Введите код товара или название товара',
  Date = 'Введите дату',
  Comment = 'Введите комментарий',
  ApartNum = 'Введите номер квартиры',
  SearchApartNum = 'Поиск по номеру квартиры...',
  EnterUsername = 'Введите имя пользователя...',
  EnterPassword = 'Введите пароль...',
  EnterContactData = 'Введите данные контакта...',
}

export enum FieldFormat {
  Date = 'DD.MM.YYYY',
  DateEN = 'MM/DD/YYYY',
}

export enum Status {
  Reservation = 'Бронь',
}

export enum Stage {
  Signed = 'Заключили',
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const FieldRules = {
  Required: { required: true, message: 'Заполните поле!' },
  ApartNum: {
    type: 'number',
    min: 11,
    max: 39,
    message: 'Введите число с 11 по 39',
  },
  StorageNum: {
    type: 'number',
    min: 1,
    max: 12,
    message: 'Введите число с 1 по 12',
  },
  PhoneNum: {
    pattern: /^\+7\d{10}$/,
    message: 'Формат номера +7 000 000 00 00',
  },
  PhoneFormat: {
    pattern: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
    message: 'Формат номера +7 (XXX) XXX-XX-XX',
  },
  ClientName: { pattern: /^[A-Za-zА-Яа-яЁё]+$/, message: 'Только буквы!' },
  ExpenseAmount: {
    type: 'number',
    min: 0,
    max: 5000000,
    message: 'Введите сумму от 0 до 5000000',
  },
  PaymentAmount: {
    type: 'number',
    min: 0,
    max: 500000,
    message: 'Введите сумму от 0 до 500 000',
  },
} as const;

export const FieldStyle = {
  InputStyle: {
    height: '36px',
    backgroundColor: '#faf7eeff',
    width: '100%',
  },
  AreaStyle: {
    backgroundColor: '#faf7eeff',
  },
};

// Договора
export interface AddOrder {
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  saunaNum: string;
  prepaySource: string;
  prepayAmount: number;
  createBy?: string;
  orderDate: Date;
  comment: string;
  recommendation: string;
  startTime: string;
  endTime: string;
  price: number;
  peopleCount: number;
}

export interface AddOrderItem {
  itemName: string;
  itemDt: Date;
  menuId: string;
  sales: number;
  amount: number;
  price: number;
  itemCount: number;
  createdBy: string;
}

export enum OrderFieldData {
  Id = 'id',
  ContactId = 'con_id',
  LastName = 'last_name',
  FirstName = 'first_name',
  Phone = 'phone',
  Status = 'status',
  PrepaySource = 'prepay_source',
  PrepayAmount = 'prepay_amount',
  SaunaNum = 'sauna_num',
  StartTime = 'start_time',
  EndTime = 'end_time',
  Comment = 'comment',
  OrderDt = 'order_dt',
  CreatedBy = 'create_by',
  Price = 'price',
  PeopleCount = 'people_count',
}

export type OrderType = {
  [OrderFieldData.Id]: string;
  [OrderFieldData.ContactId]: string;
  [OrderFieldData.LastName]: string;
  [OrderFieldData.FirstName]: string;
  [OrderFieldData.Phone]: string;
  [OrderFieldData.Status]: string;
  [OrderFieldData.PrepaySource]: string;
  [OrderFieldData.PrepayAmount]: string;
  [OrderFieldData.SaunaNum]: string;
  [OrderFieldData.StartTime]: string;
  [OrderFieldData.EndTime]: string;
  [OrderFieldData.Comment]: string;
  [OrderFieldData.OrderDt]: string;
  [OrderFieldData.CreatedBy]: string;
  [OrderFieldData.Price]: string;
  [OrderFieldData.PeopleCount]: string;
};

export enum OrderItemFieldData {
  Id = 'id',
  ItemName = 'item_name',
  ItemDt = 'item_dt',
  MenuId = 'menu_id',
  Amount = 'amount',
  ItemCount = 'item_count',
  Sum = 'sum',
}

export type OrderItemType = {
  [OrderItemFieldData.Id]: string;
  [OrderItemFieldData.ItemName]: string;
  [OrderItemFieldData.ItemDt]: string;
  [OrderItemFieldData.MenuId]: string;
  [OrderItemFieldData.Amount]: string;
  [OrderItemFieldData.ItemCount]: string;
  [OrderItemFieldData.Sum]: string;
};

export enum MenuFieldData {
  Id = 'id',
  MenuName = 'menu_name',
  MenuType = 'menu_type',
  Sales = 'sales',
  Percent = 'pecent',
  MenuDt = 'menu_dt',
  Count = 'count',
  Price = 'price',
  Amount = 'amount',
  SalesAmount = 'sales_amount',
  MenuStatus = 'menu_status',
  Comment = 'comment',
}

export type MenuType = {
  [MenuFieldData.Id]: string;
  [MenuFieldData.MenuName]: string;
  [MenuFieldData.MenuType]: string;
  [MenuFieldData.Sales]: number;
  [MenuFieldData.Percent]: number;
  [MenuFieldData.MenuDt]: string;
  [MenuFieldData.Count]: number;
  [MenuFieldData.Price]: number;
  [MenuFieldData.Amount]: number;
  [MenuFieldData.SalesAmount]: number;
  [MenuFieldData.MenuStatus]: string;
  [MenuFieldData.Comment]: string;
};

export enum OpportunityField {
  LastNameLabel = 'Фамилия',
  FisrtNameLabel = 'Имя',
  PhoneLabel = 'Контактный телефон',
  PrepayAmountLabel = 'Сумма предоплаты',
  PrepaySourceLabel = 'Предоплата',
  OptyDateLabel = 'Дата брони',
  SaunaNumLabel = 'Номер кабинки',
  AmountLabel = 'Сумма',
  FullNameLabel = 'ФИО',
  CommentLabel = 'Комментарий',
  StartTimeLabel = 'Время начала',
  EndTimeLabel = 'Время окончания',
  RecommendationLabel = 'От кого',
  TimePeopleCountLabel = 'Время/Гости',

  SaunaPriceLabel = 'Баня/Цена',
  OrderNameLabel = '№ / Статус / Время',
  OrderDateLabel = 'Дата брони',

  PrepaySource = 'prepaySource',
  LastName = 'lastName',
  FisrtName = 'firstName',
  Phone = 'phone',
  PrepayAmount = 'prepayAmount',
  SaunaNum = 'saunaNum',
  Comment = 'comment',
  StartTime = 'startTime',
  EndTime = 'endTime',
  Recommendation = 'recommendation',
  OrderDate = 'orderDate',
}

// Платежи
export interface AddPayment {
  optyId: string;
  amount: number;
  conId: string;
  product: string;
  paymentType: string;
  paymentDate: Date;
  comment?: string;
  apartNum?: string;
}

export enum OrderItemField {
  ItemNameLabel = 'Товар',
  SalesLabel = 'Цена',
  SumtLabel = 'Сумма',
  CountLabel = 'Количество',
  ItemDateLabel = 'Дата заказа',
  PriceLabel = 'Цена закупа',

  ItemId = 'id',
  MenuId = 'menuId',
  ItemName = 'itemName',
  Sales = 'sales',
  Price = 'price',
  Count = 'itemCount',
  Sum = 'sum',
  ItemDate = 'itemDate',
}

// Расходы
export interface AddExpense {
  optyId: string;
  expenseType: string;
  amount: number;
  comment: string;
  paymentType: string;
  apartNum: string;
}

export interface OptionType {
  optyId: string;
  value: string;
  label: string;
  apartNum: string;
}

export enum ExpenseField {
  ProductLabel = 'Продукт',
  AmountLabel = 'Сумма',
  OptyNameLabel = 'Договор',
  ExpenseTypeLabel = 'Тип',
  ApartNumLabel = 'Номер квартиры',
  PaymnetTypeLabel = 'Получатель',
  CommentLabel = 'Комментарий',
  ExpenseLabel = 'Тип / № / Дата расхода',

  Product = 'product',
  Amount = 'amount',
  OptyName = 'optyName',
  ExpenseType = 'expenseType',
  ApartNum = 'apartNum',
  PaymentType = 'paymentType',
  Comment = 'comment',
  OptyId = 'optyId',
  ContactId = 'conId',
}

export enum ExpenseFieldData {
  Id = 'ID',
  Contact = 'Contact',
  Company = 'Company',
  Type = 'Type',
  ExpenseDate = 'CreatedDt',
  CreatedBy = 'Author',
  Sum = 'Sum',
  Comment = 'Comment',
  ApartNum = 'AppartNum',
  PaymentType = 'PaymentType',
  Invoice = 'Invoice',
  Processed = 'Processed',
}

export type ExpenseType = {
  [ExpenseFieldData.Id]: string;
  [ExpenseFieldData.Contact]: string;
  [ExpenseFieldData.Company]: string;
  [ExpenseFieldData.Type]: string;
  [ExpenseFieldData.ExpenseDate]: string;
  [ExpenseFieldData.CreatedBy]: string;
  [ExpenseFieldData.Sum]: string;
  [ExpenseFieldData.Comment]: string;
  [ExpenseFieldData.ApartNum]: string;
  [ExpenseFieldData.PaymentType]: string;
  [ExpenseFieldData.Invoice]: string;
  [ExpenseFieldData.Processed]: string;
};

export type FieldType = {
  username?: string;
  password?: string;
};

export interface LoginData {
  username: string;
  password: string;
}

export const PaymentTypes = ['Аренда', 'Депозит', 'Депозит возврат', 'Склад'];

export const ExpensesTypes = ['Расход', 'Комм. Алатау', 'Комм. Павленко'];

export enum ContactFieldData {
  Id = 'ID',
  FirstName = 'First Name',
  LastName = 'Last Name',
  ApartNum = 'Title',
  Type = 'Type',
  Phone = 'Phone',
  Description = 'Description',
  Status = 'Status',
}

export type ContactType = {
  [ContactFieldData.Id]: string;
  [ContactFieldData.FirstName]: string;
  [ContactFieldData.LastName]: string;
  [ContactFieldData.ApartNum]: string;
  [ContactFieldData.Type]: string;
  [ContactFieldData.Phone]: string;
  [ContactFieldData.Description]: string;
  [ContactFieldData.Status]: string;
};

export interface AddContact {
  firstName: string;
  lastName: string;
  phone: string;
  type: string;
  description: string;
}

export enum ContactField {
  ContactLabel = 'Услуга / ФИО / Описание',
  LastNameLabel = 'Фамилия',
  FirstNameLabel = 'Имя',
  PhoneLabel = 'Контактный телефон',
  TypeLabel = 'Услуга',
  DescriptionLabel = 'Описание',

  LastName = 'lastName',
  FirstName = 'firstName',
  Phone = 'phone',
  Type = 'type',
  Description = 'description',
}

export enum PaymentsFieldData {
  Id = 'ID',
  OptyId = 'Opportunity',
  ContactId = 'Contact',
  Amount = 'Amount',
  Created = 'Date/Time',
  PaymentType = 'Notes',
  Product = 'Product',
}

export type PaymentsType = {
  [PaymentsFieldData.Id]: string;
  [PaymentsFieldData.OptyId]: string;
  [PaymentsFieldData.ContactId]: string;
  [PaymentsFieldData.Product]: string;
  [PaymentsFieldData.PaymentType]: string;
  [PaymentsFieldData.Amount]: string;
  [PaymentsFieldData.Created]: string;
};

export enum PaymentsField {
  PaymentsLabel = '№ / Дата / Сумма / ФИО',

  Payment = 'payment',
}

export interface UpdateOpty {
  orderId: string;
  PaymentDate?: string;
  Comment?: string;
  PayPhone?: string;
}
