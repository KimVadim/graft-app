import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id: string;
  item_name: string;
  menu_id: string;
  amount: number;
  item_count: number;
  price: number;
  sales: number;
  created_by: string;
  item_dt: string;
  order_id: string;
}

interface orderItemState {
  orderItem: OrderItem[];
}

const initialState: orderItemState = {
  orderItem: [],
};

export const orderItemSlice = createSlice({
  name: 'orderItem',
  initialState,
  reducers: {
    setOrderItem: (state, action: PayloadAction<OrderItem[]>) => {
      state.orderItem = action.payload;
    },
  },
});

export const { setOrderItem } = orderItemSlice.actions;
export default orderItemSlice.reducer;
