import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Menu {
  id: string;
  menu_name: string;
  menu_type: string;
  sales: number;
  pecent: number;
  created_at: string;
  count: number;
  price: number;
  amount: number;
  sales_amount: number;
  status: string;
  comment: string;
  type_name: string;
}

export type MenuState = {
  menu: Menu[];
};

const initialState: MenuState = {
  menu: [],
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<Menu[]>) => {
      state.menu = action.payload;
    },
  },
});

export const { setMenu } = menuSlice.actions;
export default menuSlice.reducer;
