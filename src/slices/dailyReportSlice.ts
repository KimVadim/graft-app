import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DailyReport {
  day: string;
  day_of_week: string;
  total_revenue: number;
  total_profit: number;
  kitchen_revenue: number;
  kitchen_profit: number;
  bar_revenue: number;
  bar_profit: number;
  sauna_revenue: number;
  sauna_profit: number;
  orders_count: number;
  people_count: number;
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
