import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './../../store/index';
import { fetchDoctors } from './../../store/doctors-slice';
import DoctorProfilCard from '../../components/UI/DoctorProfilCard';
import classes from './DoctorsPage.module.css';
import { doctorActions } from './../../store/doctors-slice';
import useHttp from './../../hooks/useHttp';
import PaginationButtons from '../../components/UI/PaginationButtons';

const Doctors: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { getDoctorWithAvailabilities } = useHttp();

  const {
    entities: doctors,
    status,
    error,
  } = useSelector((state: RootState) => state.doctors);

  const searchWord = useSelector((state: RootState) => state.search);

  // we call doctor with availabilities
  const handleSelectDoctor = async (doctor: Doctor) => {
    const doctorWithAvailability = await getDoctorWithAvailabilities(
      doctor._id
    );
    dispatch(doctorActions.selectDoctor(doctorWithAvailability));
  };
  const [pagination, setPagination] = useState<number>(1);
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  useEffect(() => {
    dispatch(fetchDoctors({ pagination }));
  }, [dispatch, pagination]);

 

  useEffect(() => {
    if (searchWord) {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.firstName.toLowerCase().startsWith(searchWord.toLowerCase()) ||
          doctor.lastName.toLowerCase().startsWith(searchWord.toLowerCase())
      );
      // .sort((a, b) => {
      //   const aFirstnameIncludes = a.firstName
      //     .toLowerCase()
      //     .includes(searchWord.toLowerCase());

      //   const bFirstnameIncludes = b.firstName
      //     .toLowerCase()
      //     .includes(searchWord.toLowerCase());

      //   if (aFirstnameIncludes && !bFirstnameIncludes) {
      //     return -1; // `a` should come before `b`
      //   } else if (!aFirstnameIncludes && bFirstnameIncludes) {
      //     return 1; // `b` should come before `a`
      //   } else {
      //     return 0; // keep the order as is
      //   }
      // });

      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchWord, doctors]);
  //console.log(filteredDoctors);

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
          filteredDoctors?.map((doctor: Doctor, index) => (
            <DoctorProfilCard
              key={index}
              doctor={doctor as Doctor}
              onSelectDoctor={handleSelectDoctor}
            />
          ))}
        {status === 'failed' && <p>{error}</p>}
      </div>
      <PaginationButtons
        pagination={pagination}
        setPagination={setPagination}
        length={doctors?.length}
        limit={2}
      />
    </>
  );
};

export default Doctors;
