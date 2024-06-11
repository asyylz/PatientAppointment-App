import React, { useEffect } from 'react';
import classes from './DoctorDetails.module.css';
import AvailabilityTable from './AvailabilityTable';
import { useSelector } from 'react-redux';
import { fetchReviews } from '../../store/reviews-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import ReviewRead from './ReviewRead';

const DoctorDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    entities: doctors,
    status: doctorsStatus,
    error: doctorsError,
    selectedDoctor,
  } = useSelector((state: RootState) => state.doctors);

  const {
    entities: reviews,
    status: reviewsStatus,
    error: reviewsError,
  } = useSelector((state: RootState) => state.reviews);

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(fetchReviews(selectedDoctor._id.toString()));
    }
  }, [dispatch, selectedDoctor]);

  if (doctorsStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (doctorsError) {
    return <div>Error: {doctorsError}</div>;
  }

  if (!selectedDoctor) {
    return <div>No doctor found.</div>;
  }

  //console.log(reviews);
  

  return (
    <div 
    //style={{ border: '6px solid red' }} 
    className={classes.wrapper}>
      <div
        //style={{ border: '7px solid green' }}
        className={classes.leftSectionWrapper}
      >
        <div
          //style={{ border: '1px solid green' }}
          className={classes.picture}
        >
          {/* <img src={doctor.image} /> */}
          <img src="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*" />
        </div>
        <div
          // style={{ border: '1px solid green' }}
          className={classes.doctorInfo}
        >
          <p>{`Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}</p>
          <p>{selectedDoctor.departmentName}</p>
        </div>
      </div>
      <div
        //style={{ border: '2px solid blue' }}
        className={classes.rigthSection}
      >
        <AvailabilityTable
          availability={selectedDoctor.availability as Availability}
        />
      </div>
      <div
        //style={{ border: '2px solid blue' }}
        className={classes.bottomSection}
      >
        <h1>Reviews</h1>
        <hr />
        <ul 
        className={classes.reviewsWrapper}>
          {reviews.map((review, index) => (
            <div
              key={index}
              //style={{ border: '3px solid red' }}
              className={classes.reviewContainer}
            >
              <div className={classes.commenterInfo}>
                <div className={classes.imgAndUser}>
                  <div className={classes.image}>
                    <img src="./../user-avatar.png" alt="" />
                  </div>
                  <h3>{review.name}</h3>
                </div>
                <div className={classes.commentAndRate}>
                  <div>{review.comments}</div>
                  <div className={classes.rating}>
                    <h2>{review.rating}</h2>
                  </div>
                </div>
              </div>

              {Object.entries(review.attributes)
                .filter(([key]) => key !== '_id')
                .map(([key, value], attrIndex) => (
                  <ReviewRead
                    key={attrIndex}
                    attributeName={key}
                    attributeValue={value}
                  />
                ))}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorDetails;
