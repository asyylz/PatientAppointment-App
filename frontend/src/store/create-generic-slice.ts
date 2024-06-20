import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';

type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

// Define a mapping type for axios methods
interface AxiosMethods {
  get: typeof axios.get;
  post: typeof axios.post;
  patch: typeof axios.patch;
  delete: typeof axios.delete;
}

export const fetchEntities = <T>(
  entity: string,
  url: string,
  method: HttpMethod = 'get'
  //requestBody?: object // Making requestBody optional
) =>
  createAsyncThunk<T[], object | void>(`${entity}/fetch`, async (arg) => {
    const axiosMethods: AxiosMethods = {
      get: axios.get,
      post: axios.post,
      patch: axios.patch,
      delete: axios.delete,
    };

    let axiosConfig: AxiosRequestConfig = {};

    if (arg && (method === 'post' || method === 'patch')) {
      axiosConfig = {
        data: arg,
      };
    }

    const response = await axiosMethods[method](url, axiosConfig);

    console.log(`${entity} data:`, response.data.data);
    return response.data.data[entity]; // Assuming the data is under the entity property
  });

export const fetchEntitiesWithId = <T>(
  entity: string,
  url: (id: string) => string
) =>
  createAsyncThunk<T[], string>(`${entity}/fetchWithId`, async (id: string) => {
    const response = await axios.get(url(id));
    return response.data.data[entity]; // Assuming the data is under the entity property
  });

export const createEntitySlice = <T>(
  entity: string,
  fetchEntityThunk: any,
  additionalReducers?: (builder: any) => void
) => {
  const initialState: ExtendedEntityState<T> = {
    entities: [],
    status: 'idle',
    error: null,
  };
  //console.log(entity);
  return createSlice({
    name: entity,
    initialState,
    reducers: {
      addEntity: (state, action: PayloadAction<T>) => {
        state.entities.push(action.payload);
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchEntityThunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(
          fetchEntityThunk.fulfilled,
          (state, action: PayloadAction<T[]>) => {
            state.status = 'succeeded';
            state.entities = action.payload;

            console.log('State updated:', state.entities); // Debug state update
          }
        )
        .addCase(fetchEntityThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || `Failed to fetch ${entity}`;
        });

      // Apply additional reducers if provided
      if (additionalReducers) {
        additionalReducers(builder);
      }
    },
  });
};

export default createEntitySlice;
