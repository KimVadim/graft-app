import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  login: string | null;
}

const initialState: UserState = {
  login: localStorage.getItem('login'),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
