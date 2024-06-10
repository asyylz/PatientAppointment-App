import { fetchEntitiesWithId, createEntitySlice } from './create-generic-slice';

export const doctorReviewsUrl = (id: string) => {
  return `http://localhost:3000/api/v1/reviews/${id}`;
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
