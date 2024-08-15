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
import store from '../../store/index';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import '@testing-library/dom';
import { fetchAppointmentsForDoctor } from '../../store/appointmentsForDoctor-slice';
import useHttp from '../../hooks/useHttp';
import { axiosInterceptorsWithToken } from './../../hooks/axiosInterceptors';

jest.mock('./../../hooks/axiosInterceptors', () => ({
  axiosInterceptorsWithToken: {
    delete: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

const deleteMock = axiosInterceptorsWithToken.delete as jest.Mock;
deleteMock.mockResolvedValue({
  data: { success: true }, // Simulate a successful delete response
});

const getMock = axiosInterceptorsWithToken.get as jest.Mock;

// Simulate loading state
getMock.mockImplementationOnce(() => new Promise(() => {})); // Keeps the promise pending to simulate loading
getMock.mockResolvedValue({
  data: {
    status: 'succeeded',
    error: null,
    data: {
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
        },
      ],
    },
  },
});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

// Mock the module containing the useHttp hook
jest.mock('../../hooks/useHttp');

// Set up the mock implementation for useHttp
const deleteAppointmentMock = jest.fn();

(useHttp as jest.Mock).mockReturnValue({
  deleteAppointment: deleteAppointmentMock,
});

// Define initial state
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
      },
    ],
  },
  status: 'succeeded',
  error: null,
};

describe('Appointments Component', () => {
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
  it('2--Initializes state with status "idle', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Appointments />
        </MemoryRouter>
      </Provider>
    );
    // Initial state should be 'idle'
    expect(store.getState().appointmentsForDoctor.status).toEqual('idle');
    expect(store.getState().appointmentsForDoctor).toEqual(
      initialState.appointmentsForDoctor
    );
  });
  /* -------------------------- - ------------------------- */
  it('3--Dispatches fetchAppointmentsForDoctor action and updates state with the action payload', async () => {
    expect(store.getState().appointmentsForDoctor.status).toEqual('idle');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Appointments />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      store.dispatch(
        fetchAppointmentsForDoctor({
          id: '665f0f2959c971659af920ca',
          token: 'someToken',
        })
      );
    });

    expect(store.getState().appointmentsForDoctor.status).toEqual('loading');

    const fullfilledAction = {
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
          },
        ],
      },
    };

    await act(async () => {
      store.dispatch(fullfilledAction);
    });
  });
  /* -------------------------- - ------------------------- */
  it('4--Renders fetched data in the DOM after dispatching action', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Appointments />
        </MemoryRouter>
      </Provider>
    );

    // After dispatching the action, the state should be updated
    expect(store.getState().appointmentsForDoctor).toEqual(afterDispatchState);
  });
  /* -------------------------- - ------------------------- */
  it('5--Renders 7 cells per row with correct values based on fetched data', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Appointments />
        </MemoryRouter>
      </Provider>
    );
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
  it('6--Renders the correct number of rows based on the fetched data length', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Appointments />
        </MemoryRouter>
      </Provider>
    );
    const rows = within(screen.getByTestId('appointments')).getAllByRole('row');
    // we have two <tr> tag for decoration,  they need to be taken out
    expect(rows.length - 2).toEqual(
      afterDispatchState.entities.appointmentsForDoctor.length
    );
  });

  /* -------------------------- - ------------------------- */
  it('7--Displays content correctly after data is successfully fetched', () => {
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
  it('8--Opens confirmation modal and triggers delete action when the trash icon is clicked', async () => {
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
    // Check if the modal is rendered
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

    // Additional logging
    console.log(
      'deleteAppointmentMock calls:',
      deleteAppointmentMock.mock.calls
    );
    console.log('Current state:', store.getState().appointmentsForDoctor);

    // expect(
    //   screen.getByText('Your appointment successfully deleted.')
    // ).toBeInTheDocument();
  });

  it('9--Opens confirmation modal and triggers cancel action when the trash icon is clicked', async () => {
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
    // Check if the modal is rendered
    expect(document.getElementById('modal')).toBeInTheDocument();

    //console.log(store.getState().appointmentsForDoctor);

    // Simulate clicking the trash icon
    const trashIcon = screen.getByTestId('trash-icon');
    fireEvent.click(trashIcon);
    //trashIcon.onclick = handleDelete();
    //expect(handleDelete).toHaveBeenCalledTimes(1);

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
});
