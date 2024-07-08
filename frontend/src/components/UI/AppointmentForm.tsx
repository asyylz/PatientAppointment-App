import React, { useState } from 'react';
import classes from './AppointmentForm.module.css';
import useHttp from '../../hooks/useHttp';
import {
  convertDateStringToDate,
  formatDateForInput2,
} from '../../helper/generateDates';

interface AppointmentFormProps {
  setOpenModal: (openModal: string) => void;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await updateAppointment(
      updatedAppointmentData,
      appointment?._id
    );
    if (response.status === 'success') {
      setOpenModal('');
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Appointment Details</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.leftSection}>
          <input
            type="text"
            value={appointment?.patientId.name}
            placeholder="Patient Name"
            required
            readOnly
          />
          <input
            placeholder="Appointment Date"
            value={formatDateForInput2(appointment?.appointmentDate)}
            type="date"
            name="appointmentDate"
            // onChange={handleChange}
            readOnly
          />
          <input
            placeholder="Appointment Time"
            value={appointment?.time}
            name="time"
            type="time"
            step="1800"
            readOnly
            //onChange={handleChange}
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
          <select
            name="status"
            id="status"
            onChange={handleChange}
            defaultValue={appointment?.status}
          >
            <option>Pelease choose a status</option>
            <option value="completed">Completed</option>
          </select>
          <select
            name="referral"
            id="referral"
            onChange={handleChange}
            defaultValue={appointment?.referral.toString()}
          >
            <option>Pelease choose a referral status</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
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
        <button onClick={() => setOpenModal('')}>Close</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
