import * as axiosInterceptors from '../../services/axiosInterceptors';

import {
  fetchEntities,
  fetchEntitiesWithId,
} from '../create-generic-slice/create-generic-slice';

import doctorsReducer, { addEntity } from '../doctors-slice/doctors-slice';

jest.mock('../../services/axiosInterceptors');

interface TestAction {
  type: string;
  payload?: any;
  [key: string]: any;
}
const actionApplier = (
  initialState: string | object | undefined,
  action: TestAction
) => {
  const state = doctorsReducer(
    initialState as EntityStateForAppointments<AppointmentsForDoctor>,
    action
  );
  return state;
};

//jest.mock('redux-persist');
describe('Create-generic-slice thunks', () => {
  describe('1--FetchEntities', () => {
    it('1--fetchEntities fulfilled', async () => {
      const initialState: ExtendedEntityState<Doctor> = {
        status: 'idle',
        entities: [],
        selectedDoctor: null,
        error: null,
      };
      const dispatch = jest.fn();
      const entity = 'doctors';
      const url = 'http://localhost:3000/api/v1/doctors?limit=2&page=1';
      axiosInterceptors.axiosInterceptorsWithoutToken.get = jest
        .fn()
        .mockResolvedValue({
          data: {
            status: 'success',
            //result: doctors.length,
            data: {
              doctors: [{ id: 1, name: 'Dr. Smith' }],
            },
          },
        });
      const thunk = fetchEntities(entity);
      await thunk(url)(dispatch, () => initialState, undefined);
      const { calls } = dispatch.mock;
      //console.log(calls);
      //console.log(calls[1][0].payload);
      // Assertions
      expect(dispatch).toHaveBeenCalledTimes(2);

      expect(calls[0][0].type).toEqual(`${entity}/fetch/pending`);
      expect(calls[1][0].type).toEqual(`${entity}/fetch/fulfilled`);

      expect(calls[1][0].payload).toEqual([{ id: 1, name: 'Dr. Smith' }]);
    });
    it('1--fetchEntities rejected', async () => {
      const initialState: ExtendedEntityState<Doctor> = {
        status: 'idle',
        entities: [],
        selectedDoctor: null,
        error: null,
      };
      const dispatch = jest.fn();
      const entity = 'doctors';
      const url = 'http://localhost:3000/api/v1/doctors?limit=2&page=1';
      axiosInterceptors.axiosInterceptorsWithoutToken.get = jest
        .fn()
        .mockRejectedValue({
          response: {
            data: { error: 'Fetch failed!' },
            status: 401, // Assuming 401 Unauthorized
            statusText: 'Unauthorized',
          },
          message: 'Fetch request failed with status code 500',
        });
      const thunk = fetchEntities(entity);

      await thunk(url)(dispatch, () => initialState, undefined);
      const { calls } = dispatch.mock;
      console.log(calls);
      console.log(calls[1][0].error.message);
      // Assertions
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(calls[0][0].type).toEqual(`${entity}/fetch/pending`);
      expect(calls[1][0].type).toEqual(`${entity}/fetch/rejected`);
      expect(calls[1][0].error.message).toEqual(
        'Fetch request failed with status code 500'
      );
    });
  });
  describe('2--FetchEntitiesWithId', () => {
    it('1--fetchEntitiesWithId fulfilled', async () => {
      const initialState: EntityState<Review> = {
        status: 'idle',
        entities: [],
        error: null,
      };
      const dispatch = jest.fn();
      const entity = 'reviews';
      const url = (id: string, pagination: number | undefined) =>
        `http://localhost:3000/api/v1/reviews/${id}?limit=2&page=${pagination}`;
      axiosInterceptors.axiosInterceptorsWithToken.get = jest
        .fn()
        .mockResolvedValue({
          data: {
            status: 'success',
            //result: doctors.length,
            data: {
              reviews: [{ _id: '1', comment: 'mock comment' }],
            },
          },
        });
      const thunk = fetchEntitiesWithId(entity, url);

      await thunk({ id: 'mockid', pagination: 2 })(
        dispatch,
        () => initialState,
        undefined
      );
      const { calls } = dispatch.mock;
      //console.log(calls);
      //console.log(calls[1][0].payload);
      // Assertions
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(calls[0][0].type).toEqual(`${entity}/fetchWithId/pending`);
      expect(calls[1][0].type).toEqual(`${entity}/fetchWithId/fulfilled`);
      //expect(calls[1][0].payload).toEqual([{ id: 1, name: 'Dr. Smith' }]);
    });
    it('2--fetchEntitiesWithId rejected', () => {});
  });
});

// we run these test over doctorsReducer
describe('States should change with fetchEntities actions', () => {
  describe('fetchEntities', () => {
    it('1--Should return the initial state when passed an empty action', () => {
      const result = actionApplier(undefined, { type: '' });
      expect(result).toEqual({
        status: 'idle',
        entities: [],
        error: null,
      });
    });
    it('2--Should return loading', () => {
      const result = actionApplier(undefined, {
        type: 'doctors/fetch/pending',
      });
      expect(result).toEqual({
        status: 'loading',
        entities: [],
        error: null,
      });
    });

    it('3--Should return fulfilled', () => {
      const payload = {
        doctors: [
          {
            _id: '1',
            name: 'Dr. Smith',
          },
        ],
      };
      const result = actionApplier(undefined, {
        type: 'doctors/fetch/fulfilled',
        payload,
      });

      expect(result).toEqual({
        status: 'succeeded',
        entities: {
          doctors: [
            {
              _id: '1',
              name: 'Dr. Smith',
            },
          ],
        },
        error: null,
      });
    });
    it('3--Should return rejected', () => {
      const result = actionApplier(undefined, {
        type: 'doctors/fetch/rejected',
        error: { message: 'Fetch request failed' },
      });

      expect(result).toEqual({
        status: 'failed',
        entities: [],
        error: 'Fetch request failed',
      });
    });
    it('4--Should return rejected with payload error message', () => {
      const payload = { message: 'Fetch request failed--payload' };
      const result = actionApplier(undefined, {
        type: 'doctors/fetch/rejected',
        payload,
      });

      expect(result).toEqual({
        status: 'failed',
        entities: [],
        error: 'Fetch request failed--payload',
      });
    });
    it('5--Should return rejected with no error data', () => {
      const result = actionApplier(undefined, {
        type: 'doctors/fetch/rejected',
      });
      expect(result).toEqual({
        status: 'failed',
        entities: [],
        error: 'Failed to fetch doctors',
      });
    });
  });
});

describe('entitySlice reducers', () => {
  it('should handle addEntity', () => {
    // Arrange
    const initialState: EntityState<Doctor> = {
      entities: [],
      status: 'idle',
      error: null,
    };
    const newEntity = { _id: '1', firstName: 'Test Entity' } as Doctor;

    // Act
    const resultState = doctorsReducer(initialState, addEntity(newEntity));

    // Assert
    expect(resultState.entities).toHaveLength(1);
    expect(resultState.entities[0]).toEqual(newEntity);
  });
});
