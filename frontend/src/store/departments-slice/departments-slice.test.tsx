import departmentsReducer from '../departments-slice/departments-slice';
import departments from '../../../public/test_data/departments.json';

describe('departments reducer', () => {
  it('1--Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const result = departmentsReducer(initialState, action);
    expect(result).toEqual({
      entities: [],
      status: 'idle',
      error: null,
    });
    //  expect(departmentsReducer(undefined, { type: '' })).toEqual({
    //   entities: [],
    //   status: 'idle',
    //   error: null,
    // });
  });
  it('2--Should convert the departments received to an object', () => {
    const initialState = undefined;
    const action = {
      type: 'departments/fetch/fulfilled',
      payload: departments,
    };
    const result: EntityState<Department> = departmentsReducer(
      initialState,
      action
    );
    expect(result.status).toEqual('succeeded');
    expect(Object.keys(result.entities).length).toEqual(departments.length);
    departments.forEach((department, index) => {
      expect(result.entities[index]['_id']).toEqual(department._id);
    });
  });
});
