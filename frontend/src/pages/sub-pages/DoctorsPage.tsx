import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './../../store/index';
import { fetchDoctors } from './../../store/doctors-slice';
import DoctorProfilCard from '../../components/UI/DoctorProfilCard';
import classes from './DoctorsPage.module.css';
import { doctorActions } from './../../store/doctors-slice';

const Doctors: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    entities: { doctors },
    status,
    error,
  } = useSelector((state: RootState) => state.doctors);


  const handleSelectDoctor = (doctor: Doctor) => {
    dispatch(doctorActions.selectDoctor(doctor));
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  return (
    <>
      <h1 className={classes.header}>OUR DOCTORS</h1>
      <hr />
      <div
        //style={{border:'1px solid red'}}
        className={classes.container}
      >
        {status === 'loading' && <p>Loading...</p>}

        {status === 'succeeded' &&
          doctors.map((doctor: Doctor) => (
            <DoctorProfilCard
              key={doctor.id}
              doctor={doctor as Doctor}
              onSelectDoctor={handleSelectDoctor}
            />
          ))}
        {status === 'failed' && <p>{error}</p>}
      </div>
    </>
  );
};

export default Doctors;
