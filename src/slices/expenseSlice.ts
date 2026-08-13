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
    // Полная замена массива
    setExpense: (state, action: PayloadAction<Expense[]>) => {
      state.expense = action.payload;
    },

    // Добавление новой записи
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expense.unshift(action.payload);
    },

    // Обновление существующей записи
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expense.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        state.expense[index] = action.payload;
      }
    },

    // Частичное обновление записи
    patchExpense: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Expense> }>
    ) => {
      const { id, changes } = action.payload;
      const expense = state.expense.find((item) => item.id === id);

      if (expense) {
        Object.assign(expense, changes);
      }
    },

    // Удаление записи
    removeExpense: (state, action: PayloadAction<string>) => {
      state.expense = state.expense.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const {
  setExpense,
  addExpense,
  updateExpense,
  patchExpense,
  removeExpense,
} = expenseSlice.actions;

export default expenseSlice.reducer;
