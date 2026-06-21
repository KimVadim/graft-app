import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WeeklyReport {
  week_start: string;
  week_label: string;
  week_number: number;
  year: number;
  total_revenue: number;
  total_profit: number;
  people_count: number;
  orders_count: number;
  sauna_profit: number;
  sauna_revenue: number;
  kitchen_profit: number;
  kitchen_revenue: number;
  bar_profit: number;
  bar_revenue: number;
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
