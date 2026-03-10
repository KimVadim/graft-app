import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.ts';
import orderReducer from './slices/orderSlice.ts';
import orderItemReducer from './slices/orderitemSlice.ts';
import contactReducer from './slices/contactSlice.ts';
import dailyReportReducer from './slices/dailyReportSlice.ts';
import expenseReducer from './slices/expenseSlice.ts';
import accessGroup from './slices/accessGroupSlice.ts';
import menuReducer from './slices/menuSlice.ts';

export const store = configureStore({
  reducer: {
    user: userReducer,
    accessGroup: accessGroup,
    order: orderReducer,
    orderItem: orderItemReducer,
    contact: contactReducer,
    dailyReport: dailyReportReducer,
    expense: expenseReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
