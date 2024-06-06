// import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchDepartments = createAsyncThunk<Department[]>(
//   'departments/fetchDepartments',
//   async () => {
//     const response = await axios.get(
//       'http://localhost:3000/api/v1/departments?sort=departmentMain'
//     );
//     console.log(response.data.data);
//     return response.data.data.departments;
//   }
// );

// const initialState: DepartmentsState = {
//   departments: [],
//   status: 'idle',
//   error: null,
// };

// const departmentsSlice = createSlice({
//   name: 'departments',
//   initialState,
//   reducers: {
//     addDepartment: (state, action: PayloadAction<Department>) => {
//       state.departments.push(action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDepartments.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(
//         fetchDepartments.fulfilled,
//         (state, action: PayloadAction<Department[]>) => {
//           state.status = 'succeeded';
//           state.departments = action.payload;
//           console.log('State updated:', state.departments); // Debug state update
//         }
//       )
//       .addCase(fetchDepartments.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message || 'Failed to fetch departments';
//       });
//   },
// });

// export const departmentActions = departmentsSlice.actions;

// export default departmentsSlice;

// Define your Department type

import { fetchEntities, createEntitySlice } from './create-generic-slice';
// Fetch departments thunk
export const fetchDepartments = fetchEntities<Department>(
  'departments',
  'http://localhost:3000/api/v1/departments?sort=departmentMain'
);

// Create departments slice
const departmentsSlice = createEntitySlice<Department>(
  'departments',
  fetchDepartments
);

// Export the actions and reducer
export const departmentActions = departmentsSlice.actions;
export default departmentsSlice.reducer;
