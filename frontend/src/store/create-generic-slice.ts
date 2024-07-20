import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/* ------------------------------------------------------ */
/*                        ENTITIES                        */
/* ------------------------------------------------------ */
type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

export const fetchEntities = <T>(
  entity: string,
  url: string | ((pagination?: number) => string), // we catch optional pagination argument
  method: HttpMethod = 'get'
) =>
  createAsyncThunk<T | object, { pagination?: number }>(
    `${entity}/fetch`,
    async ({ pagination } = {}) => {
      try {
        const axiosMethods: Record<
          HttpMethod,
          (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>
        > = {
          get: axios.get,
          post: (url, config) => axios.post(url, {}, config),
          patch: (url, config) => axios.patch(url, {}, config),
          delete: axios.delete,
        };
        const requestUrl = typeof url === 'function' ? url(pagination) : url;
        const response = await axiosMethods[method](requestUrl);
        console.log(`${entity} data:`, response.data.data);
        return response.data.data[entity];
      } catch (err) {
        console.log(err);
        throw err;
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
    try {
      const response = await axios.get(url(id));
      //console.log(id)
      console.log(response.data.data)
      return response.data.data[entity]; // Assuming the data is under the entity property
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

/* ------------------------------------------------------ */
/*            ENTITIES WITH TOKEN AND ID                  */
/* ------------------------------------------------------ */
export const fetchEntitiesWithIdAndToken = <T>(
  entity: string,
  url: (id: string, pagination: number) => string
) =>
  createAsyncThunk<T, { id: string; token: string; pagination: number }>(
    `${entity}/fetchWithIdAndToken`,
    async ({ id, token, pagination }) => {
      const response = await axios.get(url(id, pagination), {
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
