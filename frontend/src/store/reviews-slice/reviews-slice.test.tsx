import reviewsReducer from '../reviews-slice/reviews-slice';
import reviews from '../../../public/test_data/reviews.json';
import { doctorReviewsUrl } from '../reviews-slice/reviews-slice';

describe('Reviews reducer', () => {
  it('1--Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const result = reviewsReducer(initialState, action);
    expect(result).toEqual({
      entities: [],
      status: 'idle',
      error: null,
    });
  });
  it('2--Should convert the reviews received to an object', () => {
    const initialState = undefined;
    const action = {
      type: 'reviews/fetchWithId/fulfilled',
      payload: reviews,
    };
    const result: EntityState<Review> = reviewsReducer(initialState, action);
    expect(result.status).toEqual('succeeded');
    expect(Object.keys(result.entities).length).toEqual(reviews.length);
    reviews.forEach((review, index) => {
      expect(result.entities[index]['_id']).toEqual(review._id);
    });
  });
});

describe('doctorReviewsUrl', () => {
  it('1--Should return the correct URL with pagination', () => {
    const id = '12345';
    const pagination = 2;
    const expectedUrl = `http://localhost:3000/api/v1/reviews/12345?limit=2&page=2`;
    const result = doctorReviewsUrl(id, pagination);
    expect(result).toBe(expectedUrl);
  });

  it('2--Should return the correct URL without pagination', () => {
    const id = '12345';
    const expectedUrl = `http://localhost:3000/api/v1/reviews/12345?limit=2&page=undefined`;
    const result = doctorReviewsUrl(id);
    expect(result).toBe(expectedUrl);
  });
});
