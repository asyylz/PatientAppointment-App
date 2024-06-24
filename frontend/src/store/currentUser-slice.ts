import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { toastErrorNotify, toastSuccessNotify } from './../helper/ToastNotify';

// Define the initial state
const initialState: CurrentUser = {
  status: 'idle',
  token: '',
  data: { currentUser: null },
  image: '',
};

// Async thunk for login
export const login = createAsyncThunk<
  CurrentUser,
  { email: string; password: string }
>('currentUser/login', async (credentials) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/users/login',
      credentials
    );
    toastSuccessNotify('Successfully login!');
    return response.data;
  } catch (err) {
    console.log(err);
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
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

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
        state.data = action.payload.data;
        state.image = action.payload.image;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'logout success';
        state.token = '';
        state.data = { currentUser: null };
        state.image = '';
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Logout failed';
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
