import {
  fetchEntities,
  createEntitySlice,
} from '../create-generic-slice/create-generic-slice';

export const fetchDepartments = fetchEntities<Department>('departments');

// Create departments slice
const departmentsSlice = createEntitySlice<Department>(
  'departments',
  fetchDepartments
);

// Export the actions and reducer
export const departmentActions = departmentsSlice.actions;
export default departmentsSlice.reducer;
