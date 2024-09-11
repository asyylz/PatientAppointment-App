import {
  fetchEntitiesWithId,
  createEntitySlice,
} from './../create-generic-slice/create-generic-slice';

export const doctorReviewsUrl = (id: string, pagination?: number) => {
  return `http://localhost:3000/api/v1/reviews/${id}?limit=2&page=${pagination}`;
};

export const fetchReviews = fetchEntitiesWithId<Review>(
  'reviews',
  doctorReviewsUrl
);

// Create reviews slice
const reviewsSlice = createEntitySlice<Review>('reviews', fetchReviews);

// Export the actions and reducer
export const { actions, reducer } = reviewsSlice;
export default reducer;
