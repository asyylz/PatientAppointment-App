import React from 'react';
import classes from './DoctorDetails.module.css';
import AvailabilityTable from './AvailabilityTable';
interface DoctorDetailsProps {
  doctor: Doctor;
}
const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctor }) => {
  return (
    <div style={{ border: '6px solid red' }} className={classes.wrapper}>
      <div
        style={{ border: '7px solid green' }}
        className={classes.leftSectionWrapper}
      >
        <div style={{ border: '1px solid green' }} className={classes.picture}>
          {/* <img src={doctor.image} /> */}
          <img src="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*" />
        </div>
        <div
          style={{ border: '1px solid green' }}
          className={classes.doctorInfo}
        >
          INFO
        </div>
      </div>
      <div
        style={{ border: '2px solid blue' }}
        className={classes.rigthSection}
      >
        <AvailabilityTable availability={doctor.availability as Availability} />
      </div>
      <div
        style={{ border: '2px solid blue' }}
        className={classes.rigthSection}
      >
        aa
      </div>
    </div>
  );
};

export default DoctorDetails;
