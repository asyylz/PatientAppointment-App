import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import departmentsReducer from './departments-slice';
import doctorsReducer from './doctors-slice';
import reviewsReducer from './reviews-slice';
import currentUserReducer from './currentUser-slice';
import { useDispatch } from 'react-redux';
import searchReducer from './search-slice';
import appointmentsForDoctorReducer from './appointmentsForDoctor-slice';
import appointmentsForPatientReducer from './appointmentsForPatient-slice';

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    departments: departmentsReducer,
    doctors: doctorsReducer,
    reviews: reviewsReducer,
    search: searchReducer,
    appointmentsForDoctor: appointmentsForDoctorReducer,
    appointmentsForPatient: appointmentsForPatientReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Ensure thunk is included
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
// export type RootState = ReturnType<typeof store.getState>;
//export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
