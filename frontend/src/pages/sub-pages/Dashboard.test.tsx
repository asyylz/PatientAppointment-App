import { fireEvent, render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from 'react';
import renderer from 'react-test-renderer';
import store from '../../store/index';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import '@testing-library/dom';
import { fetchAppointmentsForPatient } from '../../store/appointmentsForPatient-slice';
import Dashboard from './Dashboard';
import {
  deleteAppointmentMock,
  updateAppointmentMock,
} from '../../_testUtils/mocks/mockHttp';
/* ------------------- Mock useEffect ------------------- */
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

 /* ------------------- Mock useHttp ------------------ */
// it needs to be declared at the top level of the test file to override the module system before any imports occur. 
jest.mock('../../hooks/useHttp');
 
/* -------------------- Initial state ------------------- */
const initialState = {
  currentUser: {
    status: 'success',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmMxZjEwYWQwMTVlNmRmMTdhOThlNCIsImlhdCI6MTcyMzI0MzI0NywiZXhwIjoxNzIzMjQ1MDQ3fQ.7QOdK3nCWtb5wQ1yWZD26GhZ731F8nZzlH-d9-oonrY',
    userData: {
      _id: '6673662fbd42a966b75dec92',
      name: 'Asiye',
      email: 'alice@test.com',
      DOB: '1986-01-22T00:00:00.000Z',
      image: 'test image',
      role: 'doctor',
      address: {
        street: '123 Main St',
        city: 'New York',
        country: 'NY',
        town: 'test town',
        postalCode: '10001',
      },
    },
    _persist: { version: -1, rehydrated: true },
  },
  departments: { entities: [], status: 'idle', error: null },
  doctors: {
    entities: [],
    status: 'idle',
    error: null,
    _persist: { version: -1, rehydrated: true },
  },
  reviews: { entities: [], status: 'idle', error: null },
  search: '',
  appointmentsForDoctor: { entities: [], status: 'idle', error: null },
  appointmentsForPatient: { entities: [], status: 'idle', error: null },
};

/* ------------------- After dispatch ------------------- */
const afterDispatchState = {
  entities: {
    appointmentsForPatient: [
      {
        _id: '66b0a0c31d2124f7d8aaa65b',
        doctorId: {
          _id: '665f0f2959c971659af920ca',
          firstName: 'Bowen',
          lastName: 'Chan',
          departmentId: '6660fbd12e3c00fe18cfceef',
        },
        patientId: '6673662fbd42a966b75dec92',
        appointmentDateAndTime: '2024-08-16T11:00:00.000Z',
        reason: 'Before update',
        diagnose: null,
        status: null,
        referral: false,
      },
    ],
  },
  status: 'succeeded',
  error: null,
};

/* ---------------- Test Component ------------------ */
describe('Dasboard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  /* -------------------------- - ------------------------- */
  it('1--Renders correctly before data is fetched', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  /* -------------------------- - ------------------------- */
  it('2--Initializes state with status "idle', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    // Initial state should be 'idle'
    expect(store.getState().appointmentsForPatient.status).toEqual('idle');
    expect(store.getState().appointmentsForPatient).toEqual(
      initialState.appointmentsForPatient
    );
  });
  /* -------------------------- - ------------------------- */
  it('3--Dispatches fetchAppointmentsForPatient action and updates state with the action payload', async () => {
    expect(store.getState().appointmentsForPatient.status).toEqual('idle');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      store.dispatch(
        fetchAppointmentsForPatient({
          id: '6673662fbd42a966b75dec92', // id same with initialState currentUser Id
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmMxZjEwYWQwMTVlNmRmMTdhOThlNCIsImlhdCI6MTcyMzI0MzI0NywiZXhwIjoxNzIzMjQ1MDQ3fQ.7QOdK3nCWtb5wQ1yWZD26GhZ731F8nZzlH-d9-oonrY',
        })
      );
    });

    expect(store.getState().appointmentsForPatient.status).toEqual('loading');
    //console.log(store.getState().appointmentsForPatient.status);
    const fullfilledAction = {
      type: 'appointmentsForPatient/fetchWithIdAndToken/fulfilled',
      payload: {
        appointmentsForPatient: [
          {
            _id: '66b0a0c31d2124f7d8aaa65b',
            doctorId: {
              _id: '665f0f2959c971659af920ca',
              firstName: 'Bowen',
              lastName: 'Chan',
              departmentId: '6660fbd12e3c00fe18cfceef',
            },
            patientId: '6673662fbd42a966b75dec92',
            appointmentDateAndTime: '2024-08-16T11:00:00.000Z',
            reason: 'Before update',
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
    console.log(store.getState().appointmentsForPatient.status);
    console.log(store.getState().appointmentsForPatient.entities);
  });

  /* -------------------------- - ------------------------- */
  it('4--Renders fetched data in the DOM after dispatching action', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    // After dispatching the action, the state should be updated
    expect(store.getState().appointmentsForPatient).toEqual(afterDispatchState);
    // console.log(store.getState().appointmentsForPatient);
  });
  /* -------------------------- - ------------------------- */
  it('5--Renders 7 cells per row with correct values based on fetched data', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBe(7);
    // Check the content of the cells
    expect(cells[0]).toHaveTextContent('1.');
    expect(cells[1]).toHaveTextContent('Dr. Bowen Chan');
    expect(cells[2]).toHaveTextContent('16/08/2024 Friday');
    expect(cells[3]).toHaveTextContent('11:00');
    expect(cells[4]).toHaveTextContent('Before update');
    expect(cells[5]).toHaveTextContent('');
    expect(cells[6]).toContainHTML('svg');
  });
  /* -------------------------- - ------------------------- */
  it('6--Renders the correct number of rows based on the fetched data length', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    const rows = within(
      screen.getByTestId('appointments-patient')
    ).getAllByRole('row');
    // we have two <tr> tag for decoration,  they need to be taken out
    expect(rows.length - 2).toEqual(
      afterDispatchState.entities.appointmentsForPatient.length
    );
  });
  /* -------------------------- - ------------------------- */
  it('7--Displays content correctly after data is successfully fetched', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  /* -------------------------- - ------------------------- */
  it('8--Opens Appointment form when the edit icon is clicked, fire delete button, opens modal window for confirmation, fire confirm button and trigger delete action', async () => {
    render(
      <>
        <div id="modal" data-testid="modal"></div>
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      </>
    );
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
        '66b0a0c31d2124f7d8aaa65b'
      );
      expect(deleteAppointmentMock).toHaveBeenCalledTimes(1);
    });

    // Additional logging
    console.log(
      'deleteAppointmentMock calls:',
      deleteAppointmentMock.mock.calls
    );

    expect(
      screen.queryByRole('button', { name: 'Confirm' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.queryByText('Update')).not.toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });
  /* -------------------------- - ------------------------- */
  it('9--Opens Appointment form when the edit icon is clicked, fire delete button, opens modal window for confirmation, fire cancel button and close confirmation window', async () => {
    render(
      <>
        <div id="modal" data-testid="modal"></div>
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      </>
    );
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
  it('10--open an appointment form by clicking the edit icon, make changes in the inputs, fire the update button, trigger the update action, and finally close the modal window', async () => {
    render(
      <>
        <div id="modal" data-testid="modal"></div>
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      </>
    );
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

    // fireEvent.change(screen.getByLabelText('Reason'), {
    //   target: { value: 'Updated Reason' },
    // });

    // Simulate clicking the update button
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    await act(async () => {
      expect(updateAppointmentMock).toHaveBeenCalledWith(
        {
          appointmentDateAndTime: '2024-08-16T11:00:00.000Z',
          reason: 'After update',
        },
        '66b0a0c31d2124f7d8aaa65b'
      );
      expect(updateAppointmentMock).toHaveBeenCalledTimes(1);
    });

    // Additional logging
    console.log(
      'updateAppointmentMock calls:',
      updateAppointmentMock.mock.calls
    );

    const fullfilledAction = {
      type: 'appointmentsForPatient/fetchWithIdAndToken/fulfilled',
      payload: {
        appointmentsForPatient: [
          {
            _id: '66b0a0c31d2124f7d8aaa65b',
            doctorId: {
              _id: '665f0f2959c971659af920ca',
              firstName: 'Bowen',
              lastName: 'Chan',
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

    console.log(store.getState().appointmentsForPatient.status);
    console.log(store.getState().appointmentsForPatient);
  });
  /* -------------------------- - ------------------------- */
  it('11--Renders the error if fetchAppointmentsForPatient returns error', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      store.dispatch({
        type: 'appointmentsForPatient/fetchWithIdAndToken/rejected',
        payload: new Error('Failed to fetch appointments for this patient'),
      });
    });
    expect(
      screen.getByText('Error: Failed to fetch appointments for this patient')
    ).toBeInTheDocument();
  });
});
