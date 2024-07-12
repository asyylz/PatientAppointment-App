import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createAction,
  Draft,
} from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { toastErrorNotify, toastSuccessNotify } from './../helper/ToastNotify';

type WritableDraft<T> = Draft<T> & Partial<T>;

const initialState: CurrentUser = {
  status: 'idle',
  token: '',
  userData: null,
  image: '',
};
// Async thunk for register
export const register = createAsyncThunk<
  CurrentUserPayload,
  UserData,
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
// Async thunk for login
export const login = createAsyncThunk<
  CurrentUserPayload,
  { email: string; password: string },
  { rejectValue: string }
>('currentUser/login', async (credentials, { rejectWithValue }) => {
  try {
    console.log(credentials);
    const response = await axios.post(
      'http://localhost:3000/api/v1/users/login',
      credentials
    );
    toastSuccessNotify('Successfully login!');
    console.log(response.data);
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

// Async thunk for logout
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

// export const updateUserInfo = createAsyncThunk<
//   CurrentUserPayload,
//   { token: string; updatedUserData: Record<string, any> },
//   { rejectValue: string }
// >('currentUser/updateProfile', async (tokenAndData, { rejectWithValue }) => {
//   const formData = new FormData();
//   for (const key in tokenAndData.updatedUserData) {
//     formData.append(key, tokenAndData.updatedUserData[key]);
//   }
//   console.log(formData);
//   try {
//     const response = await axios.patch(
//       'http://localhost:3000/api/v1/users/updateUser',
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${tokenAndData.token}`,
//           'Content-Type': 'multipart/form-data', // Ensuring correct content type
//         },
//       }
//     );

//     toastSuccessNotify('Successfully updated!');
//     return response.data; // Return the response data
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;
//       if (axiosError.response?.status === 401) {
//         toastErrorNotify(
//           `${(axiosError.response.data as { message: string }).message}`
//         );
//       }
//       return rejectWithValue(error.message);
//     }
//     return rejectWithValue('An unexpected error occurred');
//   }
// });

export const updateUserInfo = createAsyncThunk<
  CurrentUserPayload,
  { token: string; updatedUserData: Record<string, any> },
  { rejectValue: string }
>('currentUser/updateProfile', async (tokenAndData, { rejectWithValue }) => {
  let requestData: FormData | Record<string, any> =
    tokenAndData.updatedUserData;
  let headers = {
    Authorization: `Bearer ${tokenAndData.token}`,
  };

  if (tokenAndData.updatedUserData.image) {
    const formData = new FormData();
    for (const key in tokenAndData.updatedUserData) {
      formData.append(key, tokenAndData.updatedUserData[key]);
    }
    requestData = formData;
    headers['Content-Type'] = 'multipart/form-data';
  }

  try {
    const response = await axios.patch(
      'http://localhost:3000/api/v1/users/updateUser',
      requestData,
      { headers }
    );

    toastSuccessNotify('Successfully updated!');
    return response.data; // Return the response data
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

// Create the currentUserSlice
const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setImagePath: (state, action: PayloadAction<string>) => {
      state.image = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'login success';
        state.token = action.payload.token;
        state.userData = action.payload.data.user as WritableDraft<userData>;
        state.image = action.payload.image;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message);
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'logout success';
        state.token = '';
        state.userData = null;
        state.image = '';
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
        state.userData = action.payload.data.user as WritableDraft<userData>;
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

export const { setImagePath } = currentUserSlice.actions;
export default currentUserSlice.reducer;
