import React, { useEffect, useState } from 'react';
import classes from './Dasboard.module.css';
import { useSelector } from 'react-redux';
import GlobalLink from '../../components/UI/GlobalLink';
import useAxios from '../../hooks/useAxios';
import { formatDateForUI } from '../../helper/generateDates';

const Dashboard: React.FC = () => {
  const { token, userData, status, error, image } = useSelector(
    (state: RootState) => state.currentUser
  );

  const {
    entities: departments,

    //status,
    //error,
  } = useSelector((state: RootState) => state.departments);

  const axiosWithToken = useAxios();
  const [appointments, setAppointments] = useState<Appointment[]>();
  const [total, setTotal] = useState<AppointmentStats>({
    totalAppointments: 0,
    upcomingAppointments: 0,
  });

  const getAppointments = async () => {
    try {
      const response = await axiosWithToken.get(
        `http://localhost:3000/api/v1/appointments/${userData?._id}`
      );
      return response.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const appointmentsData = await getAppointments();
      console.log(appointmentsData);
      setAppointments(appointmentsData.data.appointments);
      setTotal({
        totalAppointments: appointmentsData.total,
        upcomingAppointments: appointmentsData.upcomingAppointments,
      });
    };
    fetchData();
  }, []);

  console.log(appointments);

  const totalDoctors = [
    ...new Set(appointments?.map((appointment) => appointment.doctorId._id)),
  ];

  return (
    <div
      //style={{ border: '3px solid green' }}
      className={classes.container}
    >
      <div className={classes.userLeftSection}>
        <div className={classes.wrapper}>
          <div className={classes.image}>
            <img src={image} alt="" />
          </div>
          <p>Welcome {userData?.name}</p>
        </div>
      </div>
      <div className={classes.userRightSection}>
        <div className={classes.rightTop}>
          <div className={`${classes.box} ${classes.box1}`}>
            <p>Total Visits: {total.totalAppointments}</p>
            <svg viewBox="0 0 448 512">
              <path
                fill="#70CFDE"
                d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"
              />
            </svg>
          </div>
          <div className={`${classes.box} ${classes.box2}`}>
            <p>Upcoming Visits: {total.upcomingAppointments}</p>
            <svg fill="#CADE70" viewBox="0 0 576 512">
              <path d="M142.4 21.9c5.6 16.8-3.5 34.9-20.2 40.5L96 71.1V192c0 53 43 96 96 96s96-43 96-96V71.1l-26.1-8.7c-16.8-5.6-25.8-23.7-20.2-40.5s23.7-25.8 40.5-20.2l26.1 8.7C334.4 19.1 352 43.5 352 71.1V192c0 77.2-54.6 141.6-127.3 156.7C231 404.6 278.4 448 336 448c61.9 0 112-50.1 112-112V265.3c-28.3-12.3-48-40.5-48-73.3c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V336c0 97.2-78.8 176-176 176c-92.9 0-168.9-71.9-175.5-163.1C87.2 334.2 32 269.6 32 192V71.1c0-27.5 17.6-52 43.8-60.7l26.1-8.7c16.8-5.6 34.9 3.5 40.5 20.2zM480 224a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
            </svg>
          </div>
          <div className={`${classes.box} ${classes.box3}`}>
            <p>Total Doctors : {totalDoctors.length}</p>
            <svg viewBox="0 0 448 512">
              <path
                fill="#FFCB9A"
                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16H336c-8.8 0-16-7.2-16-16s7.2-16 16-16V424c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16H256c-8.8 0-16-7.2-16-16V424c0-29.8 20.4-54.9 48-62V304.9c-6-.6-12.1-.9-18.3-.9H178.3c-6.2 0-12.3 .3-18.3 .9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7V311.2zM144 448a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"
              />
            </svg>
          </div>
        </div>
        <div className={classes.rightBottom}>
          <div className={classes.appointments}>
            <div className={classes.wrapper1}>
              <h2>Latest Appointments</h2>
              <GlobalLink text="Book Now"></GlobalLink>
            </div>
            <hr />
            <div className={classes.wrapper2}>
              {appointments?.map((appointment: Appointment) => (
                // <div className={classes.appointmentBox}>
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
                        return <span> {department.departmentMain}</span>; // Return the departmentMain value
                      }
                      return null; // Ensure a return value is always provided
                    })}
                  </p>
                  <p>Time: {appointment.time}</p>
                  <p>Date: {formatDateForUI(appointment.appointmentDate)}</p>
                  <p>Concerns: {appointment.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
