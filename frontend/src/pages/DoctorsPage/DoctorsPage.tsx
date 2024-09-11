import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './../../store/index';
import { fetchDoctors } from '../../store/doctors-slice/doctors-slice';
import DoctorProfilCard from '../../components/DoctorProfilCard/DoctorProfilCard';
import classes from './DoctorsPage.module.css';
import { doctorActions } from '../../store/doctors-slice/doctors-slice';
import useHttp from '../../hooks/useHttp/useHttp';
import PaginationButtons from '../../components/PaginationButtons/PaginationButtons';
import { useLocation } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const Doctors: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { getDoctorWithAvailabilities } = useHttp();
  const location = useLocation();

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


  // Extract departmentId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const departmentId = queryParams.get('departmentId');


  useEffect(() => {
    dispatch(
      fetchDoctors(
        `http://localhost:3000/api/v1/doctors?limit=2&page=${pagination}&sort=firstName${
          departmentId ? `&departmentId=${departmentId}` : ''
        }`
      )
    );
  }, [pagination, departmentId, dispatch]);

  useEffect(() => {
    if (searchWord) {
      const filtered = doctors.filter(
        (doctor: Doctor) =>
          doctor.firstName.toLowerCase().startsWith(searchWord.toLowerCase()) ||
          doctor.lastName.toLowerCase().startsWith(searchWord.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchWord, doctors]);

  return (
    <>
      <p className={classes.header}>OUR DOCTORS</p>
      <hr />
      <div role="doctors-container" className={classes.container}>
        {status === 'loading' && <Loader />}

        {status === 'succeeded' &&
          filteredDoctors?.map((doctor: Doctor) => (
            <div key={doctor._id}>
              <DoctorProfilCard
                doctor={doctor as Doctor}
                onSelectDoctor={handleSelectDoctor}
              />
            </div>
          ))}
        {status === 'failed' && <p>{error}</p>}
        {doctors.length === 0 && status === 'succeeded' && (
          <p className={classes['no--available']}>No available doctor.</p>
        )}
      </div>
      <div className={classes['pagination__wrapper']}>
        <PaginationButtons
          pagination={pagination}
          setPagination={setPagination}
          length={doctors?.length}
          limit={2}
        />
      </div>
    </>
  );
};

export default Doctors;
