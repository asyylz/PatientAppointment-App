import React, { useEffect, useState } from 'react';
import classes from './Dasboard.module.css';
import { useSelector } from 'react-redux';
import GlobalLink from '../../components/UI/GlobalLink';
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

const Dashboard: React.FC = () => {
  const { userData, token } = useSelector(
    (state: RootState) => state.currentUser
  );
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [openModal, setOpenModal] = useState<string>('');
  const [appointmentIdToDelete, setAppointmentIdToDelete] =
    useState<ObjectId | null>(null);

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
        fetchAppointmentsForPatient({ id: userData._id.toString(), token })
      );
    }
  }, [dispatch, token, userData?._id, appointmentIdToDelete]);

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
        <ModalCustom height="700px" width="900px">
          <AppointmentForm
            setOpenModal={setOpenModal}
            appointment={selectedAppointment}
            isPatient
          />
        </ModalCustom>
      )}

      {openModal === 'confirmation' && (
        <ModalCustom height="300px" width="500px">
          <p>Please confirm to cancel the appointment?</p>
          <div className={classes.buttonContainer}>
            <button onClick={confirmDelete}>Confirm</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        </ModalCustom>
      )}
      <div className={classes.container}>
        <div className={classes.userLeftSection}>
          <div className={classes.wrapper}>
            <div className={classes.image}>
              <img
                src={`http://localhost:3000/static${userData?.image}`}
                alt=""
              />
            </div>
            <p>Welcome {userData?.name}</p>
          </div>
        </div>
        <div className={classes.userRightSection}>
          <div className={classes.rightTop}>
            <div className={`${classes.box} ${classes.box1}`}>
              <p>Total Visits: {total}</p>
              <div className={`${classes.icons} ${classes.totalVisit}`}>
                <FaBriefcaseMedical />
              </div>
            </div>
            <div className={`${classes.box} ${classes.box2}`}>
              <p>Upcoming Visits: {upcomingAppointments}</p>
              <div className={`${classes.icons} ${classes.stethoscope}`}>
                <FaStethoscope />
              </div>
            </div>
            <div className={`${classes.box} ${classes.box3}`}>
              <p>Total Doctors : {totalDoctors.length}</p>
              <div className={`${classes.icons} ${classes.totalDoctor}`}>
                <FaUserDoctor />
              </div>
            </div>
          </div>
          <div className={classes.rightBottom}>
            <div className={classes.appointments}>
              <div className={classes.wrapper1}>
                <h2>Latest Appointments</h2>
              </div>
              <hr />
              {status === 'loading' && <div>Loading...</div>}

              {status === 'succeeded' && (
                <table className={classes.appointments}>
                  <thead>
                    <tr>
                      <th>Doctor Name</th>
                      <th>Date</th>
                      <th>Concerns</th>
                      <th>Time</th>
                      <th>Diagnose</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={classes.gapLine}></tr>
                    {appointmentsForPatient?.map((appointment: Appointment) => (
                      <React.Fragment key={appointment._id.toString()}>
                        <tr
                          className={
                            new Date(appointment.appointmentDateAndTime) >
                            new Date()
                              ? `${classes.row} ${classes.active}`
                              : `${classes.row}`
                          }
                          //onClick={() => handleClick(appointment)}
                        >
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
                              className={`${classes.icons} ${classes.edit}`}
                              onClick={() => {
                                // e.stopPropagation();
                                handleClick(appointment);
                              }}
                            />
                          </td>
                        </tr>
                        <tr className={classes.gapLine}></tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
