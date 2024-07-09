import React from 'react';
import classes from './AppointmentCard.module.css';
import { useSelector } from 'react-redux';
import { formatDateForUI } from '../../helper/generateDates';
import { RxCross2 } from 'react-icons/rx';

interface AppointCardProps {
  appointment: Appointment;
  setOpenModal: (openModel: string) => void;
  setAppointmentIdToDelete: (appointmentIdToDelete: ObjectId) => void;
}

const AppointmentCard: React.FC<AppointCardProps> = ({
  appointment,
  setOpenModal,
  setAppointmentIdToDelete,
}) => {
  const { entities: departments } = useSelector(
    (state: RootState) => state.departments
  );

  const handleDelete = (id: ObjectId) => {
    setOpenModal('confirmation');
    setAppointmentIdToDelete(id);
  };

  return (
    <>
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
