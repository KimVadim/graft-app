import dayjs from 'dayjs';
import axios from 'axios';
import {
  AddOrder,
  AddOrderItem,
  OrderStatus,
  UpdateOrder,
} from '../constants/appConstant';
import { AddExpense, ExpenseFieldData } from '../pages/Expenses/ExpensesMeta';

export const API_URL = 'https://palvenko-production.up.railway.app';

export const endpoints = {
  ORDER: `${API_URL}/endpoints/fs/order`,
  ORDER_ITEM: `${API_URL}/endpoints/fs/orderitem`,
  ORDER_ALL_DATA: `${API_URL}/endpoints/fs/orderalldata`,
  LOGIN: `${API_URL}/endpoints/login`,
  CLOSE_OPTY: `${API_URL}/endpoints/close-opty`,
  DAILY_REPORT: `${API_URL}/endpoints/fs/v2/dailyreport`,
  DAILY_WEEKLY_REPORT: `${API_URL}/endpoints/fs/dailyweeklyreport`,
  EXPENSES: `${API_URL}/endpoints/fs/expense`,
  UPDATE_ORDER: `${API_URL}/endpoints/fs/updateorder`,
  ACCESS_GROUP: `${API_URL}/endpoints/access-group`,
};

export const addOrder = async (values: AddOrder) => {
  try {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      status: OrderStatus.Reservation,
      saunaNum: values.saunaNum?.[0],
      prepaySource: values.prepaySource?.[0],
      prepayAmount: values.prepayAmount,
      createBy: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      orderDate: dayjs(values.orderDate)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString(),
      recommendation: values.recommendation?.[0],
      startTime: values.startTime,
      endTime: values.endTime,
      comment: values.comment,
      price: values.price,
      peopleCount: values.peopleCount,
      totalAmount: 0,
    };

    const response = await axios.post(endpoints.ORDER, payload);

    return response?.data?.message?.order_id;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const addOrderItem = async (values: AddOrderItem, orderId: string) => {
  try {
    //const amount = values.price * values.itemCount;
    const payload = {
      itemName: values.itemName,
      menuId: values.menuId,
      sales: values.sales,
      createBy: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      itemDt: dayjs(values.itemDt)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString(),
      amount: values.sales * values.itemCount,
      price: values.price,
      priceAmount: values.price * values.itemCount,
      itemCount: values.itemCount,
      orderId: orderId,
    };

    const response = await axios.post(endpoints.ORDER_ITEM, payload);

    return response?.data?.message?.order_item_id;
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
      [ExpenseFieldData.ExpenseName]: values?.[ExpenseFieldData.ExpenseName],
      [ExpenseFieldData.Type]: values?.[ExpenseFieldData.Type],
      [ExpenseFieldData.Source]: values?.[ExpenseFieldData.Source],
      [ExpenseFieldData.Amount]: values?.[ExpenseFieldData.Amount],
      [ExpenseFieldData.Comment]: values?.[ExpenseFieldData.Comment],
      [ExpenseFieldData.ExpenseDate]: dayjs()
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString(),
    };

    const response = await axios.post(endpoints.EXPENSES, payload);

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

    await axios.post(endpoints.CLOSE_OPTY, payload);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getDailyReportData = async () => {
  try {
    const { data } = await axios.get(endpoints.DAILY_REPORT);

    const dailyReport = data.message?.daily_report || [];

    return { dailyReport };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getDailyWeeklyReportData = async () => {
  try {
    const { data } = await axios.get(endpoints.DAILY_WEEKLY_REPORT);

    const dailyReport = data.message?.df_daily || [];
    const weeklyReport = data.message?.df_weekly || [];

    return { dailyReport, weeklyReport };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getExpenseData = async (year: number, month: number) => {
  try {
    const { data } = await axios.get(endpoints.EXPENSES, {
      params: { year, month },
    });
    const expense = data.message?.expense || [];

    return { expense };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getOrderAllData = async () => {
  try {
    const { data } = await axios.get(endpoints.ORDER_ALL_DATA);
    const order = data.message?.order || [];
    const menu = data.message?.['menu_df'] || [];

    return { order, menu };
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

export const getOrderItem = async () => {
  try {
    const { data } = await axios.get(endpoints.ORDER_ITEM);
    const orderItem = data.message?.['orderitem'] || [];

    return { orderItem };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const updateOrder = async (values: UpdateOrder) => {
  try {
    const payload = {
      id: values.orderId,
      status: values?.status,
      comment: values?.comment,
      total_amount: values?.totalAmount,
      start_time: values?.startTime,
      end_time: values?.endTime,
      phone: values?.phone,
      sauna_num: values?.saunaNum?.[0],
      ...(values.orderDate && {
        order_dt: dayjs(values.orderDate)
          .hour(12)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toISOString(),
      }),
    };

    const response = await axios.post(endpoints.UPDATE_ORDER, payload);

    return response?.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getOrderItemData = async (orderId: string) => {
  try {
    const { data } = await axios.get(endpoints.ORDER_ITEM, {
      params: { orderId },
    });

    return data.message?.orderitem || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};
