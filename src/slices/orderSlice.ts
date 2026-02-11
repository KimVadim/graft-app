import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  id: string;
  contactId: string;
  apartNum: string;
  productId: string;
  status: string;
  amount: number;
  startDate: string;
  endDate: string;
  contactName: string;
  phone: string;
}

interface OrderState {
  order: Order[];
}

const initialState: OrderState = {
  order: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<Order[]>) => {
      state.order = action.payload;
    },
  },
});

export const { setOrder } = orderSlice.actions;
export default orderSlice.reducer;
