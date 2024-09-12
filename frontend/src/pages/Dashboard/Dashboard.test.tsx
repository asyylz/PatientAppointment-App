import { screen, within, fireEvent } from '@testing-library/react';
import { act } from 'react';

import '@testing-library/jest-dom';
import '@testing-library/dom';
import { fetchAppointmentsForPatient } from '../../store/appointmentsForPatient-slice/appointmentsForPatient-slice';
import currentUserReducer from '../../store/currentUser-slice/currentUser-slice';
import appointmentsForPatientReducer from '../../store/appointmentsForPatient-slice/appointmentsForPatient-slice';
import Dashboard from './Dashboard';
import {
  deleteAppointmentMock,
  updateAppointmentMock,
} from '../../_testUtils/mocks/mockHttp';
import { combineReducers } from 'redux';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext';
import { PersistPartial } from 'redux-persist/es/persistReducer';

import * as axiosInterceptors from '../../services/axiosInterceptors';
import { AppStore } from '../../store/index';

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn().mockImplementation((_config, reducer) => reducer),
  };
});

/* ------------------- Mock useEffect ------------------- */
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));
/* ------------------- Mock useHttp ------------------ */
// it needs to be declared at the top level of the test file to override the module system before any imports occur.
jest.mock('../../hooks/useHttp/useHttp');
jest.mock('../../services/axiosInterceptors');

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

const reducers = combineReducers({
  currentUser: currentUserReducer,
  appointmentsForPatient: appointmentsForPatientReducer,
});

