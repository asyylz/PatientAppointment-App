import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Appointments from './Appointments';
import { act } from 'react';
//import { jest } from '@jest/globals';
import store from '../../store/index';
//import { configureStore } from '@reduxjs/toolkit';
//import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { fetchAppointmentsForDoctor } from '../../store/appointmentsForDoctor-slice';

// Define initial state
const initialState = {
  currentUser: {
    status: 'idle',
    token: '',
    userData: null,
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
  it('should have initial state with status "idle"', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Appointments />
        </MemoryRouter>
      </Provider>
    );
    //console.log(store.getState().currentUser);
    // Initial state should be 'idle'
    expect(store.getState().appointmentsForDoctor.status).toEqual('idle');
    expect(store.getState()).toEqual(initialState);
  });

  it('should dispatch fetchAppointmentsForDoctor action and update the state with the action payload', async () => {
    expect(store.getState().appointmentsForDoctor.status).toEqual('idle');

  
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Appointments />
          </MemoryRouter>
        </Provider>
      );
    
    console.log(store.getState().appointmentsForDoctor.status);

    await act(async () => {
      store.dispatch(
        fetchAppointmentsForDoctor({
          id: '665f0f2959c971659af920ca',
          token: 'someToken',
        })
      );
    });

    expect(store.getState().appointmentsForDoctor.status).toEqual('loading');
    //console.log(store.getState().appointmentsForDoctor.status);

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

   // console.log(store.getState().appointmentsForDoctor.status);
  });
  it('should  see data after dispatching in DOM', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Appointments />
        </MemoryRouter>
      </Provider>
    );

    //console.log(store.getState().appointmentsForDoctor);
    
    // After dispatching the action, the state should be updated
    expect(store.getState().appointmentsForDoctor).toEqual(afterDispatchState);

    const cells = screen.getAllByRole('cell');

    // Check the content of the cells
    expect(cells[0]).toHaveTextContent('Asiye');
    expect(cells[1]).toHaveTextContent('1986-01-22');
    expect(cells[2]).toHaveTextContent('09/08/2024 Friday');
    expect(cells[3]).toHaveTextContent('11:00');
    expect(cells[4]).toHaveTextContent('Regular Checkup');
    expect(cells[5]).toHaveTextContent('Pain killer given.');
    expect(cells[6]).toHaveTextContent('Yes');

    expect(screen.getByText('Asiye')).toBeInTheDocument();
    expect(screen.getByText('1986-01-22')).toBeInTheDocument();
    expect(screen.getByText('09/08/2024 Friday')).toBeInTheDocument();
    expect(screen.getByText('11:00')).toBeInTheDocument();
    expect(screen.getByText('Regular Checkup')).toBeInTheDocument();
    expect(screen.getByText('Pain killer given.')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });
});
