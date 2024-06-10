//import { RootState } from './index';
import { fetchEntities, createEntitySlice } from './create-generic-slice';
import { PayloadAction } from '@reduxjs/toolkit';
// Fetch departments thunk
export const fetchReviews = fetchEntities<Review>(
  'reviews',
  'http://localhost:3000/api/v1/reviews/'
);

// Create reviews slice
const reviewsSlice = createEntitySlice<Review>(
  'doctors',
  fetchReviews,
);

// Export the actions and reducer
const { actions, reducer } = doctorsSlice;

export const doctorActions = {
  ...actions,
  selectDoctor: (doctor: Doctor) => ({
    type: 'doctors/selectDoctor',
    payload: doctor,
  }),
};

export default reducer;
