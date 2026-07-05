import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MonthlySalesProductReport {
  month_start: string;
  month_label: string;
  month_number: number;
  year: number;
  menu_type: string;
  item_name: string;
  order_count: number;
  total_quantity: number;
  total_revenue: number;
  total_profit: number;
  profit_margin_pct: number;
}

export type MonthlySalesProductReportState = {
  monthlySalesProductReport: MonthlySalesProductReport[];
};

const initialState: MonthlySalesProductReportState = {
  monthlySalesProductReport: [],
};

export const monthlySalesProductReportSlice = createSlice({
  name: 'monthlySalesProductReport',
  initialState,
  reducers: {
    setMonthlySalesProductReport: (
      state,
      action: PayloadAction<MonthlySalesProductReport[]>
    ) => {
      state.monthlySalesProductReport = action.payload;
    },
  },
});

export const { setMonthlySalesProductReport } =
  monthlySalesProductReportSlice.actions;
export default monthlySalesProductReportSlice.reducer;
