import React, { useEffect, useState } from 'react';
import classes from './DoctorDetails.module.css';
import AvailabilityTable from '../AvailabilityTable/AvailabilityTable';
import { useSelector } from 'react-redux';
import { fetchReviews } from '../../store/reviews-slice/reviews-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/index';
import ReviewRead from '../ReviewRead/ReviewRead';
import PaginationButtons from '../PaginationButtons/PaginationButtons';
import Loader from '../Loader/Loader';

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
  
  console.log(reviews)

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(fetchReviews({ id: selectedDoctor._id.toString(), pagination }));
    }
  }, [dispatch, selectedDoctor, pagination]);

  return (
    <div className={classes['doctor__details--wrapper']}>
      <AvailabilityTable />

      <div className={classes['review__section--wrapper']}>
        <div>
          <h3>Reviews</h3>
          <hr />
        </div>
        <div>
          {reviewsStatus === 'loading' && <Loader />}
          {reviews.length === 0 && (
            <p className={classes['no__reviews-text']}>No reviews yet...</p>
          )}
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
        </div>
        <div className={classes['pagination__wrapper-doctorDetailPage']}>
          {' '}
          <PaginationButtons
            pagination={pagination}
            setPagination={setPagination}
            length={reviews?.length}
            limit={2}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
