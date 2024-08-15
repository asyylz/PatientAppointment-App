import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import Appointments from './Appointments';
import { act } from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import '@testing-library/dom';
import appointmentsForDoctorReducer from '../../store/appointmentsForDoctor-slice';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit/react';
import currentUserReducer from '../../store/currentUser-slice';
import { toastSuccessNotify } from '../../helper/ToastNotify';
import {
  deleteAppointmentMock,
  //updateAppointmentMock,
} from './../../_testUtils/mocks/mockHttp';

jest.mock('../../helper/ToastNotify', () => ({
  toastSuccessNotify: jest.fn(),
}));
jest.mock('../../hooks/useHttp');

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn().mockImplementation((_config, reducer) => reducer),
    // persistStore: jest.fn().mockReturnValue({
    //   // Add any other methods you need to mock
    // }),
  };
});

// Start store with initial state for `currentUser`
const initialCurrentUserState: CurrentUser = {
  status: 'login success',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzM2NjJmYmQ0MmE5NjZiNzVkZWM5MiIsImlhdCI6MTcyMzc1NDAzOSwiZXhwIjoxNzIzNzU1ODM5fQ.4Nmyge8591WiGN3wEijyn-9Tx7A0GCBu5w2a0CgVaQs',
  userData: {
    _id: '6673662fbd42a966b75dec92',
    name: 'Asiye',
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
const mockAllReducers = combineReducers({
  currentUser: currentUserReducer,
  appointmentsForDoctor: appointmentsForDoctorReducer,
});

const store = configureStore({
  reducer: mockAllReducers,
  preloadedState: {
    currentUser: initialCurrentUserState,
  },
});

const afterDispatchState = {
  entities: {
    appointmentsForDoctor: [
      {
        _id: '66aff973470dee291e76b8fc',
        doctorId: '665f0f2959c971659af920ca',
        patientId: {
          _id: '6673662fbd42a966b75dec92',
          name: 'Asiye',
          email: 'alice@test.com',
          DOB: '1986-01-22T00:00:00.000Z',
        },
        appointmentDateAndTime: '2024-08-09T11:00:00.000Z',
        reason: 'Regular Checkup',
        diagnose: 'Pain killer given.',
        referral: true,
        status: false,
      },
    ],
  },
  status: 'succeeded',
  error: null,
};

describe('Appointments Component', () => {
  beforeEach(() => {
    render(
      <>
        <div id="modal" data-testid="modal"></div>
        <Provider store={store}>
          <MemoryRouter>
            <Appointments />
          </MemoryRouter>
        </Provider>
      </>
    );
  });
  /* -------------------------- - ------------------------- */
  it('1--Renders correctly before data is fetched', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <Appointments />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  /* -------------------------- - ------------------------- */
  it('2--Initializes state with status "idle', async () => {
    expect(store.getState().appointmentsForDoctor.status).toEqual('idle')
    expect(
      store.dispatch({
        type: 'appointmentsForDoctor/fetchWithIdAndToken/pending',
      })
    ).toHaveBeenCalled;

    expect(store.getState().appointmentsForDoctor.status).toEqual('loading');
    await waitFor(() => {
      expect(screen.getByText('Loading...'));
    });
  
  });
  /* -------------------------- - ------------------------- */
  it('3--Dispatches fetchAppointmentsForDoctor action and updates state with the action payload', async () => {
    await act(async () => {
      store.dispatch({
        type: 'appointmentsForDoctor/fetchWithIdAndToken/fulfilled',
        payload: {
          appointmentsForDoctor: [
            {
              _id: '66aff973470dee291e76b8fc',
              doctorId: '665f0f2959c971659af920ca',
              patientId: {
                _id: '6673662fbd42a966b75dec92',
                name: 'Asiye',
                email: 'alice@test.com',
                DOB: '1986-01-22T00:00:00.000Z',
              },
              appointmentDateAndTime: '2024-08-09T11:00:00.000Z',
              reason: 'Regular Checkup',
              diagnose: 'Pain killer given.',
              referral: true,
              status: false,
            },
          ],
        },
      });
    });

    expect(store.getState().appointmentsForDoctor.status).toEqual('succeeded');
    expect(store.getState().appointmentsForDoctor).toEqual(afterDispatchState);
  });
  /* -------------------------- - ------------------------- */
  it('4--Renders 7 cells per row with correct values based on fetched data', () => {
    console.log(store.getState().appointmentsForDoctor);
    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBe(9);
    // Check the content of the cells
    expect(cells[0]).toHaveTextContent('Asiye');
    expect(cells[1]).toHaveTextContent('1986-01-22');
    expect(cells[2]).toHaveTextContent('09/08/2024 Friday');
    expect(cells[3]).toHaveTextContent('11:00');
    expect(cells[4]).toHaveTextContent('Regular Checkup');
    expect(cells[5]).toHaveTextContent('Pain killer given.');
    expect(cells[6]).toHaveTextContent('Yes');
    expect(cells[7]).toContainHTML('No');
    expect(cells[8]).toContainHTML('svg');

    expect(screen.getByText('Asiye')).toBeInTheDocument();
    expect(screen.getByText('1986-01-22')).toBeInTheDocument();
    expect(screen.getByText('09/08/2024 Friday')).toBeInTheDocument();
    expect(screen.getByText('11:00')).toBeInTheDocument();
    expect(screen.getByText('Regular Checkup')).toBeInTheDocument();
    expect(screen.getByText('Pain killer given.')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  /* -------------------------- - ------------------------- */
  it('5--Renders the correct number of rows based on the fetched data length', () => {
    const rows = within(screen.getByTestId('appointments')).getAllByRole('row');
    // we have two <tr> tag for decoration,  they need to be taken out
    expect(rows.length - 2).toEqual(
      afterDispatchState.entities.appointmentsForDoctor.length
    );
  });

  /* -------------------------- - ------------------------- */
  it('10--Appointments table row click should select appointment', () => {
    const rows = within(screen.getByTestId('appointments')).getAllByRole('row');
    fireEvent.click(rows[1]);
  });

  /* -------------------------- - ------------------------- */
  it('6--Displays content correctly after data is successfully fetched', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <Appointments />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  /* -------------------------- - ------------------------- */
  it('7--Opens confirmation modal and triggers delete action when the trash icon is clicked', async () => {
    expect(document.getElementById('modal')).toBeInTheDocument();

    // Simulate clicking the trash icon
    const trashIcon = screen.getByTestId('trash-icon');
    fireEvent.click(trashIcon);

    expect(
      screen.getByText("Please confirm to delete the patient's appointment?")
    ).toBeInTheDocument();

    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    // Wait for deleteAppointment to be called
    await waitFor(() => {
      expect(deleteAppointmentMock).toHaveBeenCalledWith(
        '66aff973470dee291e76b8fc'
      );
      expect(deleteAppointmentMock).toHaveBeenCalledTimes(1);
    });

    const message = 'Your appointment successfully deleted.';
    toastSuccessNotify(message);
    expect(toastSuccessNotify).toHaveBeenCalledWith(message);
  });

  /* -------------------------- - ------------------------- */
  it('8--Opens confirmation modal and triggers cancel action when the trash icon is clicked', async () => {
    expect(document.getElementById('modal')).toBeInTheDocument();

    // Simulate clicking the trash icon
    const trashIcon = screen.getByTestId('trash-icon');
    fireEvent.click(trashIcon);

    expect(
      screen.getByText("Please confirm to delete the patient's appointment?")
    ).toBeInTheDocument();

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');

    fireEvent.click(cancelButton);
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Please confirm to delete the appointment?')
    ).not.toBeInTheDocument();
  });
  /* -------------------------- - ------------------------- */
  it('9--Should render error message in DOM if fetchAppointmentsForDoctor fails', async () => {
    await act(async () => {
      store.dispatch({
        type: 'appointmentsForDoctor/fetchWithIdAndToken/rejected',
        payload: { message: 'Error fetching appointments' },
      });
    });
    expect(store.getState().appointmentsForDoctor.status).toEqual('failed');
    expect(screen.getByText('Error: Error fetching appointments'));
  });
});
