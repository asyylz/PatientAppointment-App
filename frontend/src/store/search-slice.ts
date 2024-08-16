import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface InitialState {
//   search: string;
// }
const initialState: string = '';

// const initialState: InitialState = {
//   search: '',
// };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (_state, action: PayloadAction<string>) => {
      console.log(action.payload)// first Anesthesiology then empty string
      return action.payload;
    },
    clearSearch: () => {
      return '';
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
