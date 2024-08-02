import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInterceptors from '../hooks/axiosInterceptors';

/* ------------------------------------------------------ */
/*                        ENTITIES                        */
/* ------------------------------------------------------ */
type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

// export const fetchEntities1 = <T>(
//   entity: string,
//   url: string | ((pagination?: number, departmentId?: string) => string), // we catch optional pagination argument
//   method: HttpMethod = 'get'
// ) =>
//   createAsyncThunk<T | object, { pagination?: number; departmentId?: string }>(
//     `${entity}/fetch`,
//     async ({ pagination, departmentId } = {}) => {
//       try {
//         const axiosMethods: Record<
//           HttpMethod,
//           (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>
//         > = {
//           get: axios.get,
//           post: (url, config) => axios.post(url, {}, config),
//           patch: (url, config) => axios.patch(url, {}, config),
//           delete: axios.delete,
//         };
//         const requestUrl =
//           typeof url === 'function' ? url(pagination, departmentId) : url;
//         const response = await axiosMethods[method](requestUrl);
//         console.log(`${entity} data:`, response.data.data);
//         return response.data.data[entity];
//       } catch (err) {
//         console.log(err);
//         throw err;
//       }
//     }
//   );

export const fetchEntities = <T>(entity: string, method: HttpMethod = 'get') =>
  createAsyncThunk<T | object, string>(
    `${entity}/fetch`,
    async (url, { rejectWithValue }) => {
      //console.log(url);
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
        const response = await axiosMethods[method](url);
        console.log(`${entity} data:`, response.data.data);
        return response.data.data[entity];
      } catch (err) {
        console.error(err);
        return rejectWithValue(err); // Adjust error handling as needed
      }
    }
  );

/* ------------------------------------------------------ */
/*                    ENTITIES WITH ID                    */
/* ------------------------------------------------------ */
export const fetchEntitiesWithId = <T>(
  entity: string,
  url: (id: string, pagination?: number) => string
) =>
  createAsyncThunk<T, { id: string; pagination?: number }>(
    `${entity}/fetchWithId`,
    async ({ id, pagination }) => {
      try {
        const requestUrl = url(id, pagination);
        const response = await axios.get(requestUrl);
        //console.log(id)
        console.log(response.data.data);
        return response.data.data[entity]; // Assuming the data is under the entity property
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  );

/* ------------------------------------------------------ */
/*            ENTITIES WITH TOKEN AND ID                  */
/* ------------------------------------------------------ */
export const fetchEntitiesWithIdAndToken = <T>(
  entity: string,
  url: (id: string, pagination?: number) => string
) =>
  createAsyncThunk<T, { id: string; token: string; pagination?: number }>(
    `${entity}/fetchWithIdAndToken`,
    async ({ id, pagination }, { rejectWithValue }) => {
      // Generate the URL, handle undefined pagination if needed
      const requestUrl = url(id, pagination);
      try {
        const { default: axiosInterceptors } = await import(
          '../hooks/axiosInterceptors'
        );
        // Make the API request with the token in the headers
        const response = await axiosInterceptors.get(requestUrl,
        //    {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      );
        // return response.data.data[entity];
        console.log(response.data);
        return response.data.data;
      } catch (err) {
        // Check if `err` has `response` property
        if (err.response) {
          // Return a detailed error message using `rejectWithValue`
          return rejectWithValue({
            message: err.response.data.message || 'An error occurred',
            details: err.response.data.error || err.message,
          });
        } else {
          // Handle cases where there is no response property
          return rejectWithValue({
            message: err.message || 'An unknown error occurred',
          });
        }
      }
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
          console.log(action);
          if (action.payload) {
            state.error = action.payload.message;
          } else {
            state.error = action.error.message || `Failed to fetch ${entity}`;
          }
        });

      // Apply additional reducers if provided
      if (additionalReducers) {
        additionalReducers(builder);
      }
    },
  });
};

export default createEntitySlice;
