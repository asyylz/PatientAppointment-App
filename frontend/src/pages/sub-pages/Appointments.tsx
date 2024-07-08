import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDateForUI } from '../../helper/generateDates';
import classes from './Appointments.module.css';
import { FaRegTrashAlt } from 'react-icons/fa';
import ModalCustom from '../../components/UI/ModalCustom';
import AppointmentForm from '../../components/UI/AppointmentForm';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchAppointmentsForDoctor } from '../../store/appointmentsForDoctor-slice';
import useHttp from './../../hooks/useHttp';

const Appointments: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentForDoctors>();
  const dispatch: AppDispatch = useDispatch();
  const { deleteAppointment } = useHttp();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const { userData, token } = useSelector(
    (state: RootState) => state.currentUser
  );
  const {
    entities: appointments,
    status,
    error,
  } = useSelector((state: RootState) => state.appointmentsForDoctor);

  useEffect(() => {
    if (userData?._id) {
      console.log(userData.doctorId);
      dispatch(
        fetchAppointmentsForDoctor({ id: userData.doctorId.toString(), token })
      );
    }
  }, [dispatch, token, userData?._id, userData?.doctorId, openModal]);

  const handleClick = (appointment: AppointmentForDoctors) => {
    setOpenModal(true);
    setSelectedAppointment(appointment);
  };

  const handleDelete = async (id: ObjectId) => {
    const response = await deleteAppointment(id);
    console.log(response);
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  /* -------------------------- - ------------------------- */

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
            <th>Date</th>
            <th>Concerns</th>
            <th>Time</th>
            <th>Referrals</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.gapLine}></tr>
          {appointments?.map((appointment: AppointmentForDoctors) => (
            <React.Fragment key={appointment._id.toString()}>
              <tr
                className={
                  new Date(appointment.appointmentDate) > new Date()
                    ? `${classes.row} ${classes.active}`
                    : `${classes.row}`
                }
                onClick={() => handleClick(appointment)}
              >
                <td>{appointment.patientId?.name}</td>
                <td>{formatDateForUI(appointment.appointmentDate)}</td>
                <td>{appointment.reason}</td>
                <td>{appointment.time}</td>
                <td>{appointment.referral ? 'Yes' : 'No'}</td>
                <td>
                  <FaRegTrashAlt
                    className={`${classes.icons} ${classes.trash}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(appointment._id);
                    }}
                  />
                </td>
              </tr>
              <tr className={classes.gapLine}></tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Appointments;
