import { combineReducers } from 'redux';
import AppointmentForm from './AppointmentForm';
import currentUserReducer from './../../store/currentUser-slice/currentUser-slice.ts';
import reviewsReducer from './../../store/reviews-slice/reviews-slice.ts';
import { AppStore } from '../../store/index';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { act, fireEvent, screen } from '@testing-library/react';
import { postReviewMock } from '../../_testUtils/mocks/mockHttp.ts';

jest.mock('../../hooks/useHttp/useHttp');
jest.mock('../../services/axiosInterceptors');

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

const appointment = {
  _id: '66bc6c89a0c6ea472a2fcccf',
  doctorId: {
    _id: '665f0f2959c971659af920ca',
    firstName: 'Bowen',
    lastName: 'Chan',
    departmentId: '6660fbd12e3c00fe18cfceef',
  },
  patientId: '6673662fbd42a966b75dec92',
  appointmentDateAndTime: '2024-08-14T15:30:00.000Z',
  reason: 'test1',
  diagnose: null,
  status: 'completed',
  referral: false,
  _v: 0,
};

const reducers = combineReducers({
  currentUser: currentUserReducer,
  reviews: reviewsReducer,
  // other reducers...
});

describe('AppointmentForm Component', () => {
  let store: AppStore;
  let asFragment: () => DocumentFragment;

  const mockSetOpenModal = jest.fn().mockImplementation(() => '');

  const initialProps = {
    appointment: appointment as unknown as Appointment,
    userId: 'mockUserId',
    setOpenModal: mockSetOpenModal,
    isPatient: true,
  };

  beforeEach(() => {
    mockSetOpenModal.mockClear();
    const result = renderWithProviders(
      <>
        <div id="modal" data-testid="modal"></div>
        <AppointmentForm {...initialProps} />
      </>,
      {
        reducer: reducers,
        preloadedState: { currentUser: initialCurrentUserState } as Partial<{
          currentUser: CurrentUser & PersistPartial;
        }>,
      }
    );
    store = result.store;
    asFragment = result.asFragment;
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', async () => {
    expect(asFragment()).toMatchSnapshot();
  });
  /* -------------------------- - ------------------------- */
  it('2--Input changes should be reflected in DOM', () => {
    const time = screen.getByPlaceholderText('Appointment Time');
    const date = screen.getByPlaceholderText('Appointment Date');
    const reason = screen.getByPlaceholderText('Please write your concerns...');
    fireEvent.change(time, { target: { value: '11:30' } });
    fireEvent.change(date, { target: { value: '2024-08-20' } });
    fireEvent.change(reason, { target: { value: 'new updated reason' } });

    expect(screen.queryByText('11:30'));
    expect(screen.queryByText('2024-08-20'));
    expect(screen.queryByText('new updated reason'));
  });
  /* -------------------------- - ------------------------- */
  it('3--PostReview should be called with corret arguments', async () => {
    const leaveCommentButton = screen.getByRole('button', {
      name: 'Leave comment',
    });
    fireEvent.click(leaveCommentButton);

    const comments = screen.getByPlaceholderText('Leave your comments here...');
    fireEvent.change(comments, { target: { value: 'new comments' } });
    expect(screen.queryByText('new comments'));

    const commentButton = screen.getByRole('button', {
      name: 'Comment',
    });
    fireEvent.click(commentButton);

    // Wait for deleteAppointment to be called
    await act(async () => {
      expect(postReviewMock).toHaveBeenCalledWith({
        attributes: { helpful: 0, knowledge: 0, punctual: 0, staff: 0 }, // these values come from initial props
        comments: 'new comments',
        doctorId: '665f0f2959c971659af920ca',
        userId: 'mockUserId',
      });
      expect(postReviewMock).toHaveBeenCalledTimes(1);
    });
  });
  /* -------------------------- - ------------------------- */
  it('4--After cancelling review   related states should be emptied', () => {
    const leaveCommentButton = screen.getByRole('button', {
        name: 'Leave comment',
      });
      fireEvent.click(leaveCommentButton);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);
    expect(screen.queryByText('Leave your comments here...')).not.toBeInTheDocument();
  });
  it('5--Closing AppointmentForm', () => {
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    expect(screen.queryByText('Please write diognoses...')).not.toBeInTheDocument();
  });
});
