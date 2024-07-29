import React, { useEffect, useState } from 'react';
import classes from './Dasboard.module.css';
import { useSelector } from 'react-redux';
import { FaStethoscope, FaBriefcaseMedical } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { fetchAppointmentsForPatient } from '../../store/appointmentsForPatient-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import ModalCustom from '../../components/UI/ModalCustom';
import useHttp from '../../hooks/useHttp';
import { formatDateForUI } from '../../helper/generateDates';
import AppointmentForm from '../../components/UI/AppointmentForm';
import { FaEdit } from 'react-icons/fa';
import PaginationButtons from '../../components/UI/PaginationButtons';

const Dashboard: React.FC = () => {
  const { userData, token } = useSelector(
    (state: RootState) => state.currentUser
  );

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [openModal, setOpenModal] = useState<string>('');
  const [appointmentIdToDelete, setAppointmentIdToDelete] =
    useState<ObjectId | null>(null);

  const [pagination, setPagination] = useState<number>(1);
  const { entities, status, error } = useSelector(
    (state: RootState) => state.appointmentsForPatient
  );
  const { total, appointmentsForPatient, upcomingAppointments } = entities;

  const dispatch: AppDispatch = useDispatch();
  const { deleteAppointment } = useHttp();

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
  const handleClick = (appointment: Appointment) => {
    setOpenModal('open');
    setSelectedAppointment(appointment);
  };

  useEffect(() => {
    if (userData?._id) {
      dispatch(
        fetchAppointmentsForPatient({
          id: userData._id.toString(),
          token,
          pagination,
        })
      );
    }
  }, [appointmentIdToDelete, pagination, openModal]);

  const totalDoctors = [
    ...new Set(
      appointmentsForPatient?.map(
        (appointment: Appointment) => appointment.doctorId._id
      )
    ),
  ];

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {openModal === 'open' && selectedAppointment && (
        <ModalCustom width="auto">
          <AppointmentForm
            setOpenModal={setOpenModal}
            appointment={selectedAppointment}
            userId={userData?._id}
            isPatient
          />
        </ModalCustom>
      )}

      {openModal === 'confirmation' && (
        <ModalCustom height="auto" width="auto">
          <p>Please confirm to cancel the appointment?</p>
          <div className={classes['buttons--container']}>
            <button onClick={confirmDelete}>Confirm</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        </ModalCustom>
      )}
      <div className={classes.container}>
        <div className={classes['dashboard-left-section']}>
          <div className={classes['dashboard-left-section__wrapper']}>
            <div className={classes['dashboard-left-section__image-wrapper']}>
              <img src={userData?.image} alt="User profile image" />
            </div>
            <p className={classes['dashboard-left-section__welcome']}>
              Welcome {userData?.name}
            </p>
          </div>
        </div>
        <div className={classes['dashboard-right-section']}>
          <div className={classes['dashboard-right-section__top']}>
            <div
              className={`${classes['dashboard-right-section__top--wrapper']} ${classes['dashboard-right-section__top--wrapper--total-visits']}`}
            >
              <p>Total Visits: {total}</p>
              <div
                className={`${classes.icons} ${classes['dashboard-right-section__top--icons--total-visit']}`}
              >
                <FaBriefcaseMedical />
              </div>
            </div>
            <div
              className={`${classes['dashboard-right-section__top--wrapper']} ${classes['dashboard-right-section__top--wrapper--upcoming-visits']}`}
            >
              <p>Upcoming Visits: {upcomingAppointments}</p>
              <div
                className={`${classes.icons} ${classes['dashboard-right-section__top--icons--stethoscope']}`}
              >
                <FaStethoscope />
              </div>
            </div>
            <div
              className={`${classes['dashboard-right-section__top--wrapper']} ${classes['dashboard-right-section__top--wrapper--total-doctors']}`}
            >
              <p>Total Doctors : {totalDoctors.length}</p>
              <div
                className={`${classes.icons} ${classes['dashboard-right-section__top--icons--total-doctor']}`}
              >
                <FaUserDoctor />
              </div>
            </div>
          </div>
          <div className={classes['dashboard-right-section__bottom']}>
            <div
              className={`${classes['dashboard-right-section__bottom-appointments']}`}
            >
              <div
                className={`${classes['right-section__bottom-appointments-title']}`}
              >
                <h5>Latest Appointments</h5>
              </div>
              <hr />
              {status === 'loading' && <div>Loading...</div>}

              {status === 'succeeded' && (
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Doctor Name</th>
                      <th>Date</th>
                      <th>Concerns</th>
                      <th>Time</th>
                      <th>Diagnose</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={classes['gap--line']}></tr>
                    {appointmentsForPatient?.map(
                      (appointment: Appointment, index: number) => (
                        <React.Fragment key={appointment._id.toString()}>
                          <tr
                            className={
                              new Date(appointment.appointmentDateAndTime) >
                              new Date()
                                ? `${classes.row} ${classes['row--active']}`
                                : `${classes.row}`
                            }
                            //onClick={() => handleClick(appointment)}
                          >
                            <td>{index + 1}.</td>
                            <td>{`Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}</td>
                            <td>
                              {formatDateForUI(
                                appointment.appointmentDateAndTime
                              )}
                            </td>
                            <td>{appointment.reason}</td>
                            <td>
                              {appointment.appointmentDateAndTime
                                .split('T')[1]
                                .slice(0, 5)}
                            </td>
                            <td>{appointment.diagnose}</td>
                            <td>
                              <FaEdit
                                className={`${classes.icons} ${classes['icons--edit']}`}
                                onClick={() => {
                                  // e.stopPropagation();
                                  handleClick(appointment);
                                }}
                              />
                            </td>
                          </tr>
                          <tr className={classes['gap--line']}></tr>
                        </React.Fragment>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <PaginationButtons
              setPagination={setPagination}
              pagination={pagination}
              length={appointmentsForPatient?.length}
              limit={10}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
