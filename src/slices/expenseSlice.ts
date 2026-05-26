import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Expense {
  id: string;
  created_at: string;
  expense_name: string;
  amount: number;
  comment: string;
  type: string;
  source: string;
  com_id: string;
  apart_num: string;
  payment_type: string;
  invoice: string;
  processed: string;
  app_name: string;
}

export type ExpenseState = {
  expense: Expense[];
};

const initialState: ExpenseState = {
  expense: [],
};

export const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpense: (state, action: PayloadAction<Expense[]>) => {
      state.expense = action.payload;
    },
  },
});

export const { setExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
