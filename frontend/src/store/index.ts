import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from './departments-slice';
import doctorsReducer from './doctors-slice';
import reviewsReducer from './reviews-slice';

const store= configureStore({
  reducer: {
    departments: departmentsReducer,
    doctors: doctorsReducer,
    reviews: reviewsReducer,
  },
});

//export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export default store;
