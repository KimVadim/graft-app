import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DailyReport {
  order_dt: string;
  weekday: string;
  total_revenue: string;
  total_price: string;
  total_profit: string;
}

interface DailyReportState {
  dailyReport: DailyReport[];
}

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
