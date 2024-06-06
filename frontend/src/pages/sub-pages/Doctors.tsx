import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './../../store/index';
import { fetchDoctors } from './../../store/doctors-slice';
import DoctorProfilCard from '../../components/UI/DoctorProfilCard';
import classes from './Doctors.module.css';

const Doctors: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    entities: doctors,
    status,
    error,
  } = useSelector((state: RootState) => state.doctors);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  return (
    <div style={{ marginTop: '6rem' }}>
      <h1 className={classes.header}>OUR DOCTORS</h1>
      <hr />
      <div className={classes.container}>
        {status === 'loading' && <p>Loading...</p>}
        {doctors.map((doctor) => (
          <DoctorProfilCard key={doctor.id} doctor={doctor as Doctor} />
        ))}
        {status === 'failed' && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Doctors;
