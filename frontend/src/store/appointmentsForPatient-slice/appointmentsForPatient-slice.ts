import {
  fetchEntitiesWithId,
  createEntitySlice,
} from '../create-generic-slice/create-generic-slice';
const apiURL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_LOCAL_URL;
    
export const patientAppointmentsUrl = (id: string, pagination?: number) => {
  return `${apiURL}/appointments/patients/${id}?limit=10&page=${pagination}`;
};

export const fetchAppointmentsForPatient =
  fetchEntitiesWithId<AppointmentsForPatient>(
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
