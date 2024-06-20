import { fetchEntities, createEntitySlice } from './create-generic-slice';
// Fetch departments thunk
export const fetchDepartments = fetchEntities<DepartmentState>(
  'departments',
  'http://localhost:3000/api/v1/departments?sort=departmentMain'
);

// Create departments slice
const departmentsSlice = createEntitySlice<DepartmentState>(
  'departments',
  fetchDepartments
);

// Export the actions and reducer
export const departmentActions = departmentsSlice.actions;
export default departmentsSlice.reducer;
