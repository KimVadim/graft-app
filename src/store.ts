import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import orderItemReducer from './slices/orderitemSlice';
import contactReducer from './slices/contactSlice';
import dailyReportReducer from './slices/dailyReportSlice';
import weeklyReportReducer from './slices/weeklyReportSlice';
import monthlyReportReducer from './slices/monthlyReportSlice';
import monthlyReportSalesProductReducer from './slices/monthlySalesProductReportSlice';
import expenseReducer from './slices/expenseSlice';
import accessGroup from './slices/accessGroupSlice';
import menuReducer from './slices/menuSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    accessGroup: accessGroup,
    order: orderReducer,
    orderItem: orderItemReducer,
    contact: contactReducer,
    dailyReport: dailyReportReducer,
    weeklyReport: weeklyReportReducer,
    monthlyReport: monthlyReportReducer,
    monthlySalesProductReport: monthlyReportSalesProductReducer,
    expense: expenseReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
