import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coin, DEFAULT_COIN } from '@/types';

interface TokenSelectorState {
  isOpen: boolean;
  selectedCoin: Coin;
}

const initialState: TokenSelectorState = {
  isOpen: false,
  selectedCoin: DEFAULT_COIN,
};

const tokenSelectorSlice = createSlice({
  name: 'tokenSelector',
  initialState,
  reducers: {
    openSelector(state) {
      state.isOpen = true;
    },
    closeSelector(state) {
      state.isOpen = false;
    },
    toggleSelector(state) {
      state.isOpen = !state.isOpen;
    },
    setSelectedCoin(state, action: PayloadAction<Coin>) {
      state.selectedCoin = action.payload;
    },
  },
});

export const {
  openSelector,
  closeSelector,
  toggleSelector,
  setSelectedCoin,
} = tokenSelectorSlice.actions;

export default tokenSelectorSlice.reducer;
