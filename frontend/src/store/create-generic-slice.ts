import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchEntities = <T>(entity: string, url: string) =>
  createAsyncThunk<T[]>(`${entity}/fetch`, async () => {
    console.log(url)
    const response = await axios.get(url);
    console.log(`${entity} data:`, response.data.data);

    return response.data.data[entity]; // Assuming the data is under the entity property
  });


  export const fetchEntitiesWithId = <T>(
    entity: string,
    url: (id: string) => string
  ) =>
    createAsyncThunk<T[], string>(`${entity}/fetchWithId`, async (id: string) => {
      console.log(id)
      console.log(url(id))
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
        console.log(action.payload);
        state.entities.push(action.payload);
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchEntityThunk.pending, (state) => {
          console.log(fetchEntityThunk.pending);
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
