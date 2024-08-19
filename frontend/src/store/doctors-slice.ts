import { fetchEntities, createEntitySlice } from './create-generic-slice';
import { PayloadAction } from '@reduxjs/toolkit';

// export const doctorsUrl = (pagination?: number, departmentId?: string) => {
//   return `http://localhost:3000/api/v1/doctors?limit=2&page=${pagination}&sort=firstName${
//     departmentId ? `&departmentId=${departmentId}` : ''
//   }`;
// };

export const doctorsUrl = (url: string) => {
  return url ;
};

// Fetch doctors thunk
export const fetchDoctors = fetchEntities<Doctor>('doctors', 'get');

// Create doctors slice
const doctorsSlice = createEntitySlice<Doctor>(
  'doctors',
  fetchDoctors,
  (builder) => {
    builder.addCase(
      'doctors/selectDoctor',
      (state: ExtendedEntityState<Doctor>, action: PayloadAction<Doctor>) => {
        state.selectedDoctor = action.payload;
        console.log('State.selectedDoctor updated:', state.selectedDoctor); // Debug state update
      }
    );
  }
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
