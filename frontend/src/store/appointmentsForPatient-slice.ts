import {
  fetchEntitiesWithIdAndToken,
  createEntitySlice,
} from './create-generic-slice';


export const patientAppointmentsUrl = (id: string, pagination?: number) => {
  return `http://localhost:3000/api/v1/appointments/patients/${id}?limit=10&page=${pagination}`;
};

export const fetchAppointmentsForPatient =
  fetchEntitiesWithIdAndToken<AppointmentsForPatient>(
    'appointmentsForPatient',
    patientAppointmentsUrl
  );

const appointmentsForPatientSlice = createEntitySlice<AppointmentsForPatient>(
  'appointmentsForPatient',
  fetchAppointmentsForPatient
);

const { actions, reducer } = appointmentsForPatientSlice;

export const appointmentsForPatientActions = actions;
export default reducer;
