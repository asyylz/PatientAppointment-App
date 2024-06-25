import React from 'react';
import classes from './AppointmentForm.module.css';
interface AppointmentFormProps {
  user: object;
  doctor: Doctor | null;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ user, doctor }) => {
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Booking Form</h1>
      <form action="#">
        <div className={classes.inputBox}>
          <input type="text" placeholder="Enter Your Email" required />
          <div className={classes.underline}></div>
        </div>
        <div className={classes.inputBox}>
          <input type="password" placeholder="Enter Your Password" required />
          <div className={classes.underline}></div>
        </div>
        <div className={classes.inputBox}>
          <input type="submit" value="Continue" />
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
