import appointmentsForDoctorReducer from './appointmentsForDoctor-slice';
import { doctorAppointmentsUrl } from './appointmentsForDoctor-slice';
import appointmentsForDoctor from '../../../public/test_data/appointmentsForDoctor.json';

describe('AppointmentsForDoctorReducer reducer', () => {
  it('1--Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const result = appointmentsForDoctorReducer(initialState, action);
    expect(result).toEqual({
      entities: [],
      status: 'idle',
      error: null,
    });
  });
  it('2--Should convert the appointments received to an object', () => {
    const initialState = undefined;
    const action = {
      type: 'appointmentsForDoctor/fetchWithId/fulfilled',
      payload: appointmentsForDoctor,
    };
    const result: EntityStateForAppointments<AppointmentsForDoctor> =
      appointmentsForDoctorReducer(initialState, action);

    expect(Object.keys(result.entities).length).toEqual(
      appointmentsForDoctor.length
    );
    expect(result.status).toEqual('succeeded');
    appointmentsForDoctor.forEach((appointment, index) => {
      expect(result.entities[index]['_id']).toEqual(appointment._id);
    });
  });
});
describe('appointmentsForDoctor FetchURL', () => {
  it('1--Should return the correct URL with id', () => {
    const testId = '1234';
    const expectedUrl = `http://localhost:3000/api/v1/appointments/doctors/1234`;
    const result = doctorAppointmentsUrl(testId);
    // console.log(expectedUrl)
    expect(result).toBe(expectedUrl);
  });
});
