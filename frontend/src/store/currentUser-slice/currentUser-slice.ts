import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toastSuccessNotify } from '../../helper/ToastNotify';
import {
  axiosInterceptorsWithToken,
  axiosInterceptorsWithoutToken,
} from '../../services/axiosInterceptors';
import {
  startTokenCheckInterval,
  stopTokenCheckInterval,
} from '../../helper/timers';

import { AppDispatch } from '../index';

const initialState: CurrentUser = {
  status: 'idle',
  token: '',
  userData: null,
};

const apiURL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_LOCAL_URL;

/* ------------------------------------------------------ */
/*                        REGISTER                        */
/* ------------------------------------------------------ */
export const register = createAsyncThunk<CurrentUserPayload, Credentials>(
  'currentUser/register',
  async (credentials) => {
    const response = await axiosInterceptorsWithoutToken.post(
      `${apiURL}/users/signup`,
      credentials
    );
    toastSuccessNotify('Successfully registered!');
    return response.data;
  }
);

/* ------------------------------------------------------ */
/*                          LOGIN                         */
/* ------------------------------------------------------ */
export const login = createAsyncThunk<
  CurrentUserPayload,
  { email: string; password: string }
>('currentUser/login', async (credentials) => {
  const response = await axiosInterceptorsWithoutToken.post(
    `${apiURL}/users/login`,
    credentials,
    { withCredentials: true }
  );
  console.log(response.data);
  startTokenCheckInterval();
  toastSuccessNotify('Successfully login!');
  return response.data;
});

/* ------------------------------------------------------ */
/*                         LOGOUT                         */
/* ------------------------------------------------------ */
export const performLogout = () => async (dispatch: AppDispatch) => {
  const response = await axiosInterceptorsWithToken.get(
    `${apiURL}/users/logout`
  );
  if (response.data.status === 'success') {
    dispatch(logout());
    stopTokenCheckInterval();
    //window.location.href = '/';

    setTimeout(() => {
      toastSuccessNotify('Successfully logged out!');
    }, 500);
  }

  return response.data;
};

/* ------------------------------------------------------ */
/*                         UPDATE                         */
/* ------------------------------------------------------ */
export const updateUserInfo = createAsyncThunk<
  CurrentUserPayload,
  FormData,
  { rejectValue: string }
>('currentUser/updateProfile', async (userUpdatedFormData) => {
  //try {
  const response = await axiosInterceptorsWithToken.patch(
    `${apiURL}/users/updateUser`,
    userUpdatedFormData
  );

  toastSuccessNotify('Your profile successfully updated!');
  return response.data;
});

/* ------------------------------------------------------ */
/*                      REFRESH TOKEN                     */
/* ------------------------------------------------------ */
export const refreshSession = createAsyncThunk<
  CurrentUserPayload,
  void,
  { rejectValue: string }
>('currentUser/refreshSession', async () => {
  const response = await axiosInterceptorsWithToken.post(
    `${apiURL}/users/refresh-session`
  );

  toastSuccessNotify('Your session has been extended another 15 mins!');
  return response.data;
});

/* ------------------------------------------------------ */
/*                          SLICE                         */
/* ------------------------------------------------------ */
const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    logout(state) {
      state.status = 'idle';
      state.token = '';
      state.userData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, data } = action.payload;
        state.status = 'login success';
        state.token = token;
        state.userData = data.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'login failed';
        state.error = action.error?.message || 'Login failed!';
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        const { token, data } = action.payload;
        state.status = 'refresh success';
        state.token = token;
        console.log(token);
        state.userData = data.user;
        state.error = null;
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.status = 'refresh failed';
        state.error = action.error.message || 'Refresh failed';
        state.token = ''; // need to be checked
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'register success';
        state.token = action.payload.token;
        state.userData = action.payload.data.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'register failed';
        state.error = action.error.message || 'Register failed';
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.status = 'update success';
        state.userData = action.payload.data.user;
        state.error = null;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.status = 'update failed';
        state.error = action.error?.message || 'Updating user info failed';
      })
      .addCase('currentUser/stateToIdle', (state) => {
        state.status = 'idle'; // Reset status to 'idle' on successful logout
      });
  },
});

// Export actions and reducer
//export const logoutSuccess = createAction('currentUser/stateToIdle');

export const { logout } = currentUserSlice.actions;

export default currentUserSlice.reducer;
