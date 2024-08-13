import React, { useState } from 'react';
import './../../App.css';
import classes from './Dasboard.module.css';
import { useSelector } from 'react-redux';
import { FaStethoscope, FaBriefcaseMedical } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import ModalCustom from '../../components/UI/ModalCustom';
//import useHttp from '../../hooks/useHttp';
import AppointmentForm from '../../components/UI/AppointmentForm';
import PatientAppointmentsTable from './../../components/UI/PatientAppointmentsTable';

const Dashboard: React.FC = () => {
  const { userData } = useSelector((state: RootState) => state.currentUser);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  const [openModal, setOpenModal] = useState<string>('');

  //const [appointmentIdToDelete, setAppointmentIdToDelete] =
   // useState<ObjectId | null>(null);

  const { entities, status, error } = useSelector(
    (state: RootState) => state.appointmentsForPatient
  );
  const { total, appointmentsForPatient, upcomingAppointments } = entities;

 // const { deleteAppointment } = useHttp();

  // const confirmDelete = () => {
  //   if (appointmentIdToDelete) {
  //     deleteAppointment(appointmentIdToDelete);
  //   }
  //   setOpenModal('');
  //   setAppointmentIdToDelete(null);
  // };

  // const cancelDelete = () => {
  //   setOpenModal('');
  //   setAppointmentIdToDelete(null);
  // };

  const totalDoctors = [
    ...new Set(
      appointmentsForPatient?.map(
        (appointment: Appointment) => appointment.doctorId._id
      )
    ),
  ];

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
{/* 
      {openModal === 'confirmation' && (
        <ModalCustom height="auto" width="auto">
          <p>Please confirm to cancel the appointment?</p>
          <div className={classes['buttons--container']}>
            <button onClick={confirmDelete}>Confirm</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        </ModalCustom>
      )} */}
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
              {error && <p>Error: {error}</p>}

              <PatientAppointmentsTable
                openModal={openModal}
                setOpenModal={setOpenModal}
                setSelectedAppointment={setSelectedAppointment}
               // appointmentIdToDelete={appointmentIdToDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
