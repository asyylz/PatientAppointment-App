import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toastErrorNotify, toastSuccessNotify } from './../helper/ToastNotify';

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
>('signup', async (credentials, { rejectWithValue }) => {
  console.log(credentials);
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/users/signup',
      credentials
    );
    toastSuccessNotify('Successfully registered!');
    console.log(response.data);
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
export const login = createAsyncThunk<
  CurrentUserPayload,
  { email: string; password: string },
  { rejectValue: string }
>('currentUser/login', async (credentials, { rejectWithValue }) => {
  console.log(credentials);
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/users/login',
      credentials
    );
    toastSuccessNotify('Successfully login!');
    //console.log(response.data);
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
export const logout = createAsyncThunk<void, string, { rejectValue: string }>(
  'currentUser/logout',
  async (token: string, { rejectWithValue }) => {
    try {
      await axios.get('http://localhost:3000/api/v1/users/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toastSuccessNotify('Successfully logout!');
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
    }
  }
);

/* ------------------------------------------------------ */
/*                         UPDATE                         */
/* ------------------------------------------------------ */
export const updateUserInfo = createAsyncThunk<
  CurrentUserPayload,
  { token: string; userUpdatedFormData: FormData },
  { rejectValue: string }
>('currentUser/updateProfile', async (tokenAndData, { rejectWithValue }) => {
  console.log(tokenAndData.userUpdatedFormData.get('address'));
  try {
    const response = await axios.patch(
      'http://localhost:3000/api/v1/users/updateUser',
      tokenAndData.userUpdatedFormData,
      {
        headers: {
          Authorization: `Bearer ${tokenAndData.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
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
});

/* ------------------------------------------------------ */
/*                         FORGET                         */
/* ------------------------------------------------------ */
export const forgotPassword = createAsyncThunk<
  CurrentUserPayload,
  { email: string },
  { rejectValue: string }
>('currentUser/forgotPassword', async (email, { rejectWithValue }) => {
  console.log(email);
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
    console.log(password, passwordConfirm, resetToken);
    console.log('Asiye');

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
  UpdatedUserPasswordAndToken,
  { rejectValue: string }
>('currentUser/updatePassword', async (data, { rejectWithValue }) => {
  const { oldPassword, newPassword, confirmNewPassword, token } = data;
  console.log(oldPassword, newPassword, confirmNewPassword, token);

  try {
    const response = await axios.patch(
      'http://localhost:3000/api/v1/users/updateMyPassword',
      { oldPassword, newPassword, confirmNewPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
        console.log(action.payload);
        //state.userData = action.payload.data.user;
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
