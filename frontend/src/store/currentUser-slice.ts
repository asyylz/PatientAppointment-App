import { fetchEntities, createEntitySlice } from './create-generic-slice';
// Fetch departments thunk

export const loginCurrentUser = fetchEntities<CurrentUser>(
  'currentUser',
  'http://localhost:3000/api/v1/users/login',
  'post'
);

// Create departments slice
const currentUserSlice = createEntitySlice<CurrentUser>(
  'currentUser',
  loginCurrentUser
);
console.log(currentUserSlice)
// Export the actions and reducer
export const { actions, reducer } = currentUserSlice;
export default currentUserSlice.reducer;
