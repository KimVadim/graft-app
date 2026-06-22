import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MonthlyReport {
  month_start: string;
  month_label: string;
  month_number: number;
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

export type MonthlyReportState = {
  monthlyReport: MonthlyReport[];
};

const initialState: MonthlyReportState = {
  monthlyReport: [],
};

export const monthlyReportSlice = createSlice({
  name: 'monthlyReport',
  initialState,
  reducers: {
    setMonthlyReport: (state, action: PayloadAction<MonthlyReport[]>) => {
      state.monthlyReport = action.payload;
    },
  },
});

export const { setMonthlyReport } = monthlyReportSlice.actions;
export default monthlyReportSlice.reducer;
