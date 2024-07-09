import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createAxiosInstance } from '../helper/axiosInstance';

/* ------------------------------------------------------ */
/*                        ENTITIES                        */
/* ------------------------------------------------------ */
type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

export const fetchEntities = <T>(
  entity: string,
  url: string,
  method: HttpMethod = 'get'
) =>
  createAsyncThunk<T | object, object | void>(
    `${entity}/fetch`,
    async (arg) => {
      try {
        const axiosMethods: Record<
          HttpMethod,
          (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>
        > = {
          get: axios.get,
          post: (url, config) => axios.post(url, arg, config),
          patch: (url, config) => axios.patch(url, arg, config),
          delete: axios.delete,
        };
        const response = await axiosMethods[method](url);
        console.log(`${entity} data:`, response.data.data);
        return response.data.data[entity];
      } catch (err) {
        console.log(err);
      }
    }
  );

/* ------------------------------------------------------ */
/*                    ENTITIES WITH ID                    */
/* ------------------------------------------------------ */
export const fetchEntitiesWithId = <T>(
  entity: string,
  url: (id: string) => string
) =>
  createAsyncThunk<T, string>(`${entity}/fetchWithId`, async (id: string) => {
    const response = await axios.get(url(id));
    return response.data.data[entity]; // Assuming the data is under the entity property
  });

/* ------------------------------------------------------ */
/*            ENTITIES WITH TOKEN AND ID                  */
/* ------------------------------------------------------ */
export const fetchEntitiesWithIdAndToken = <T>(
  entity: string,
  url: (id: string) => string
) =>
  createAsyncThunk<T, { id: string; token: string }>(
    `${entity}/fetchWithIdAndToken`,
    async ({ id, token }) => {
      console.log(entity);
      const response = await axios.get(url(id), {
        headers: { Authorization: `Bearer ${token}` },
      });

      // return response.data.data[entity];
      return response.data.data;
    }
  );

/* ------------------------------------------------------ */
/*                     CREATING SLICE                     */
/* ------------------------------------------------------ */
export const createEntitySlice = <T>(
  entity: string,
  fetchEntityThunk: any,
  additionalReducers?: (builder: any) => void
) => {
  const initialState:
    | ExtendedEntityState<T>
    | EntityState<T>
    | EntityStateForUser<T> = {
    entities: [],
    status: 'idle',
    error: null,
  };

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
          (state, action: PayloadAction<T | object>) => {
            state.status = 'succeeded';
            state.entities = action.payload;
            state.error = null;

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
