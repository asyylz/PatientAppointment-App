import React, { useState } from 'react';
import classes from './AppointmentForm.module.css';
import useHttp from '../../hooks/useHttp';
import {
  formatDateForInput,
  convertDateStringToDate,
  formatDateForInput2,
} from '../../helper/generateDates';

interface AppointmentFormProps {
  setOpenModal: (openModal: boolean) => void;
  appointment: AppointmentForDoctors | undefined;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  setOpenModal,
  appointment,
}) => {
  const { updateAppointment } = useHttp();
  console.log(appointment);

  const [updatedAppointmentData, setUpdatedAppointmentData] = useState<
    object | undefined
  >();

  console.log(updatedAppointmentData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === 'appointmentDate') {
      const formattedDate = convertDateStringToDate(value);
      console.log(formattedDate);
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDate: formattedDate,
      }));
    } else {
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        [name]: value,
      }));
    }
  };
  console.log(updatedAppointmentData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await updateAppointment(
      updatedAppointmentData,
      appointment?._id
    );
    console.log(response);
    if (response.status === 'success') {
      setOpenModal(false);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Booking Form</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.leftSection}>
          <input
            type="text"
            value={appointment?.patientId.name}
            placeholder="Patient Name"
            required
          />
          <input
            placeholder="Appointment Date"
            defaultValue={formatDateForInput2(appointment?.appointmentDate)}
            type="date"
            name="appointmentDate"
            onChange={handleChange}
            required
          />
          <input
            placeholder="Appointment Time"
            defaultValue={appointment?.time}
            name="time"
            type="time"
            onChange={handleChange}
            required
          />
          <textarea
            className={classes.reason}
            placeholder="Please write your concerns..."
            name="reason"
            defaultValue={appointment?.reason}
            onChange={handleChange}
            rows={8}
            cols={36}
          ></textarea>
        </div>
        <div className={classes.leftSection}>
          <select name="status" id="status" onChange={handleChange}>
            <option>Pelease choose a status</option>
            <option value="completed">Completed</option>
          </select>
          <select name="referral" id="referral" onChange={handleChange}>
            <option>Pelease choose a status</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <textarea
            className={classes.result}
            placeholder="Please write diagnoses..."
            name="diagnose"
            onChange={handleChange}
            rows={8}
            cols={36}
          ></textarea>
        </div>

        <button type="submit">Update</button>
        <button onClick={() => setOpenModal(false)}>Close</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
