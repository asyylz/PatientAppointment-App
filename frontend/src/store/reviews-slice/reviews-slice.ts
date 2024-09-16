import {
  fetchEntitiesWithId,
  createEntitySlice,
} from './../create-generic-slice/create-generic-slice';
const apiURL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_LOCAL_URL;
export const doctorReviewsUrl = (id: string, pagination?: number) => {
  return `${apiURL}/reviews/${id}?limit=2&page=${pagination}`;
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
