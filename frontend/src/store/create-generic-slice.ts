import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

/* ------------------------------------------------------ */
/*                        ENTITIES                        */
/* ------------------------------------------------------ */
export const fetchEntities = <T>(entity: string) =>
  createAsyncThunk<T | object, string>(`${entity}/fetch`, async (url) => {
    const { axiosInterceptorsWithoutToken } = await import(
      '../hooks/axiosInterceptors'
    );

    const response = await axiosInterceptorsWithoutToken.get(url);

    return response.data.data[entity];
  });

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
      const { axiosInterceptorsWithToken } = await import(
        '../hooks/axiosInterceptors'
      );
      const requestUrl = url(id, pagination);
      //console.log(requestUrl); // http://localhost:3000/api/v1/appointments/doctors/mockDoctorID same url

      const response = await axiosInterceptorsWithToken.get(requestUrl);
      //console.log(response); 
      console.log(response.data.data);
      return response.data.data; // Assuming the data is under the entity property
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
        console.log(action);
        state.entities.push(action.payload);
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchEntityThunk.pending, (state) => {
          //console.log(action);
          state.status = 'loading';
        })
        .addCase(
          fetchEntityThunk.fulfilled,
          (state, action: PayloadAction<T | object>) => {
            //console.log(action);
            state.status = 'succeeded';

            state.entities = action.payload;
            state.error = null;
            //console.log('State updated:', state.entities); // Debug state update
          }
        )
        .addCase(fetchEntityThunk.rejected, (state, action) => {
          //console.log(action);
          state.status = 'failed';
          console.log(action)
          if (action.payload) {
            console.log(action.payload);
            state.error = action.payload?.message;
          } else {
            state.error = action.error?.message || `Failed to fetch ${entity}`;
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
