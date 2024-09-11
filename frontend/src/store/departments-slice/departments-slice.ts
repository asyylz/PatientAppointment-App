import {
  fetchEntities,
  createEntitySlice,
} from '../create-generic-slice/create-generic-slice';

// Fetch departments thunk
// export const fetchDepartments = fetchEntities1<Department>(
//   'departments',
//   'http://localhost:3000/api/v1/departments?sort=departmentMain'
// );

export const fetchDepartments = fetchEntities<Department>('departments');

// Create departments slice
const departmentsSlice = createEntitySlice<Department>(
  'departments',
  fetchDepartments
);

// Export the actions and reducer
export const departmentActions = departmentsSlice.actions;
export default departmentsSlice.reducer;
