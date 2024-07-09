import React, { useEffect } from 'react';
import classes from './Dasboard.module.css';
import { useSelector } from 'react-redux';
import GlobalLink from '../../components/UI/GlobalLink';
import AppointmentCard from '../../components/UI/AppointmentCard';
import { FaStethoscope, FaBriefcaseMedical } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { fetchAppointmentsForPatient } from '../../store/appointmentsForPatient-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

const Dashboard: React.FC = () => {
  const { userData, image, token } = useSelector(
    (state: RootState) => state.currentUser
  );

  const { entities, status, error } = useSelector(
    (state: RootState) => state.appointmentsForPatient
  );
  const { total, appointmentsForPatient, upcomingAppointments } = entities;

  const dispatch: AppDispatch = useDispatch();

  // const [total, setTotal] = useState<AppointmentStats>({
  //   totalAppointments: 0,
  //   upcomingAppointments: 0,
  // });

  useEffect(() => {
    if (userData?._id) {
      dispatch(
        fetchAppointmentsForPatient({ id: userData._id.toString(), token })
      );
    }
  }, [dispatch, token, userData?._id]);

  const totalDoctors = [
    ...new Set(
      appointmentsForPatient?.map(
        (appointment: Appointment) => appointment.doctorId._id
      )
    ),
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
              <GlobalLink text="Book Now"></GlobalLink>
            </div>
            <hr />
            <div className={classes.wrapper2}>
              {appointmentsForPatient?.map((appointment: Appointment) => (
                <AppointmentCard appointment={appointment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
