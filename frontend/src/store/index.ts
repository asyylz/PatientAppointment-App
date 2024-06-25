import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from './departments-slice';
import doctorsReducer from './doctors-slice';
import reviewsReducer from './reviews-slice';
import currentUserReducer from './currentUser-slice';
import searchReducer from './search-slice';

const store = configureStore({
  reducer: {
    departments: departmentsReducer,
    doctors: doctorsReducer,
    reviews: reviewsReducer,
    currentUser: currentUserReducer,
    search: searchReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export default store;
