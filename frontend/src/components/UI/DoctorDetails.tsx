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

  console.log(reviews);

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

  return (
    <div
      // style={{ border: '6px solid red' }}
      className={classes.wrapper}
    >
      <div className={classes.availabilityTable}>
        {' '}
        <AvailabilityTable />
      </div>

      <div
        //style={{ border: '2px solid blue' }}
        className={classes.bottomSection}
      >
        <h1>Reviews</h1>
        <hr />
        <ul className={classes.reviewsWrapper}>
          {reviews.map((review, index) => (
            <div
              key={index}
              //style={{ border: '3px solid red' }}
              className={classes.reviewContainer}
            >
              <div className={classes.commenterInfo}>
                <div className={classes.imgAndUser}>
                  <div className={classes.image}>
                    <img
                      src={`http://localhost:3000/static${review.userId?.image}`}
                      alt=""
                    />
                  </div>
                  <h3>{review.userId?.name}</h3>
                  <h2>{review.averageRating.toFixed(1)}</h2>
                </div>
                <div>{review.comments}</div>
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
