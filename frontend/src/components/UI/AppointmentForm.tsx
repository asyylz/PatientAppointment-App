import React, { useState } from 'react';
import classes from './AppointmentForm.module.css';
import useHttp from './../../hooks/useHttp';
import {
  formatDateForInput,
  convertDateStringToDate,
} from './../../helper/generateDates';

interface AppointmentFormProps {
  user: userData;
  doctor: Doctor | null;
  slot: { time: string; date: string };
  setOpenModal: (openModal: boolean) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  user,
  doctor,
  setOpenModal,
  slot,
}) => {
  const { createAppointment } = useHttp();

  const [appointment, setAppointment] = useState<Appointment>({
    doctorId: doctor?._id,
    patientId: user._id,
    //departmentId: doctor?.departmentId,
    //subDepartmentName: '',
    appointmentDate: convertDateStringToDate(slot.date),
    time: '',
    reason: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    console.log(name, value);

    if (name === 'appointmentDate') {
      const formattedDate = convertDateStringToDate(value);
      console.log(formattedDate);
      setAppointment((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDate: formattedDate,
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
    try {
      createAppointment(appointment);
    } catch (error) {
      console.error('Error booking appointment', error);
      alert('Failed to book appointment');
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
            required
          />
          <select name="mainDepartment">
            <option value={0}>{doctor?.departmentId.departmentMain}</option>
          </select>
          <select name="subDepartmentName" onChange={handleChange}>
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
            required
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
            name="time"
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

export default AppointmentForm;
