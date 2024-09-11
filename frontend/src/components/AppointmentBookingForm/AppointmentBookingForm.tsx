import React, { useState } from 'react';
import classes from './AppointmentBookingForm.module.css';
import useHttp from '../../hooks/useHttp/useHttp';
import {
  formatDateForInput,
  convertDateAndTimeStringToDate,
} from '../../helper/generateDates';
import CustomInput from '../CustomInput/CustomInput';

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
    patientId: user._id,
    appointmentDateAndTime: convertDateAndTimeStringToDate(
      slot.date,
      slot.time
    ),
    reason: '',
  });

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

    if (response.status === 'success') {
      setOpenModal(false);
    }
  };

  return (
    <div className={classes['booking__container']}>
      <h1 className={classes['booking__container-title']}>Booking Form</h1>
      <form
        className={classes['booking__container-form']}
        onSubmit={handleSubmit}
      >
        <div>
          <CustomInput
            name="doctor"
            value={`Dr.${doctor?.firstName} ${doctor?.lastName}`}
            type="text"
            readOnly
          />
          <CustomInput value={doctor?.departmentId.departmentMain} readOnly />
          <select
            className={classes['booking__container-select']}
            name="subDepartmentName"
            onChange={handleChange}
            required
          >
            <option>Choose Sub Department</option>
            {doctor?.departmentId.departmentSub.map((el, index) => (
              <option key={index} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div>
        <div>
          <CustomInput type="text" value={user.name} readOnly />
          <CustomInput
            type="date"
            defaultValue={formatDateForInput(slot.date)}
            name="appointmentDate"
            onChange={handleChange}
          />
          <CustomInput
            placeHolder="Appointment Time"
            defaultValue={slot.time}
            name="appointmentTime"
            type="time"
            onChange={handleChange}
            required
          />
        </div>
        <textarea
          className={classes['booking__container-reason']}
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
