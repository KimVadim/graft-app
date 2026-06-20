import dayjs from 'dayjs';
import axios from 'axios';
import {
  AddOrder,
  AddOrderItem,
  AppConstants,
  OrderItemStatus,
  OrderStatus,
  UpdateOrder,
  UpdateOrderItem,
} from '../constants/appConstant';
import { AddMenu, MenuFieldData } from '../pages/Menu/MenuMeta';
import { AddExpense, ExpenseFieldData } from '../pages/Expenses/ExpensesMeta';

export const API_URL = 'https://palvenko-production.up.railway.app';

export const endpoints = {
  ORDER: `${API_URL}/endpoints/fs/sb/orders`,
  ORDER_ITEM: `${API_URL}/endpoints/fs/sb/orderitems`,
  ORDER_ALL_DATA: `${API_URL}/endpoints/fs/sb/orders`,
  LOGIN: `${API_URL}/endpoints/login`,
  CLOSE_OPTY: `${API_URL}/endpoints/close-opty`,
  DAILY_REPORT: `${API_URL}/endpoints/fs/sb/dailyreport`,
  WEEKLY_REPORT: `${API_URL}/endpoints/fs/sb/weeklyreport`,
  EXPENSES: `${API_URL}/endpoints/fs/sb/expense`,
  UPDATE_ORDER: `${API_URL}/endpoints/fs/sb/updateorder`,
  UPDATE_ORDER_ITEM: `${API_URL}/endpoints/fs/sb/updateorderitem`,
  ACCESS_GROUP: `${API_URL}/endpoints/access-group`,
  MENU: `${API_URL}/endpoints/fs/sb/menu`,
};

export const addOrder = async (values: AddOrder) => {
  try {
    const payload = {
      first_name: values.firstName,
      last_name: values.lastName,
      phone: values.phone,
      status: OrderStatus.Reservation,
      sauna_num: values.saunaNum?.[0],
      prepay_source: values.prepaySource?.[0],
      prepay_amount: values.prepayAmount,
      created_by: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      created_at: dayjs(values.orderDate)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString(),
      recommendation: values.recommendation?.[0],
      start_time: values.startTime,
      end_time: values.endTime,
      comment: values.comment,
      price: values.price,
      people_count: values.peopleCount,
      total_amount: 0,
    };

    const response = await axios.post(endpoints.ORDER, payload);

    return response?.data?.message?.orders;
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
    const payload = {
      item_name: values.itemName,
      menu_id: String(values.menuId),
      sales: values.sales,
      created_by: localStorage.getItem('login')
        ? localStorage.getItem('login')
        : 'newApp',
      created_at: dayjs(values.itemDt)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString(),
      amount: values.sales * values.itemCount,
      menu_type: values.menuType,
      price: values.price,
      price_amt: values.price * values.itemCount,
      item_count: values.itemCount,
      order_id: orderId,
      status: OrderItemStatus.Active,
    };

    const response = await axios.post(endpoints.ORDER_ITEM, payload);

    return response?.data?.message?.order_items?.['id'];
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
      [ExpenseFieldData.ExpenseDate]: dayjs(
        values?.[ExpenseFieldData.ExpenseDate]
      )
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString(),
      [ExpenseFieldData.AppName]: values?.[ExpenseFieldData.AppName],
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

    const dailyReport = data.message?.daily_revenue || [];

    return { dailyReport };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getWeeklyReportData = async () => {
  try {
    const { data } = await axios.get(endpoints.WEEKLY_REPORT);

    const weeklyReport = data.message?.weekly_revenue || [];

    return { weeklyReport };
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
    const orders = data.message?.orders || [];
    //const menu = data.message?.['menu_df'] || [];

    return { orders };
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
    const orders = data.message?.orders || [];

    return { orders };
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
    const orderItems = data.message?.['order_items'] || [];

    return { orderItems };
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
    console.log('Update order result:', values);
    const payload = {
      status: values?.status,
      comment: values?.comment,
      total_amount: values?.totalAmount,
      start_time: values?.startTime,
      end_time: values?.endTime,
      phone: values?.phone,
      sauna_num: values?.saunaNum?.[0],
      ...(values.orderDate && {
        created_at: dayjs(values.orderDate)
          .hour(12)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toISOString(),
      }),
    };

    const response = await axios.post(endpoints.UPDATE_ORDER, payload, {
      params: { order_id: values.orderId },
    });

    return response?.data?.message?.order;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const updateOrderItem = async (values: UpdateOrderItem) => {
  try {
    const payload = {
      status: values?.status,
    };

    const response = await axios.post(endpoints.UPDATE_ORDER_ITEM, payload, {
      params: { order_item_id: values.itemId },
    });

    return response?.data?.message?.order_item;
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
      params: { order_id: orderId },
    });

    return data.message?.order_items || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const getMenuData = async () => {
  try {
    const { data } = await axios.get(endpoints.MENU);
    const menu = data.message?.menu || [];

    return { menu };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.status);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};

export const addMenu = async (values: AddMenu) => {
  try {
    const payload = {
      [MenuFieldData.MenuName]: values?.[MenuFieldData.MenuName],
      [MenuFieldData.MenuType]: values?.[MenuFieldData.MenuType],
      [MenuFieldData.Sales]: values?.[MenuFieldData.Sales],
      [MenuFieldData.Percent]: values?.[MenuFieldData.Percent],
      [MenuFieldData.Count]: values?.[MenuFieldData.Count],
      [MenuFieldData.Price]: values?.[MenuFieldData.Price],
      [MenuFieldData.Amount]: values?.[MenuFieldData.Amount],
      [MenuFieldData.SalesAmount]: values?.[MenuFieldData.SalesAmount],
      [MenuFieldData.Comment]: values?.[MenuFieldData.Comment],
      [MenuFieldData.Status]: AppConstants.MenuStatusActive,
      [MenuFieldData.TypeName]: values?.[MenuFieldData.TypeName]?.[0],
    };

    const response = await axios.post(endpoints.MENU, payload);

    return response?.data?.message?.menu_id;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка запроса:', error.response?.data);
    } else {
      console.error('Непредвиденная ошибка:', error);
    }
  }
};
