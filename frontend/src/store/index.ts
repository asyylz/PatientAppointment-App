import { configureStore } from '@reduxjs/toolkit';
import departmentsSlice from './departments-slice';

const store = configureStore({
  reducer: { departments: departmentsSlice.reducer }, // root reducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
