import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccessGroup {
  id: string;
  login: string;
  view: string;
  active: string;
}

interface AccessGroupState {
  accessGroup: AccessGroup[];
}

const initialState: AccessGroupState = {
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
