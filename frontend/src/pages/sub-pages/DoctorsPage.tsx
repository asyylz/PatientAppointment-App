import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './../../store/index';
import { fetchDoctors } from './../../store/doctors-slice';
import DoctorProfilCard from '../../components/UI/DoctorProfilCard';
import classes from './DoctorsPage.module.css';
import { doctorActions } from './../../store/doctors-slice';

const Doctors: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    entities: doctors,
    status,
    error,
  } = useSelector((state: RootState) => state.doctors);

  const searchWord = useSelector((state: RootState) => state.search);

  const handleSelectDoctor = (doctor: Doctor) => {
    dispatch(doctorActions.selectDoctor(doctor));
  };

  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (searchWord) {
      const filtered = doctors
        .filter(
          (doctor) =>
            doctor.firstName.toLowerCase().includes(searchWord.toLowerCase()) ||
            doctor.lastName.toLowerCase().includes(searchWord.toLowerCase())
        )
        .sort((a, b) => {
          const aMainIncludes = a.firstName
            .toLowerCase()
            .includes(searchWord.toLowerCase());
          const bMainIncludes = b.firstName
            .toLowerCase()
            .includes(searchWord.toLowerCase());

          if (aMainIncludes && !bMainIncludes) {
            return -1; // `a` should come before `b`
          } else if (!aMainIncludes && bMainIncludes) {
            return 1; // `b` should come before `a`
          } else {
            return 0; // keep the order as is
          }
        });

      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchWord, doctors]);

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
          filteredDoctors.map((doctor: Doctor) => (
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
