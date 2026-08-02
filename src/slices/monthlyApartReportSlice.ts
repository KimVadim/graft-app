import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MonthlyApartReport {
  id: string;
  created_at: string;
  month_start: string;
  month_label: string;
  month_number: number;
  year: number;
  app_name: string;
  payment_amt: number;
  payment_count: number;
  deposit_amt: number;
  deposit_count: number;
  return_deposit_amt: number;
  return_deposit_count: number;
  storage_amt: number;
  storage_count: number;
}

export type MonthlyApartReportState = {
  monthlyApartReport: MonthlyApartReport[];
};

const initialState: MonthlyApartReportState = {
  monthlyApartReport: [],
};

export const monthlyApartReportSlice = createSlice({
  name: 'monthlyApartReport',
  initialState,
  reducers: {
    setMonthlyApartReport: (
      state,
      action: PayloadAction<MonthlyApartReport[]>
    ) => {
      state.monthlyApartReport = action.payload;
    },
  },
});

export const { setMonthlyApartReport } = monthlyApartReportSlice.actions;
export default monthlyApartReportSlice.reducer;
