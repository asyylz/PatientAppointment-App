import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDateForUI } from '../../helper/generateDates';
import classes from './PatientAppointmentsTable.module.css';
import { FaEdit } from 'react-icons/fa';
import { fetchAppointmentsForPatient } from '../../store/appointmentsForPatient-slice';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import PaginationButtons from './PaginationButtons';
interface Props {
  openModal: string;
  setOpenModal: (openModal: string) => void;
  setSelectedAppointment: (selectedAppointment: Appointment) => void;
}

const PatientAppointmentsTable: React.FC<Props> = ({
  setOpenModal,
  openModal,
  setSelectedAppointment,
}) => {
  const { entities } = useSelector(
    (state: RootState) => state.appointmentsForPatient
  );
  const { userData, token } = useSelector(
    (state: RootState) => state.currentUser
  );
  const [pagination, setPagination] = useState<number>(1);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (userData?._id) {
      dispatch(
        fetchAppointmentsForPatient({
          id: userData._id.toString(),
          pagination,
        })
      );
    }
  }, [
    // appointmentIdToDelete,
    pagination,
    dispatch,
    token,
    userData?._id,
    setOpenModal,
    openModal,
  ]);

  const handleClick = (appointment: Appointment) => {
    setOpenModal('open');
    setSelectedAppointment(appointment);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Concerns</th>
            <th>Diagnose</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="appointments-patient">
          <tr className={classes['gap--line']}></tr>
          {entities?.map((appointment: Appointment, index: number) => (
            <React.Fragment key={appointment._id.toString()}>
              <tr
                className={
                  new Date(appointment.appointmentDateAndTime) > new Date()
                    ? `${classes.row} ${classes['row--active']}`
                    : `${classes.row}`
                }
              >
                <td>{index + 1}.</td>
                <td>{`Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}</td>
                <td>{formatDateForUI(appointment.appointmentDateAndTime)}</td>
                <td>
                  {appointment.appointmentDateAndTime.split('T')[1].slice(0, 5)}
                </td>
                <td>{appointment.reason}</td>
                <td>{appointment.diagnose}</td>
                <td>
                  <FaEdit
                    data-testid="edit-icon"
                    className={`${classes.icons} ${classes['icons--edit']}`}
                    onClick={() => {
                      handleClick(appointment);
                    }}
                  />
                </td>
              </tr>
              <tr className={classes['gap--line']}></tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <PaginationButtons
        setPagination={setPagination}
        pagination={pagination}
        length={entities?.length}
        limit={10}
      />
    </>
  );
};

export default PatientAppointmentsTable;
