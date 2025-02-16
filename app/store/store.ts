import { configureStore } from '@reduxjs/toolkit';
import orderSlice from './slice/orderSlice';
import headerSlice from './slice/headerSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      header: headerSlice,
      order: orderSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
