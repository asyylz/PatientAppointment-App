import appointmentsForPatientReducer from './appointmentsForPatient-slice';
import { patientAppointmentsUrl } from './appointmentsForPatient-slice';
import appointmentsForPatient from '../../public/appointmentsForPatient.json';

describe('AppointmentsForPatientReducer reducer', () => {
  it('1--Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const result = appointmentsForPatientReducer(initialState, action);
    expect(result).toEqual({
      entities: [],
      status: 'idle',
      error: null,
    });
  });
  it('2--Should convert the appointments received to an object', () => {
    const initialState = undefined;
    const action = {
      type: 'appointmentsForPatient/fetchWithId/fulfilled',
      payload: appointmentsForPatient,
    };
    const result: EntityStateForAppointments<AppointmentsForPatient> =
      appointmentsForPatientReducer(initialState, action);
  
    expect(Object.keys(result.entities).length).toEqual(
      appointmentsForPatient.length
    );
    expect(result.status).toEqual('succeeded');
    appointmentsForPatient.forEach((appointment, index) => {
      expect(result.entities[index]['_id']).toEqual(appointment._id);
    });
  });
});
describe('patientAppointmentsUrl', () => {
  it('1--Should return the correct URL with pagination', () => {
    const id = '12345';
    const pagination = 2;
    const expectedUrl = `http://localhost:3000/api/v1/appointments/patients/12345?limit=10&page=2`;
    const result = patientAppointmentsUrl(id, pagination);
    expect(result).toBe(expectedUrl);
  });

  it('2--Should return the correct URL without pagination', () => {
    const id = '12345';
    const expectedUrl = `http://localhost:3000/api/v1/appointments/patients/12345?limit=10&page=undefined`;
    const result = patientAppointmentsUrl(id);
    expect(result).toBe(expectedUrl);
  });
});
