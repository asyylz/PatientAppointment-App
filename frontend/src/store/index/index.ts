import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import departmentsReducer from '../departments-slice/departments-slice';
import doctorsReducer from '../doctors-slice/doctors-slice';
import reviewsReducer from './../reviews-slice/reviews-slice';
import currentUserReducer from '../currentUser-slice/currentUser-slice';
import searchReducer from '../search-slice/search-slice';
import appointmentsForDoctorReducer from '../appointmentsForDoctor-slice/appointmentsForDoctor-slice';
import appointmentsForPatientReducer from '../appointmentsForPatient-slice/appointmentsForPatient-slice';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const authPersistConfig = {
  key: 'currentUser',
  storage: storage,
  // blacklist: ['status', 'error'],
};

const doctorPersistConfig = {
  key: 'doctors',
  storage: storage,
  // blacklist: ['status','error']
};

export const allReducers = combineReducers({
  currentUser: persistReducer(authPersistConfig, currentUserReducer),
  departments: departmentsReducer,
  doctors: persistReducer(doctorPersistConfig, doctorsReducer),
  reviews: reviewsReducer,
  search: searchReducer,
  appointmentsForDoctor: appointmentsForDoctorReducer,
  appointmentsForPatient: appointmentsForPatientReducer,
});

const store = configureStore({
  reducer: allReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'appointmentsForPatient/fetchWithId/rejected',
          'appointmentsForDoctor/fetchWithId/rejected',
          'departments/fetch/rejected',
          'doctors/fetch/rejected',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export function setupStore(reducer?: any, preloadedState?: Partial<RootState>) {
  //console.log('from index store', preloadedState); // i can see my preloaded state here  with mock data
  const store = configureStore({
    reducer: reducer,
    preloadedState,
  });

  //console.log(store.getState()); // but still cant see current user but can see the rest of the states
  return store;
}

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;

export const persistor = persistStore(store);

export default store;
