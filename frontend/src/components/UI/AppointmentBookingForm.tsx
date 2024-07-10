import React, { useState } from 'react';
import classes from './AppointmentBookingForm.module.css';
import useHttp from '../../hooks/useHttp';
import {
  formatDateForInput,
  convertDateAndTimeStringToDate,
} from '../../helper/generateDates';

interface AppointmentBookingFormProps {
  user: userData;
  doctor: Doctor | null;
  slot: { time: string; date: string };
  setOpenModal: (openModal: boolean) => void;
}

const AppointmentBookingForm: React.FC<AppointmentBookingFormProps> = ({
  user,
  doctor,
  setOpenModal,
  slot,
}) => {
  const { createAppointment } = useHttp();

  /* ----------------------- States ----------------------- */
  const [appointmentDate, setAppointmentDate] = useState(slot.date);
  const [appointmentTime, setAppointmentTime] = useState(slot.time);

  const [appointment, setAppointment] = useState<AppointmentForBooking>({
    doctorId: doctor?._id,
    patientId: user?._id,
    appointmentDateAndTime: convertDateAndTimeStringToDate(
      slot.date,
      slot.time
    ),
    reason: '',
  });
  
  console.log(appointment);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === 'appointmentDate') {
      setAppointmentDate(value);
      const formattedDate = convertDateAndTimeStringToDate(
        value,
        appointmentTime
      );
      setAppointment((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDateAndTime: formattedDate,
      }));
    } else if (name === 'appointmentTime') {
      setAppointmentTime(value);
      const formattedDate = convertDateAndTimeStringToDate(
        appointmentDate,
        value
      );
      setAppointment((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDateAndTime: formattedDate,
      }));
    } else {
      setAppointment((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await createAppointment(appointment);
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
          {' '}
          <input
            type="text"
            name="doctor"
            placeholder="Choose Doctor"
            value={`Dr.${doctor?.firstName} ${doctor?.lastName}`}
            readOnly
          />
          <select name="mainDepartment" aria-readonly>
            <option value={0}>{doctor?.departmentId.departmentMain}</option>
          </select>
          <select name="subDepartmentName" onChange={handleChange} required>
            <option>Choose Sub Department</option>
            {doctor?.departmentId.departmentSub.map((el, index) => (
              <option key={index} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.rightSection}>
          <input
            type="text"
            value={user.name}
            placeholder="Patient Name"
            readOnly
          />
          <input
            placeholder="Appointment Date"
            defaultValue={formatDateForInput(slot.date)}
            type="date"
            name="appointmentDate"
            onChange={handleChange}
            required
          />
          <input
            placeholder="Appointment Time"
            defaultValue={slot.time}
            name="appointmentTime"
            type="time"
            onChange={handleChange}
            required
          />
        </div>
        <textarea
          className={classes.reason}
          placeholder="Please write your concerns..."
          name="reason"
          onChange={handleChange}
          rows={8}
          cols={45}
        ></textarea>
        <button type="submit">Book</button>
        <button onClick={() => setOpenModal(false)}>Close</button>
      </form>
    </div>
  );
};

export default AppointmentBookingForm;
