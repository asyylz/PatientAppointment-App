import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface EntityState<T> {
  entities: T[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const fetchEntities = <T>(entity: string, url: string) =>
  createAsyncThunk<T[]>(`${entity}/fetch`, async () => {
    const response = await axios.get(url);
    console.log(`${entity} data:`, response.data.data);
    return response.data.data[entity]; // Assuming the data is under the entity property
  });

export const createEntitySlice = <T>(entity: string, fetchEntityThunk: any) => {
    
  const initialState: EntityState<T> = {
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
    },
  });
};

export default createEntitySlice;
