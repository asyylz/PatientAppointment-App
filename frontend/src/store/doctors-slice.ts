import { fetchEntities, createEntitySlice } from './create-generic-slice';
// Fetch departments thunk
export const fetchDoctors = fetchEntities<Doctor>(
  'doctors',
  'http://localhost:3000/api/v1/doctors/'
);

// Create departments slice
const doctorsSlice = createEntitySlice<Doctor>('doctors', fetchDoctors);

console.log(doctorsSlice)
// Export the actions and reducer
export const doctorActions = doctorsSlice.actions;
export default doctorsSlice.reducer;
