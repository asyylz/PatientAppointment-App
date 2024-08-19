import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: string = '';
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (_state, action: PayloadAction<string>) => {
      return action.payload;
    },
    clearSearch: () => {
      return '';
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
