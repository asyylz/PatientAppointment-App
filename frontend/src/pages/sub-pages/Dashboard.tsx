import React from 'react';
import classes from './Dasboard.module.css';
import { useSelector } from 'react-redux';
import GlobalLink from '../../components/UI/GlobalLink';
const Dashboard: React.FC = () => {
  const {
    entities: { token, data },
    image,
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

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
          <p>Welcome {data.currentUser.name}</p>
        </div>
      </div>
      <div className={classes.userRightSection}>
        <div className={classes.rightTop}>
          <div className={classes.box}>1</div>
          <div className={classes.box}>1</div>
          <div className={classes.box}>1</div>
        </div>
        <div className={classes.rightBottom}>
          <div className={classes.appointments}>
            <div className={classes.wrapper1}>
              <h2>Latest Appointments</h2>
              <GlobalLink text="Book Now"></GlobalLink>
            </div>
            <hr />
            <div className={classes.wrapper2}>
              <div className={classes.appointmentBox}>1</div>
              <div className={classes.appointmentBox}>2</div>
              <div className={classes.appointmentBox}>3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
