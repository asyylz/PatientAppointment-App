import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import useAxios from '../hooks/useAxios';

const initialState: CurrentUser = {
  status: null,
  token: '',
  data: { currentUser: null },
  image: '',
};

export const login = createAsyncThunk<
  CurrentUser,
  { email: string; password: string }
>('currentUser/login', async (credentials) => {
  const response = await axios.post(
    'http://localhost:3000/api/v1/users/login',
    credentials
  );
  return response.data;
});

export const logout = createAsyncThunk<void, string, { rejectValue: string }>(
  'currentUser/logout',
  async (token: string, { rejectWithValue }) => {
    console.log('elizah');
    // const axiosWithToken = useAxios();
    try {
      console.log('asiye');
      await axios.get('http://localhost:3000/api/v1/users/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setImagePath: (state, action: PayloadAction<string>) => {
      state.image = action.payload;
    },
    // clearUser: (state) => {
    //   state.status = 'idle';
    //   state.token = '';
    //   state.data = { currentUser: null };
    //   state.image = '';
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'success';
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
        state.status = 'success';
        state.token = '';
        state.data = { currentUser: null };
        state.image = '';
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Logout failed';
      });
  },
});

const { reducer } = currentUserSlice;

export const { setImagePath } = currentUserSlice.actions;

export default reducer;
