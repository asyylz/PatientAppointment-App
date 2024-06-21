import { PayloadAction } from '@reduxjs/toolkit';
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
  loginCurrentUser,
  (builder) => {
    builder.addCase(
      'currentUser/setImagePath',
      (
        state: EntityStateForUser<CurrentUser>,
        action: PayloadAction<string>
      ) => {
        state.image = action.payload;
      }
    );
  }
);

const { actions, reducer } = currentUserSlice;

export const currentUserActions = {
  ...actions,
  setImagePath: (image: string) => ({
    type: 'currentUser/setImagePath',
    payload: image,
  }),
};

export default reducer;
