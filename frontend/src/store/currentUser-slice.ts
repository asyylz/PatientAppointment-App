import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toastErrorNotify, toastSuccessNotify } from './../helper/ToastNotify';
import axiosInterceptors from '../hooks/axiosInterceptors';
import {
  checkTokenExpiration,
  TOKEN_CHECK_INTERVAL,
} from './../hooks/axiosInterceptors';

const initialState: CurrentUser = {
  status: 'idle',
  token: '',
  userData: null,
};

/* ------------------------------------------------------ */
/*                        REGISTER                        */
/* ------------------------------------------------------ */
export const register = createAsyncThunk<
  CurrentUserPayload,
  FormData,
  { rejectValue: string }
>('currentUser/signup', async (credentials, { rejectWithValue }) => {
  console.log(credentials);

  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/users/signup',
      credentials
    );
    toastSuccessNotify('Successfully registered!');

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log(error.response?.data.message);
      toastErrorNotify(error.response?.data.message);
      if (axiosError.response?.status === 401) {
        toastErrorNotify(
          `${(axiosError.response.data as { message: string }).message}`
        );
      }
      return rejectWithValue(error.message);
    }
  }
});

/* ------------------------------------------------------ */
/*                          LOGIN                         */
/* ------------------------------------------------------ */
// Global variable to hold the interval ID
let intervalId: NodeJS.Timeout | null = null;
console.log(intervalId)
// Function to start the interval
const startTokenCheckInterval = () => {
  // Clear existing interval if it exists
  if (intervalId) {
    clearInterval(intervalId);
    console.log('Cleared existing interval with ID:', intervalId);
  }
  // Start a new interval
  intervalId = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
  console.log('Set new interval with ID:', intervalId);
};

// Function to stop the interval
const stopTokenCheckInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('Stopped interval with ID:', intervalId);
    intervalId = null; // Ensure to nullify the interval ID
  }
};


export const login = createAsyncThunk<
  CurrentUserPayload,
  { email: string; password: string },
  { rejectValue: string }
>('currentUser/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/users/login',
      credentials,
      { withCredentials: true }
    );
    toastSuccessNotify('Successfully login!');
    startTokenCheckInterval();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log(error);
      toastErrorNotify(error.response?.data.message);
      if (axiosError.response?.status === 401) {
        toastErrorNotify(
          `${(axiosError.response.data as { message: string }).message}`
        );
      }
      return rejectWithValue(error.message);
    }
  }
});

/* ------------------------------------------------------ */
/*                         LOGOUT                         */
/* ------------------------------------------------------ */

export const logout = createAsyncThunk<
  { status: string },
  void,
  { rejectValue: string }
>('currentUser/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInterceptors.get(
      'http://localhost:3000/api/v1/users/logout'
    );
    stopTokenCheckInterval(); // Stop the interval upon successful logout
    return response.data.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        toastErrorNotify(
          `${(axiosError.response.data as { message: string }).message}`
        );
      }
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

/* ------------------------------------------------------ */
/*                         UPDATE                         */
/* ------------------------------------------------------ */
export const updateUserInfo = createAsyncThunk<
  CurrentUserPayload,
  FormData,
  { rejectValue: string }
>(
  'currentUser/updateProfile',
  async (userUpdatedFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInterceptors.patch(
        'http://localhost:3000/api/v1/users/updateUser',
        userUpdatedFormData
      );

      toastSuccessNotify('Successfully updated!');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          toastErrorNotify(
            `${(axiosError.response.data as { message: string }).message}`
          );
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

/* ------------------------------------------------------ */
/*                         FORGET                         */
/* ------------------------------------------------------ */
export const forgotPassword = createAsyncThunk<
  CurrentUserPayload,
  { email: string },
  { rejectValue: string }
>('currentUser/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/users/forgotPassword',
      email
    );
    toastSuccessNotify(`Email sent to ${email.email} successfully!`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        toastErrorNotify(
          `${(axiosError.response.data as { message: string }).message}`
        );
      }
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

/* ------------------------------------------------------ */
/*                          RESET                         */
/* ------------------------------------------------------ */
export const resetPassword = createAsyncThunk<
  CurrentUserPayload,
  { password: string; passwordConfirm: string; resetToken: string },
  { rejectValue: string }
>(
  'currentUser/resetPassword',
  async ({ password, passwordConfirm, resetToken }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/users/resetPassword/${resetToken}`,
        {
          password,
          passwordConfirm,
        }
      );
      toastSuccessNotify(`Your password successfully re-set`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toastErrorNotify(
            `${(error.response.data as { message: string }).message}`
          );

          return rejectWithValue(error.response?.data?.message);
        }
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);
/* ------------------------------------------------------ */
/*                     UPDATE PASSWORD                    */
/* ------------------------------------------------------ */
export const updatePassword = createAsyncThunk<
  CurrentUserPayload,
  {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  },
  { rejectValue: string }
>('currentUser/updatePassword', async (data, { rejectWithValue }) => {
  const { oldPassword, newPassword, confirmNewPassword } = data;

  try {
    const response = await axiosInterceptors.patch(
      'http://localhost:3000/api/v1/users/updateMyPassword',
      { oldPassword, newPassword, confirmNewPassword }
    );
    toastSuccessNotify(`Your password successfully updated`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        toastErrorNotify(
          `${(error.response.data as { message: string }).message}`
        );

        return rejectWithValue(error.response?.data?.message);
      }
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

/* ------------------------------------------------------ */
/*                      REFRESH TOKEN                     */
/* ------------------------------------------------------ */
export const refreshSession = createAsyncThunk<
  CurrentUserPayload,
  void,
  { rejectValue: string }
>('currentUser/refreshSession', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInterceptors.post(
      'http://localhost:3000/api/v1/users/refresh-session'
    );

    toastSuccessNotify('Your session has been extended another 15 mins!');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log(error);
      toastErrorNotify(error.response?.data.message);
      if (axiosError.response?.status === 401) {
        toastErrorNotify(
          `${(axiosError.response.data as { message: string }).message}`
        );
      }
      return rejectWithValue(error.message);
    }
  }
});

/* ------------------------------------------------------ */
/*                          SLICE                         */
/* ------------------------------------------------------ */
const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    // setImagePath: (state, action: PayloadAction<string>) => {
    //   state.image = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, data } = action.payload;
        state.status = 'success';
        state.token = token;
        state.userData = data.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message);
        state.error = action.error.message || 'Login failed';
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        const { token, data } = action.payload;
        state.status = 'success';
        state.token = token;
        state.userData = data.user;
        state.error = null;
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Refresh failed';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'success';
        state.token = action.payload.token;
        state.userData = action.payload.data.user;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = 'success';
        state.token = action.payload.token;
        state.userData = action.payload.data.user;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.status = 'success';
        state.token = action.payload.token;
        state.userData = action.payload.data.user;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'logout success';
        state.token = '';
        state.userData = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Logout failed';
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.status = 'update success';
        state.userData = action.payload.data.user;
        state.error = null;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Update failed';
      })
      .addCase('currentUser/stateToIdle', (state) => {
        state.status = 'idle'; // Reset status to 'idle' on successful logout
      });
  },
});

// Export actions and reducer
export const logoutSuccess = createAction('currentUser/stateToIdle');

//export const { setImagePath } = currentUserSlice.actions;
export default currentUserSlice.reducer;
