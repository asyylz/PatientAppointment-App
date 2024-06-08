import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from './departments-slice';
import doctorsReducer from './doctors-slice';

const store = configureStore({
  reducer: {
    departments: departmentsReducer,
    doctors: doctorsReducer,
  },
});

//export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
