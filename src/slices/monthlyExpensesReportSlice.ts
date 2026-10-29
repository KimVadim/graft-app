import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MonthlyExpensesReport {
  year: number;
  month: number;
  app_name: string;
  source: string;
  type: string;
  total: number;
}

export type MonthlyExpensesReportState = {
  monthlyExpensesReport: MonthlyExpensesReport[];
};

const initialState: MonthlyExpensesReportState = {
  monthlyExpensesReport: [],
};

export const monthlyExpensesReportSlice = createSlice({
  name: 'monthlyExpensesReport',
  initialState,
  reducers: {
    setMonthlyExpensesReport: (
      state,
      action: PayloadAction<MonthlyExpensesReport[]>
    ) => {
      state.monthlyExpensesReport = action.payload;
    },
  },
});

export const { setMonthlyExpensesReport } = monthlyExpensesReportSlice.actions;
export default monthlyExpensesReportSlice.reducer;
