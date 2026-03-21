import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  title: string;
  type: string;
  description: string;
}

// Определяем интерфейс состояния
interface contactState {
  contact: Contact[];
}

// Начальное состояние
const initialState: contactState = {
  contact: [],
};

// Создаём slice
export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setContact: (state, action: PayloadAction<Contact[]>) => {
      state.contact = action.payload;
    },
  },
});

// Экспортируем actions и reducer
export const { setContact } = contactSlice.actions;
export default contactSlice.reducer;
