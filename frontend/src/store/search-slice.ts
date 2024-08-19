import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: string = '';
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (_state, action: PayloadAction<string>) => {
      console.log(action.payload)
      return action.payload;
    },
    clearSearch: () => {
      return '';
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
