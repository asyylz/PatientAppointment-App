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
          <input
            type="text"
            placeholder="Choose Doctor"
            value={`Dr.${doctor?.firstName} ${doctor?.lastName}`}
            required
          />
          <input
            type="text"
            placeholder="Choose Main Department"
            value={doctor?.departmentName}
            required
          />
          <input
            type="text"
            placeholder="Choose Sub Department"
            value={doctor?.departmentName}
            required
          />
        </div>
        <div className={classes.rightSection}>
          <input
            type="text"
            value={user.name}
            placeholder="Patient Name"
            required
          />
          <input placeholder="Appointment Date" type="date" required />
          <input placeholder="Appointment Time" type="time" required />
        </div>
        <textarea
          className={classes.reason}
          placeholder="Please write your concerns..."
          name="story"
          rows={8}
          cols={45}
        ></textarea>
        <button type="submit">Book</button>
        <button>Close</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
