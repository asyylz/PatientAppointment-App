import {
  fetchEntitiesWithId,
  createEntitySlice,
} from './../create-generic-slice/create-generic-slice';
const apiURL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_LOCAL_URL;
export const doctorAppointmentsUrl = (id: string) => {
  return `${apiURL}/appointments/doctors/${id}`;
};

export const fetchAppointmentsForDoctor =
  fetchEntitiesWithId<AppointmentsForDoctor>(
    'appointmentsForDoctor',
    doctorAppointmentsUrl
  );

const appointmentsForDoctorSlice = createEntitySlice<AppointmentsForDoctor>(
  'appointmentsForDoctor',
  fetchAppointmentsForDoctor
);

const { actions, reducer } = appointmentsForDoctorSlice;

export const appointmentsForDoctorActions = actions;
export default reducer;