const resolvedValue = {
  total: 3,
  upcomingAppointments: 1,
  appointmentsForPatient: [
    {
      _id: '66bc6d41a0c6ea472a2fcd4c',
      doctorId: {
        _id: '665f0f2959c971659af920e5',
        firstName: 'Aytekin',
        lastName: 'Yaliz',
        departmentId: '6660fbd12e3c00fe18cfceec',
      },
      patientId: '6673662fbd42a966b75dec92',
      appointmentDateAndTime: '2024-08-16T15:30:00.000Z',
      reason: 'Before update',
      diagnose: null,
      status: null,
      referral: false,
    },
  ],
};
/* ---------------- Test Component ------------------ */
describe('Dasboard', () => {
  let store: AppStore;
  let asFragment: () => DocumentFragment;

  beforeEach(() => {
    const result = renderWithProviders(<Dashboard />, {
      reducer: reducers,
      preloadedState: {
        currentUser: initialCurrentUserState as CurrentUser & PersistPartial,
        appointmentsForPatient: { entities: [], status: 'idle', error: null },
      },
    });

    store = result.store;
    asFragment = result.asFragment;
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  /* -------------------------- - ------------------------- */
  it('1--Initializes state with status "idle', () => {
    expect(store.getState().appointmentsForPatient.status).toEqual('idle');
    expect(store.getState().appointmentsForPatient).toEqual({
      entities: [],
      status: 'idle',
      error: null,
    });
  });
  /* -------------------------- - ------------------------- */
  it('2--Before fetch loading text should appear', () => {
    expect(asFragment()).toMatchSnapshot();
    console.log(store.getState().appointmentsForPatient);
  });

  /* -------------------------- - ------------------------- */
  it('3--Dispatches fetchAppointmentsForPatient action and updates state with the action payload', async () => {
    axiosInterceptors.axiosInterceptorsWithToken.get = jest
      .fn()
      .mockResolvedValue({ data: { data: resolvedValue } });

    await act(async () => {
      store.dispatch(
        fetchAppointmentsForPatient({
          id: '6673662fbd42a966b75dec92', // id same with initialState currentUser Id
        })
      );
    });
    expect(store.getState().appointmentsForPatient.status).toEqual('succeeded');

    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBe(7);
    // Check the content of the cells
    expect(cells[0]).toHaveTextContent('1.');
    expect(cells[1]).toHaveTextContent('Dr. Aytekin Yaliz');
    expect(cells[2]).toHaveTextContent('16/08/2024 Friday');
    expect(cells[3]).toHaveTextContent('15:30');
    expect(cells[4]).toHaveTextContent('Before update');
    expect(cells[5]).toHaveTextContent('');
    expect(cells[6]).toContainHTML('svg');

    const rows = within(
      screen.getByTestId('appointments-patient')
    ).getAllByRole('row');
    // we have two <tr> tag for decoration,  they need to be taken out
    expect(rows.length - 2).toEqual(
      resolvedValue.appointmentsForPatient.length
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Dasboard Modal Window', () => {
  let store: AppStore;
  //let asFragment: () => DocumentFragment;
  beforeEach(() => {
    const result = renderWithProviders(
      <>
        <div id="modal" data-testid="modal"></div>
        <Dashboard />
      </>,
      {
        reducer: reducers,
        preloadedState: {
          currentUser: initialCurrentUserState as CurrentUser & PersistPartial,
          appointmentsForPatient: {
            entities: {
              appointmentsForPatient: resolvedValue.appointmentsForPatient,
            },
            status: 'succeeded',
            error: null,
          },
        },
      }
    );
    store = result.store;
    //asFragment = result.asFragment;
    jest.spyOn(store, 'dispatch');
  });
  /* -------------------------- - ------------------------- */
  it('1--Opens Appointment form when the edit icon is clicked, fire delete button, opens modal window for confirmation, fire confirm button and trigger delete action', async () => {
    // Check if the modal is rendered
    expect(document.getElementById('modal')).toBeInTheDocument();

    // Simulate clicking the trash icon
    const editIcon = screen.getByTestId('edit-icon');
    fireEvent.click(editIcon);

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();

    const deleteButton = screen.getByText('Delete');

    fireEvent.click(deleteButton);

    expect(
      screen.getByText('You are about to cancel your recent appointment?')
    ).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    // Wait for deleteAppointment to be called
    await act(async () => {
      expect(deleteAppointmentMock).toHaveBeenCalledWith(
        '66bc6d41a0c6ea472a2fcd4c'
      );
      expect(deleteAppointmentMock).toHaveBeenCalledTimes(1);
    });

    // Additional logging
    // console.log(
    //  'deleteAppointmentMock calls:',
    // deleteAppointmentMock.mock.calls
    // );

    expect(
      screen.queryByRole('button', { name: 'Confirm' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.queryByText('Update')).not.toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });
  /* -------------------------- - ------------------------- */
  it('2--Opens Appointment form when the edit icon is clicked, fire delete button, opens modal window for confirmation, fire cancel button and close confirmation window', async () => {
    // Check if the modal is rendered
    expect(document.getElementById('modal')).toBeInTheDocument();

    // Simulate clicking the trash icon
    const editIcon = screen.getByTestId('edit-icon');
    fireEvent.click(editIcon);

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();

    const deleteButton = screen.getByText('Delete');

    fireEvent.click(deleteButton);

    expect(
      screen.getByText('You are about to cancel your recent appointment?')
    ).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();

    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });
  /* -------------------------- - ------------------------- */
  it('3--Opens an appointment form by clicking the edit icon, make changes in the inputs, fire the update button, trigger the update action, and finally close the modal window', async () => {
    // Check if the modal is rendered
    expect(document.getElementById('modal')).toBeInTheDocument();

    // Simulate clicking the trash icon
    const editIcon = screen.getByTestId('edit-icon');
    fireEvent.click(editIcon);

    //checking modal appointment form presence
    expect(screen.getByText('Appointment Details')).toBeInTheDocument();

    // Simulate changing form inputs
    fireEvent.change(
      screen.getByPlaceholderText('Please write your concerns...'),
      {
        target: { value: 'After update' }, // Example reason change
      }
    );

    // Simulate clicking the update button
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    await act(async () => {
      expect(updateAppointmentMock).toHaveBeenCalledWith(
        {
          appointmentDateAndTime: '2024-08-16T15:30:00.000Z',
          reason: 'After update',
        },
        '66bc6d41a0c6ea472a2fcd4c'
      );
      expect(updateAppointmentMock).toHaveBeenCalledTimes(1);
    });

    // Additional logging
    console.log(
      'updateAppointmentMock calls:',
      updateAppointmentMock.mock.calls
    );

    const fullfilledAction = {
      type: 'appointmentsForPatient/fetchWithId/fulfilled',
      payload: {
        appointmentsForPatient: [
          {
            _id: '66bc6d41a0c6ea472a2fcd4c',
            doctorId: {
              _id: '665f0f2959c971659af920ca',
              firstName: 'Aytekin',
              lastName: 'Yaliz',
              departmentId: '6660fbd12e3c00fe18cfceef',
            },
            patientId: '6673662fbd42a966b75dec92',
            appointmentDateAndTime: '2024-08-16T11:00:00.000Z',
            reason: 'After update',
            diagnose: null,
            status: null,
            referral: false,
          },
        ],
      },
    };

    await act(async () => {
      store.dispatch(fullfilledAction);
    });

    console.log('Current state:', store.getState().appointmentsForPatient);

    expect(screen.queryByText('Appointment Details')).not.toBeInTheDocument;
    expect(screen.getByText('Latest Appointments')).toBeInTheDocument;

    const cells = screen.getAllByRole('cell');
    expect(cells[4]).toHaveTextContent('After update');
  });
  /* -------------------------- - ------------------------- */
  it('4--Renders the error if fetchAppointmentsForPatient returns error', async () => {
    await act(async () => {
      store.dispatch({
        type: 'appointmentsForPatient/fetchWithId/rejected',
        payload: { message: 'Failed to fetch appointments for this patient' },
      });
    });
    expect(
      screen.getByText('Error: Failed to fetch appointments for this patient')
    ).toBeInTheDocument();
  });
});
