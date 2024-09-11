import { render, fireEvent, screen } from '@testing-library/react';
import ReviewInput from './../ReviewInput/ReviewInput.tsx';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext.tsx';
import reviewsReducer from './../../store/reviews-slice/reviews-slice.ts';
import currentUserReducer from './../../store/currentUser-slice/currentUser-slice.ts';
import { combineReducers } from 'redux';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { AppStore } from '../../store/index/index.ts';

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
    attributeName: 'Quality',
    ratingsAndComment: {
      quality: 0,
      staff: 5,
      punctual: 4,
      helpful: 4,
      knowledge: 3,
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
  it('renders the attribute name', () => {
    expect(screen.getByText('Quality')).toBeInTheDocument;
  });
  /* -------------------------- - ------------------------- */
  it('renders 5 star inputs', () => {
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });
  /* -------------------------- - ------------------------- */
  it('updates rating when a star is clicked', () => {
    const fourthStar = screen.getByLabelText('4');
    fireEvent.click(fourthStar);

    expect(mockSetRatingsAndComment).toHaveBeenCalledTimes(1);
    expect(mockSetRatingsAndComment).toHaveBeenCalledWith(expect.any(Function));

    // Call the function passed to setRatingsAndComment
    const updateFunction = mockSetRatingsAndComment.mock.calls[0][0];
    const result = updateFunction({ quality: 0 });
    expect(result).toEqual({ quality: 4 });
  });
  /* -------------------------- - ------------------------- */
  it('displays the current rating', () => {
    const props = {
      ...initialProps,
      ratingsAndComment: {
        quality: 0,
        staff: 5,
        punctual: 2,
        helpful: 2,
        knowledge: 3,
      },
    };
    render(<ReviewInput {...props} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

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
