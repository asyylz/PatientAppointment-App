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
import departmentsReducer from './departments-slice';
import doctorsReducer from './doctors-slice';
import reviewsReducer from './reviews-slice';
import currentUserReducer from './currentUser-slice';
//import { useDispatch } from 'react-redux';
import searchReducer from './search-slice';
import appointmentsForDoctorReducer from './appointmentsForDoctor-slice';
import appointmentsForPatientReducer from './appointmentsForPatient-slice';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// const rootPersistConfig = {
//   key: 'root',
//   storage,
// };

// const persistedReducer = persistReducer(rootPersistConfig, currentUserReducer);

// const store = configureStore({
//   reducer: {
//     currentUser: persistedReducer,
//     departments: departmentsReducer,
//     doctors: doctorsReducer,
//     reviews: reviewsReducer,
//     search: searchReducer,
//     appointmentsForDoctor: appointmentsForDoctorReducer,
//     appointmentsForPatient: appointmentsForPatientReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//         ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
//         ignoredPaths: ['items.dates'],
//       },
//     }),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// const rootPersistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['currentUser', 'doctors'], // Only persist the 'currentUserSlice' slice
// };

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

//const persistedReducer = persistReducer(rootPersistConfig, allReducers);

const store = configureStore({
  reducer: allReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
//export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;

export const persistor = persistStore(store);

export default store;
