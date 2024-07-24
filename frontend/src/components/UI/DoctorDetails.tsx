import React, { useEffect, useState } from 'react';
import classes from './DoctorDetails.module.css';
import AvailabilityTable from './AvailabilityTable';
import { useSelector } from 'react-redux';
import { fetchReviews } from '../../store/reviews-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import ReviewRead from './ReviewRead';
import PaginationButtons from './PaginationButtons';

const DoctorDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const [pagination, setPagination] = useState<number>(1);

  const { error: doctorsError, selectedDoctor } = useSelector(
    (state: RootState) => state.doctors
  );

  const {
    entities: reviews,
    status: reviewsStatus,
    error: reviewsError,
  } = useSelector((state: RootState) => state.reviews);

  const handleMoreReview = () => {};

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(fetchReviews({ id: selectedDoctor._id.toString(), pagination }));
    }
  }, [dispatch, selectedDoctor, pagination]);

  if (doctorsError) {
    return <div>Error: {doctorsError}</div>;
  }

  if (!selectedDoctor) {
    return <div>No doctor found.</div>;
  }

  return (
    <div
      //style={{ border: '1px solid red' }}
      className={classes.wrapper}
    >
      <AvailabilityTable />

      <div
        style={{ border: '2px solid blue' }}
        className={classes.bottomSection}
      >
        <h3>Reviews</h3>
        <hr />

        {reviewsStatus === 'loading' && <p>Reviews are loading...</p>}
        {reviewsStatus === 'succeeded' && (
          <ul className={`${classes.wrapper} ${classes.reviews}`}>
            {reviews.map((review: Review, index: number) => (
              <div
                key={index}
                //style={{ border: '3px solid red' }}
                className={`${classes.container} ${classes.review}`}
              >
                <div className={classes.commenterInfo}>
                  <div className={classes.imgAndUser}>
                    <div className={classes.image}>
                      <img
                        //src={`http://localhost:3000/static${review.userId?.image}`}
                        src={review.userId?.image}
                        alt=""
                      />
                    </div>

                    {/* <h2>{review.averageRating?.toFixed(1)}</h2> */}
                    <h2>
                      {' '}
                      {(
                        Object.entries(review.attributes)
                          .filter(([key]) => key !== '_id')
                          .reduce((acc, [key, value]) => acc + value, 0) / 4
                      ).toFixed(1)}
                    </h2>
                  </div>
                  <h5>{review.userId?.name}</h5>
                  <p>{review.comments}</p>
                </div>

                {Object.entries(review.attributes)
                  .filter(([key]) => key !== '_id')
                  .map(([key, value], attrIndex) => (
                    <ReviewRead
                      key={attrIndex}
                      attributeName={key}
                      attributeValue={value as number} // Use type assertion here
                    />
                  ))}
              </div>
            ))}
          </ul>
        )}
        {reviewsError && <p>Could not fetch reviews...</p>}
        {reviewsStatus === 'failed' && <p>{reviewsError}</p>}
        {/* <button onClick={handleMoreReview}>Load More</button> */}
        <PaginationButtons
          pagination={pagination}
          setPagination={setPagination}
          length={reviews?.length}
          limit={2}
        />
      </div>
    </div>
  );
};

export default DoctorDetails;
