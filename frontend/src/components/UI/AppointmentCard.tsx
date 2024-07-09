import React, { useState } from 'react';
import classes from './AppointmentCard.module.css';
import { useSelector } from 'react-redux';
import { formatDateForUI } from '../../helper/generateDates';
import { RxCross2 } from 'react-icons/rx';
import ModalCustom from './ModalCustom';
import useHttp from './../../hooks/useHttp';
interface AppointCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointCardProps> = ({ appointment }) => {
  const { entities: departments } = useSelector(
    (state: RootState) => state.departments
  );
  const [openModal, setOpenModal] = useState<string>('');
  const [appointmentIdToDelete, setAppointmentIdToDelete] =
    useState<ObjectId | null>(null);

  const { deleteAppointment } = useHttp();

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
  return (
    <>
      {openModal === 'confirmation' && (
        <ModalCustom height="300px" width="500px">
          <p>Please confirm to cancel the appointment?</p>
          <div className={classes.buttonContainer}>
            <button onClick={confirmDelete}>Confirm</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        </ModalCustom>
      )}
      <div
        className={
          new Date(appointment.appointmentDate) <=
          new Date(new Date().setHours(0, 0, 0, 0))
            ? `${classes.appointmentBox} ${classes.close}`
            : `${classes.appointmentBox} ${classes.open}`
        }
      >
        <p>{`Dr. ${appointment?.doctorId?.firstName} ${appointment?.doctorId?.lastName}`}</p>
        <p>
          Department:
          {departments.map((department) => {
            if (
              department._id.toString() ===
              appointment.doctorId.departmentId.toString()
            ) {
              return <span> {department.departmentMain}</span>;
            }
            return null; // Ensure a return value is always provided
          })}
        </p>
        <p>Time: {appointment.time}</p>
        <p>Date: {formatDateForUI(appointment.appointmentDate)}</p>
        <p>Concerns: {appointment.reason}</p>
        <div
          className={`${classes.icons} ${classes.cross}`}
          onClick={() => handleDelete(appointment._id)}
        >
          <RxCross2 />
        </div>
      </div>
    </>
  );
};

export default AppointmentCard;
