import React from 'react';
import classes from './AppointmentCard.module.css';
import { useSelector } from 'react-redux';
import { getDateFromDateString } from '../../helper/generateDates';
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
          new Date(appointment.appointmentDateAndTime) <=
          new Date()
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
        <p>
          Time:
          {`${new Date(appointment.appointmentDateAndTime)
            .getHours()
            .toString()}:${new Date(appointment.appointmentDateAndTime)
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}
        </p>
        <p>Date: {getDateFromDateString(appointment.appointmentDateAndTime)}</p>
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
