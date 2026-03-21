import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Expense {
  id: string;
  expense_dt: string;
  expense_name: string;
  amount: number;
  comment: string;
  apartNum: number;
  count: number;
}

interface ExpenseState {
  expense: Expense[];
}

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
