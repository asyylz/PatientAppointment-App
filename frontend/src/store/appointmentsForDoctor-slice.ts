import {
  fetchEntitiesWithIdAndToken,
  createEntitySlice,
} from './create-generic-slice';

export const doctorAppointmentsUrl = (id: string) => {
  return `http://localhost:3000/api/v1/appointments/doctors/${id}`;
};

export const fetchAppointmentsForDoctor =
  fetchEntitiesWithIdAndToken<AppointmentsForDoctor>(
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
