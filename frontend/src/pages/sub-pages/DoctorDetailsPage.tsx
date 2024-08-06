import React from 'react';
import DoctorDetails from '../../components/UI/DoctorDetails';
import { useSelector } from 'react-redux';
import classes from './DoctorDetailsPage.module.css';
import GlobalLink from '../../components/UI/GlobalLink';
const DoctorDetailsPage: React.FC = () => {
  const {
    selectedDoctor,
  } = useSelector((state: RootState) => state.doctors);

  console.log(selectedDoctor)
  if (!selectedDoctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div
      className={classes.container}
      //style={{ border: '4px solid purple' }}
    >
      <GlobalLink text="Back" to={-1} />{' '}
      <div className={`${classes.wrapper} ${classes.doctorInfo}`}>
        <div
          //style={{ border: '1px solid green' }}
          className={classes.picture}
        >
          <img
            src={
              selectedDoctor.userId?.image
                ? selectedDoctor.userId?.image
                : 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*'
            }
          />
        </div>
        <div className={classes['doctor__name']}>
          <h2>{`Dr ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}</h2>
          <h2>{selectedDoctor.departmentId.departmentMain}</h2>
        </div>
      </div>
      <DoctorDetails />
    </div>
  );
};

export default DoctorDetailsPage;
