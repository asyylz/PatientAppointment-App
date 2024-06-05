import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: { departments: departmentsSlice.reducer }, // root reducer
});

export default store;
