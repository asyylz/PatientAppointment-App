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

/* ---------------------- COMPONENT --------------------- */
const Appointments: React.FC = () => {
  
  const [selectedAppointment, setSelectedAppointment] = useState<
    SingleAppointmentForDoctor | undefined
  >();
  const dispatch: AppDispatch = useDispatch();
  const { deleteAppointment } = useHttp();

  const [openModal, setOpenModal] = useState<string>('');
  const [appointmentIdToDelete, setAppointmentIdToDelete] =
    useState<ObjectId | null>(null);

  /* -------------------- Redux States -------------------- */
  const { userData, token } = useSelector(
    (state: RootState) => state.currentUser
  );
  const { entities, status, error } = useSelector(
    (state: RootState) => state.appointmentsForDoctor
  );
  const { appointmentsForDoctor } = entities;
  console.log(appointmentsForDoctor);

  useEffect(() => {
    if (userData?.doctorId) {
      dispatch(
        fetchAppointmentsForDoctor({ id: userData.doctorId.toString(), token })
      );
    }
  }, [dispatch, openModal, token, userData?._id, userData?.doctorId]);

  const handleClick = (appointment: SingleAppointmentForDoctor) => {
    setOpenModal('open');
    setSelectedAppointment(appointment);
  };

  const handleDelete = (id: ObjectId) => {
    setOpenModal('confirmation');
    setAppointmentIdToDelete(id);
  };

  const confirmDelete = () => {
    if (appointmentIdToDelete) {
      deleteAppointment(appointmentIdToDelete);
    }
    setOpenModal('');
    setAppointmentIdToDelete(null);
  };

  const cancelDelete = () => {
    setOpenModal('');
    setAppointmentIdToDelete(null);
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  /* -------------------------- - ------------------------- */

  return (
    <>
      {openModal === 'open' && selectedAppointment && (
        <ModalCustom height="auto" width="auto">
          <AppointmentForm
            setOpenModal={setOpenModal}
            appointment={selectedAppointment}
          />
        </ModalCustom>
      )}
      {openModal === 'confirmation' && (
        <ModalCustom height="auto" width="auto">
          <p>Please confirm to delete the appointment?</p>
          <div className={classes.buttonContainer}>
            <button onClick={confirmDelete}>Confirm</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        </ModalCustom>
      )}
      <table className={classes.appointments}>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>DOB</th>
            <th>Date</th>
            <th>Time</th>
            <th>Concerns</th>
            <th>Diagnose</th>
            <th>Referrals</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.gapLine}></tr>
          {appointmentsForDoctor?.map(
            (appointment: SingleAppointmentForDoctor) => (
              <React.Fragment key={appointment._id.toString()}>
                <tr
                  className={
                    new Date(appointment.appointmentDateAndTime) > new Date()
                      ? `${classes.row} ${classes.active}`
                      : `${classes.row}`
                  }
                  onClick={() => handleClick(appointment)}
                >
                  <td>{appointment.patientId?.name}</td>
                  <td>{appointment.patientId?.DOB.split('T')[0]}</td>
                  <td>{appointment.appointmentDateAndTime.split('T')[0]}</td>
                  <td>
                    {appointment?.appointmentDateAndTime
                      .split('T')[1]
                      .slice(0, 5)}
                  </td>
                  <td>{appointment.reason}</td>
                  <td>{appointment.diagnose}</td>
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
            )
          )}
        </tbody>
      </table>
    </>
  );
};

export default Appointments;
