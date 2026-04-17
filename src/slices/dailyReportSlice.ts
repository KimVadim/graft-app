import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DailyReport {
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

export type DailyReportState = {
  dailyReport: DailyReport[];
};

const initialState: DailyReportState = {
  dailyReport: [],
};

export const dailyReportSlice = createSlice({
  name: 'dailyReport',
  initialState,
  reducers: {
    setDeilyReport: (state, action: PayloadAction<DailyReport[]>) => {
      state.dailyReport = action.payload;
    },
  },
});

export const { setDeilyReport } = dailyReportSlice.actions;
export default dailyReportSlice.reducer;
