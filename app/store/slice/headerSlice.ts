import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  title: string;
};

const initialState: InitialState = {
  title: '',
};

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
  },
});

export const { setTitle } = headerSlice.actions;
export default headerSlice.reducer;
