import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string = '';
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (_state, action: PayloadAction<string>) => {
      return action.payload;
    },
    // clearSearch: () => {
    //   return '';
    // }, // do not forget to import
  },
});

export const { setSearch } = searchSlice.actions;

export default searchSlice.reducer;
