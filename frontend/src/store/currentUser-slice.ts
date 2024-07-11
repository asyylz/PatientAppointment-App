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

// Async thunk for login
export const login = createAsyncThunk<
  CurrentUserPayload,
  { email: string; password: string },
  { rejectValue: string }
>('currentUser/login', async (credentials, { rejectWithValue }) => {
  try {
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

export const updateUserInfo = createAsyncThunk<
  CurrentUserPayload,
  { token: string; updatedUserData: object },
  { rejectValue: string }
>('currentUser/updateProfile', async (tokenAndData, { rejectWithValue }) => {
  console.log(tokenAndData.token);
  console.log(tokenAndData.updatedUserData);
  try {
    const response = await axios.patch(
      'http://localhost:3000/api/v1/users/updateUser',
      tokenAndData.updatedUserData,
      {
        headers: {
          Authorization: `Bearer ${tokenAndData.token}`,
        },
      }
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
