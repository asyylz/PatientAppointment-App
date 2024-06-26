import React, { useState } from 'react';
import classes from './AppointmentForm.module.css';
import { useSelector } from 'react-redux';
import useHttp from './../../hooks/useHttp';

interface AppointmentFormProps {
  user: userData;
  doctor: Doctor | null;
  setOpenModal: (openModal: boolean) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  user,
  doctor,
  setOpenModal,
}) => {
  const {
    entities: departments,
    status,
    error,
  } = useSelector((state: RootState) => state.departments);

  const { createAppointment } = useHttp();

  const [appointment, setAppointment] = useState<Appointment>({
    doctorId: doctor?._id,
    patientId: user._id,
    date: '',
    time: '',
    reason: '',
  });

  const filteredDepartments = departments.filter(
    (department) => doctor?.departmentId === department._id.toString()
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      createAppointment(appointment);
    } catch (error) {
      console.error('Error booking appointment', error);
      alert('Failed to book appointment');
    }

    return (
      <div className={classes.container}>
        <h1 className={classes.title}>Booking Form</h1>
        <form action="#" onSubmit={handleSubmit}>
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
              <option value={0}>{filteredDepartments[0].departmentMain}</option>
            </select>
            <select name="subDeparment">
              <option value={0}>Choose Sub Department</option>
              {filteredDepartments[0].departmentSub.map((el, index) => (
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
              type="date"
              onChange={handleChange}
              required
            />
            <input
              placeholder="Appointment Time"
              value="09:00"
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
};

export default AppointmentForm;
