import React, { useEffect, useState } from 'react';
import classes from './DoctorDetails.module.css';
import AvailabilityTable from './AvailabilityTable';
import { useSelector } from 'react-redux';
import { fetchReviews } from '../../store/reviews-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import ReviewRead from './ReviewRead';
import PaginationButtons from './PaginationButtons';
import Loader from './Loader';

const DoctorDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const [pagination, setPagination] = useState<number>(1);

  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);
console.log(selectedDoctor)
  const {
    entities: reviews,
    status: reviewsStatus,
    error: reviewsError,
  } = useSelector((state: RootState) => state.reviews);

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(fetchReviews({ id: selectedDoctor._id.toString(), pagination }));
    }
  }, [dispatch, selectedDoctor, pagination]);

  return (
    <div className={classes['doctor__details--wrapper']}>
      <AvailabilityTable />

      <div className={classes['review__section--wrapper']}>
        <h3>Reviews</h3>
        <hr />

        {reviewsStatus === 'loading' && <Loader />}
        {reviews.length === 0 && <p className={classes['no__reviews-text']}>No reviews yet...</p>}
        {reviewsStatus === 'succeeded' && (
          <ul className={classes['reviews__wrapper']}>
            {reviews.map((review: Review, index: number) => (
              <div key={index} className={classes['review__container']}>
                <div className={classes['review__container--commenter']}>
                  <div className={classes['commenter']}>
                    <div className={classes['commenter__image']}>
                      <img src={review.userId?.image} alt="" />
                    </div>
                    <h2>
                      {(
                        Object.entries(review.attributes)
                          .filter(([_key]) => _key !== '_id')
                          .reduce(
                            (acc, [_key, value]) => acc + (value as number),
                            0
                          ) / 4
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
                      attributeValue={value as number}
                    />
                  ))}
              </div>
            ))}
          </ul>
        )}
        {reviewsError && <p>Could not fetch reviews...</p>}
        {reviewsStatus === 'failed' && <p>{reviewsError}</p>}

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
