import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccessGroup {
  id: string;
  login: string;
  view: string;
  active: string;
}

export type AccessGroupState = {
  accessGroup: AccessGroup[];
};

export const initialState: AccessGroupState = {
  accessGroup: [],
};

export const accessGroupSlice = createSlice({
  name: 'accessGroup',
  initialState,
  reducers: {
    setAccessGroup: (state, action: PayloadAction<AccessGroup[]>) => {
      state.accessGroup = action.payload;
    },
  },
});

export const { setAccessGroup } = accessGroupSlice.actions;
export default accessGroupSlice.reducer;
