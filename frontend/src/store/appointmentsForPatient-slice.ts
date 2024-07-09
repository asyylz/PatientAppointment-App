import {
  fetchEntitiesWithIdAndToken,
  createEntitySlice,
} from './create-generic-slice';

export const patientAppointmentsUrl = (id: string) => {
  return `http://localhost:3000/api/v1/appointments/patients/${id}`;
};

export const fetchAppointmentsForPatient =
  fetchEntitiesWithIdAndToken<Appointment>(
    'appointmentsForPatient',
    patientAppointmentsUrl
  );

const appointmentsForPatientSlice = createEntitySlice<Appointment>(
  'appointmentsForPatient',
  fetchAppointmentsForPatient
);

const { actions, reducer } = appointmentsForPatientSlice;

export const appointmentsForPatientActions = actions;
export default reducer;
