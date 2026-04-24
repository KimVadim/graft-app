import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WeeklyReport {
  order_dt: string;
  weekday: string;
  total_revenue: number;
  total_price: number;
  total_profit: number;
  revenue_sauna_total: number;
  profit_sauna_total: number;
  revenue_kitchen_total: number;
  profit_kitchen_total: number;
}

export type WeeklyReportState = {
  weeklyReport: WeeklyReport[];
};

const initialState: WeeklyReportState = {
  weeklyReport: [],
};

export const weeklyReportSlice = createSlice({
  name: 'dailyReport',
  initialState,
  reducers: {
    setWeeklyReport: (state, action: PayloadAction<WeeklyReport[]>) => {
      state.weeklyReport = action.payload;
    },
  },
});

export const { setWeeklyReport } = weeklyReportSlice.actions;
export default weeklyReportSlice.reducer;
