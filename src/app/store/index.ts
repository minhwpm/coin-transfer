import { configureStore } from '@reduxjs/toolkit';
import tokenSelectorReducer from './tokenSelectorSlice';

export const store = configureStore({
  reducer: {
    tokenSelector: tokenSelectorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
