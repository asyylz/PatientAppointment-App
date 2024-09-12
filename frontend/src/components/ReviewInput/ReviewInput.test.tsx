import { fireEvent, screen } from '@testing-library/react';
import ReviewInput from './../ReviewInput/ReviewInput.tsx';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext.tsx';
import reviewsReducer from './../../store/reviews-slice/reviews-slice.ts';
import currentUserReducer from './../../store/currentUser-slice/currentUser-slice.ts';
import { combineReducers } from 'redux';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { AppStore } from '../../store/index/index.ts';

//import userEvent from '@testing-library/user-event';

const initialCurrentUserState: CurrentUser = {
  status: 'login success',
  token: 'someToken',
  userData: {
    _id: '6673662fbd42a966b75dec92',
    name: 'Alice',
    email: 'alice@test.com',
    role: 'patient',
    __v: 0,
    DOB: '1986-01-22T00:00:00.000Z',
    image:
      'https://patient-appointment-system.s3.eu-west-2.amazonaws.com/1722605356602-asiye%20serife.jpeg',
    policy: true,
  },
  error: null,
};
const reducers = combineReducers({
  currentUser: currentUserReducer,
  reviews: reviewsReducer,
  // other reducers...
});

describe('Review Component', () => {
  let store: AppStore;
  let asFragment: () => DocumentFragment;

  const mockSetRatingsAndComment = jest.fn();
  const initialProps = {
    attributeName: 'Staff',
    ratingsAndComment: {
      staff: 0,
      punctual: 0,
      helpful: 0,
      knowledge: 0,
      comments: '',
    },
    setRatingsAndComment: mockSetRatingsAndComment,
  };

  beforeEach(() => {
    mockSetRatingsAndComment.mockClear();
    const result = renderWithProviders(<ReviewInput {...initialProps} />, {
      reducer: reducers,
      preloadedState: { currentUser: initialCurrentUserState } as Partial<{
        currentUser: CurrentUser & PersistPartial;
      }>,
    });
    store = result.store;
    asFragment = result.asFragment;
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
  /* -------------------------- - ------------------------- */
  it('2--Renders the attribute name', () => {
    expect(screen.getByText('Staff')).toBeInTheDocument;
  });
  /* -------------------------- - ------------------------- */
  it('3--Renders 5 star inputs', () => {
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });
  /* -------------------------- - ------------------------- */
  it('4--Updates rating when a star is clicked',  () => {
    const radioInputs = screen.getAllByRole('radio');

    fireEvent.click(radioInputs[0]); // Quality-rate5

    expect(mockSetRatingsAndComment).toHaveBeenCalledTimes(1);
    expect(mockSetRatingsAndComment).toHaveBeenCalledWith(expect.any(Function)); // essentially verifying that handleRatingChange is working as expected, passing a function to setRatingsAndComment.

    // Call the function passed to setRatingsAndComment
    const updateFunction = mockSetRatingsAndComment.mock.calls[0][0]; //represent handleRatingChange
    //const result = updateFunction({ knowledge: 4 }); // the previous state
    //expect(result).toEqual({ staff: 5, knowledge: 4 });
    const result = updateFunction(initialProps.ratingsAndComment);
    console.log(result);
    expect(result).toEqual({
      ...initialProps.ratingsAndComment,
      staff: 5,
    });
  });
  /* -------------------------- - ------------------------- */

  //   it('checks the correct star based on current rating', () => {
  //     const props = {
  //       ...initialProps,
  //       ratingsAndComment: { quality: 3 },
  //     };
  //     render(<Review {...props} />);
  //     const checkedStar = screen.getByLabelText('3') as HTMLInputElement;
  //     expect(checkedStar.checked).toBe(true);
  //   });

  //   it('handles case-insensitive attribute names', () => {
  //     const props = {
  //       ...initialProps,
  //       attributeName: 'QUALITY',
  //       ratingsAndComment: { quality: 4 },
  //     };
  //     render(<Review {...props} />);
  //     expect(screen.getByText('4')).toBeInTheDocument();
  //   });

  //   it('renders SVG stars', () => {
  //     render(<Review {...initialProps} />);
  //     const svgs = screen.getAllByRole('img', { hidden: true });
  //     expect(svgs).toHaveLength(5);
  //   });
});
