import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  id: string;
  con_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  sauna_num: string;
  start_time: string;
  end_time: string;
  comment: string;
  order_dt: string;
  create_by: string;
  price: string;
  people_count: string;
  recommendation: string;
  total_amount: string;
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
    updateOrderAction: (
      state,
      action: PayloadAction<Partial<Order> & { id: string }>
    ) => {
      const order = state.order.find((o) => o.id === action.payload.id);

      if (order) {
        Object.assign(order, action.payload);
      }
    },
  },
});

export const { setOrder, updateOrderAction } = orderSlice.actions;
export default orderSlice.reducer;
