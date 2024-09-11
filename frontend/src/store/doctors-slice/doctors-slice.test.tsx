import doctorsReducer from './doctors-slice';
import doctors from '../../../public/test_data/doctors.json';
import { doctorsUrl } from './doctors-slice';
import { doctorActions } from './doctors-slice';
import doctorWithAvailabilities from '../../../public/test_data/doctorWithAvailabilities.json';

describe('Doctors reducer', () => {
  it('1--Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const result = doctorsReducer(initialState, action);
    expect(result).toEqual({
      entities: [],
      status: 'idle',
      error: null,
    });
  });
  it('2--Should convert the doctors received to an object', () => {
    const initialState = undefined;
    const action = {
      type: 'doctors/fetch/fulfilled',
      payload: doctors,
    };
    const result: ExtendedEntityState<Doctor> = doctorsReducer(
      initialState,
      action
    );
    expect(Object.keys(result.entities).length).toEqual(doctors.length);
    expect(result.status).toEqual('succeeded');
    doctors.forEach((doctor, index) => {
      expect(result.entities[index]['_id']).toEqual(doctor._id);
    });
  });
  it('3--Should set selectedDoctor', () => {
    const initialState: ExtendedEntityState<Doctor> = {
      entities: [...doctors],
      status: 'succeeded',
      error: null,
      selectedDoctor: null,
    };

    const result: ExtendedEntityState<Doctor> = doctorsReducer(
      initialState,
      doctorActions.selectDoctor(doctorWithAvailabilities[0] as Doctor)
    );
    expect(result.selectedDoctor).toEqual(doctorWithAvailabilities[0]);
  });
});
describe('doctorFetchURL', () => {
  it('1--Should return the correct URL with pagination', () => {
    const expectedUrl = `http://localhost:3000/api/v1/doctors?limit=4&page=1&sort=firstName`;
    const result = doctorsUrl(expectedUrl);
    expect(result).toBe(expectedUrl);
  });
});
