export enum ModalTitle {
  AllOpportunity = 'Все договора',
  AddExpense = 'Добавить расход',
  AddOpportunity = 'Добавить договор',
  AddPayment = 'Добавить платеж',
  Expenses = 'Расходы',
  OpportunityDetail = 'Детали договора',
  PaymentsMonthProgress = 'Платежи за текущий месяц',
  Contacts = 'Контакты',
  Payments = 'Платежи',
}

export enum FieldPlaceholder {
  OptyName = 'Введите номер квартиры или ФИО',
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
  Enter = 'Заехал',
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
export interface AddOpportunity {
  firstName: string;
  lastName: string;
  phone: string;
  product: string;
  apartNum: number;
  optyDate: Date;
  paymentDate: Date;
  payPhone?: string;
  comment: string;
}

export enum OpportunityFieldData {
  Id = 'ID',
  Contact = 'Contact',
  ApartNum = 'Description',
  Product = 'Product',
  Stage = 'Stage',
  Amount = 'Amount',
  Created = 'Created',
  OptyDate = 'OppoDate',
  PaymentDate = 'PaymentDate',
  ContactId = 'contact_id',
  FirstName = 'First Name',
  LastName = 'Last Name',
  PhoneOld = 'Phone',
  FullName = 'full_name',
  Phone = 'phone',
  PayPhone = 'PayPhone',
  Comment = 'Comment',
}

export type OpportunityType = {
  [OpportunityFieldData.Id]: string;
  [OpportunityFieldData.Contact]: string;
  [OpportunityFieldData.ApartNum]: string;
  [OpportunityFieldData.Product]: string;
  [OpportunityFieldData.Stage]: string;
  [OpportunityFieldData.Amount]: string;
  [OpportunityFieldData.Created]: string;
  [OpportunityFieldData.OptyDate]: string;
  [OpportunityFieldData.PaymentDate]: string;
  [OpportunityFieldData.ContactId]: string;
  [OpportunityFieldData.FirstName]: string;
  [OpportunityFieldData.LastName]: string;
  [OpportunityFieldData.PhoneOld]: string;
  [OpportunityFieldData.FullName]: string;
  [OpportunityFieldData.Phone]: string;
};

export enum OpportunityField {
  LastNameLabel = 'Фамилия',
  FisrtNameLabel = 'Имя',
  PhoneLabel = 'Контактный телефон',
  DepositAmountLabel = 'Сумма депозита',
  PayTypeLabel = 'Предоплата',
  OptyDateLabel = 'Дата договора',
  PaymentDateLabel = 'Дата оплаты',
  PayDateLabel = 'Дата платежа',
  SaunaNumLabel = 'Номер кабинки',
  AmountLabel = 'Сумма',
  FullNameLabel = 'ФИО',
  OptyAmountLabel = 'Сумма договора',
  OptyNameLabel = '№ / Статус / Дата / Сумма',
  StorageNameLabel = '№ / Статус / Дата',
  PayPhoneFlgLabel = 'Предоплата на Kaspi',
  PayPhoneLabel = 'Телефон для платежей',
  CommentLabel = 'Информация о жильцах',
  CommentStorageLabel = 'Перечень товаров',
  PeriodLabel = 'Срок хранения',
  StorageNumLabel = 'Номер склада',

  PayType = 'payType',
  LastName = 'lastName',
  FisrtName = 'firstName',
  Phone = 'phone',
  DepositAmount = 'depositAmount',
  SaunaNum = 'saunaNum',
  ApartNum = 'apartNum',
  Product = 'product',
  OptyDate = 'optyDate',
  PaymentDate = 'paymentDate',
  Comment = 'comment',
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

export enum PaymentField {
  ProductLabel = 'Продукт',
  AmountLabel = 'Сумма',
  OptyNameLabel = 'Договор',
  PaymnetTypeLabel = 'Получатель',
  PaymentDateLabel = 'Дата платежа',
  CommentLabel = 'Комментарий',

  Product = 'product',
  Amount = 'amount',
  OptyName = 'optyName',
  PaymentType = 'paymentType',
  OptyId = 'optyId',
  ContactId = 'conId',
  PaymentDate = 'paymentDate',
  Comment = 'comment',
  ApartNum = 'apartNum',
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
  optyId: string;
  PaymentDate?: string;
  Comment?: string;
  PayPhone?: string;
}
