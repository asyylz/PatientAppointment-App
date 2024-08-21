import * as axiosInterceptors from '../hooks/axiosInterceptors';
//import doctors from './../../public/doctors.json';
import { fetchEntities, fetchEntitiesWithId } from './create-generic-slice';

jest.mock('../hooks/axiosInterceptors');

//jest.mock('redux-persist');
describe('Create-generic-slice thunks', () => {
  describe('1--Fetch Entities', () => {
    it('1--fetchEntities  fulfilled status', async () => {
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
    it('1--fetchEntities rejected status', async () => {
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
    describe('2--Fetch Entities With Id', () => {
      it('1--fetchEntitiesWithId fulfilled status', async () => {
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
      it('2--fetchEntitiesWithId rejected status', () => {});
    });
  });
});

