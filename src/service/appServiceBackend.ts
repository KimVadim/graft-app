import { AppDispatch } from '../store.ts';
import dayjs from 'dayjs';
import axios from 'axios';
import {
  AddExpense,
  AddOrder,
  AddPayment,
  FieldFormat,
  Status,
  UpdateOpty,
} from '../constants/appConstant.ts';
import { setMonthPayments } from '../slices/monthPaymentsSlice.ts';
import { setExpense } from '../slices/expenseSlice.ts';
import { setAccessGroup } from '../slices/accessGroupSlice.ts';

export const API_URL = 'https://palvenko-production.up.railway.app';

export const endpoints = {
  ORDER: `${API_URL}/endpoints/fs/order`,
  OPPORTUNITY: `${API_URL}/endpoints/opty`,
  LOGIN: `${API_URL}/endpoints/login`,
  PAYMENT: `${API_URL}/endpoints/payment`,
  EXPENSE: `${API_URL}/endpoints/expense`,
  CLOSE_OPTY: `${API_URL}/endpoints/close-opty`,
  MONTH_PAYMENT: `${API_URL}/endpoints/month-payments`,
  EXPENSES: `${API_URL}/endpoints/expenses`,
  CONTACT: `${API_URL}/endpoints/contact`,
  UPDATE_OPTY: `${API_URL}/endpoints/update-opty`,
  ACCESS_GROUP: `${API_URL}/endpoints/access-group`,
};

export const getSheetDataParam = async (type: string) => {
  try {
    const { data } = await axios.get(endpoints.ACCESS_GROUP, {
      params: { type },
    });
    const opportunities = data.message?.opportunity || [];
    const contact = data.message?.contact || [];
    const quote = data.message?.quotes || [];

    return { opportunities, quote, contact };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const addOrder = async (values: AddOrder) => {
  try {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      status: Status.Reservation,
      saunaNum: values.saunaNum,
      prepaySource: values.prepaySource,
      prepayAmount: values.prepayAmount,
      createBy: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      orderDate: dayjs(values.orderDate).toISOString(),
      recommendation: values.recommendation?.[0],
      startTime: values.startTime,
      endTime: values.endTime,
      comment: values.comment,
      price: values.price,
      peopleCount: values.peopleCount,
    };

    const response = await axios.post(endpoints.ORDER, payload);

    console.log('Ответ сервера:', response.data);
    return response?.data?.message?.order_id;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const addPayment = async (values: AddPayment) => {
  try {
    const payload = {
      optyId: values.optyId,
      conId: values.conId,
      product: values.product,
      paymentType: values.paymentType,
      amount: values.amount,
      createBy: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      paymentDate: dayjs(values.paymentDate).format(FieldFormat.DateEN),
      comment: values?.comment,
      apartNum: values?.apartNum,
    };

    const response = await axios.post(endpoints.PAYMENT, payload);

    console.log('Ответ сервера:', response.data);
    return response?.data?.message?.payment_id;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const addExpense = async (values: AddExpense) => {
  try {
    const payload = {
      optyId: values.optyId,
      expenseType: values.expenseType,
      paymentType: values.paymentType,
      amount: ['Комм. Алатау', 'Снятие', 'Расход', 'Комм. Павленко'].includes(
        values.expenseType
      )
        ? -values.amount
        : values.amount,
      createBy: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      expenseDate: dayjs().format(FieldFormat.DateEN),
      comment: values.comment,
      apartNum: values.apartNum,
      invoice: values.expenseType === 'Комм. Алатау' ? 'Выставить Комм' : '',
    };

    const response = await axios.post(endpoints.EXPENSE, payload);

    console.log('Ответ сервера:', response.data);
    return response?.data?.message?.expense_id;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const loginUser = async (login: string, password: string) => {
  try {
    const payload = {
      login: login,
      password: password,
    };

    const response = await axios.post(endpoints.LOGIN, payload);
    if (!response?.data['access_token']) {
      throw new Error(`Ошибка пустой token`);
    }
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('login', login);
    return response;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const closeOpty = async (optyId: String) => {
  try {
    const payload = {
      optyId,
    };

    const response = await axios.post(endpoints.CLOSE_OPTY, payload);

    console.log('Ответ сервера:', response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getMonthPaymentData = async (dispatch: AppDispatch) => {
  try {
    const { data } = await axios.get(endpoints.MONTH_PAYMENT);

    const monthPayments = data.message?.monthpayments || [];

    dispatch(setMonthPayments(monthPayments));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getExpenseData = async (
  year: number,
  month: number,
  dispatch: AppDispatch
) => {
  try {
    const { data } = await axios.get(endpoints.EXPENSES, {
      params: { year, month },
    });

    const expense = data.message?.expenses || [];

    dispatch(setExpense(expense));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getAccessGroupData = async (
  dispatch: AppDispatch,
  login: string
) => {
  try {
    const { data } = await axios.get(endpoints.ACCESS_GROUP, {
      params: { login },
    });
    const accessGroup = data.message?.access_group || [];

    dispatch(setAccessGroup(accessGroup));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getOrder = async () => {
  try {
    const { data } = await axios.get(endpoints.ORDER);
    const order = data.message?.order || [];

    return { order };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const updateOpty = async (values: UpdateOpty) => {
  try {
    const payload = {
      optyId: values.optyId,
      PaymentDate: values?.PaymentDate,
      Comment: values?.Comment,
      PayPhone: values?.PayPhone,
    };

    const response = await axios.post(endpoints.UPDATE_OPTY, payload);

    console.log('Ответ сервера:', response.data);
    return response?.data?.message?.con_id;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};
