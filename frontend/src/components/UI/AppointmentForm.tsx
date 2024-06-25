import React from 'react';
import classes from './AppointmentForm.module.css';
interface AppointmentFormProps {
  user: userData;
  doctor: Doctor | null;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ user, doctor }) => {
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Booking Form</h1>
      <form action="#">
        <div className={classes.leftSection}>
          {' '}
          <div className={classes.inputBox}>
            <input
              type="text"
              placeholder="Choose Doctor"
              value={`Dr.${doctor?.firstName} ${doctor?.lastName}`}
              required
            />
            <div className={classes.underline}></div>
          </div>
          <div className={classes.inputBox}>
            <input
              type="text"
              value={user.name}
              placeholder="Patient Name"
              required
            />
            <div className={classes.underline}></div>
          </div>
          <div className={classes.inputBox}>
            <input placeholder="Appointment Date" type="date" required />
            <div className={classes.underline}></div>
          </div>
          <div className={classes.inputBox}>
            <input placeholder="Appointment Time" type="time" required />
            <div className={classes.underline}></div>
          </div>
        </div>
        <div className={classes.rightSection}>
          <div className={classes.inputBox}>
            <textarea
              name="reason"
              id="reason"
              placeholder="Appointment reason"
            ></textarea>
            <div className={classes.underline}></div>
          </div>
        </div>
        <button type="submit">Book</button>
        <button>Close</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
