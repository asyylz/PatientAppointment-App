import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDateForUI } from '../../helper/generateDates';
import classes from './Appointments.module.css';
import { MdDoneOutline } from 'react-icons/md';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import ModalCustom from '../../components/UI/ModalCustom';
import AppointmentForm from '../../components/UI/AppointmentForm';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchAppointmentsForDoctor } from '../../store/appointmentsForDoctor-slice';
import useAxios from '../../hooks/useAxios';

const Appointments: React.FC = () => {
  const axiosWithToken = useAxios();

  //const [appointments, setAppointments] = useState<AppointmentForDoctors[]>();
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentForDoctors>();
  const dispatch: AppDispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { userData, token } = useSelector(
    (state: RootState) => state.currentUser
  );
  const appointments = useSelector(
    (state: RootState) => state.appointmentsForDoctorSlice
  );

  console.log(appointments);

  // const fetchAppointments = async () => {
  //   try {
  //     const response = await axiosWithToken(
  //       `http://localhost:3000/api/v1/appointments/doctors/${userData?.doctorId}`
  //     );
  //     console.log(response.data.data.appointments);
  //     setAppointments(response.data.data.appointments);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (userData?._id) {
      console.log(userData.doctorId);
      dispatch(
        fetchAppointmentsForDoctor({ id: userData.doctorId.toString(), token })
      );
    }
  }, []);

  const handleClick = (appointment: AppointmentForDoctors) => {
    setOpenModal(true);
    setSelectedAppointment(appointment);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {openModal && selectedAppointment && (
        <ModalCustom>
          <AppointmentForm
            setOpenModal={setOpenModal}
            appointment={selectedAppointment}
          />
        </ModalCustom>
      )}

      <table className={classes.appointments}>
        <thead>
          <tr>
            <th>Patient Name</th>
            {/* <th>DOB</th> */}
            <th>Concerns</th>
            <th>Date</th>
            <th>Time</th>
            {/* <th>Status</th>
          <th>Referrals</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.gapLine}></tr>
          {appointments?.map(
            (appointment: AppointmentForDoctors, index: number) => (
              <React.Fragment key={appointment._id}>
                <tr
                  className={classes.row}
                  onClick={() => handleClick(appointment)}
                >
                  <td>{appointment.patientId?.name}</td>
                  <td>{appointment.reason}</td>
                  <td>{formatDateForUI(appointment.appointmentDate)}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <FaRegEdit className={`${classes.icons} ${classes.edit}`} />
                    <MdDoneOutline
                      className={`${classes.icons} ${classes.tick}`}
                    />
                    <FaRegTrashAlt
                      className={`${classes.icons} ${classes.trash}`}
                    />
                  </td>
                </tr>
                <tr className={classes.gapLine}></tr>
              </React.Fragment>
            )
          )}
        </tbody>
      </table>
    </>
  );
};

export default Appointments;
