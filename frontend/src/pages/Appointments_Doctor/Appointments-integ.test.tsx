import { screen } from '@testing-library/react';
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext';
import Appointments from './Appointments';
import '@testing-library/jest-dom';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import appointmentsForDoctorReducer from './../../store/appointmentsForDoctor-slice/appointmentsForDoctor-slice';
import currentUserReducer from '../../store/currentUser-slice/currentUser-slice';
import { combineReducers } from 'redux';
//import { act } from 'react';

jest.mock('./../../services/axiosInterceptors');

const reducers = combineReducers({
  currentUser: currentUserReducer,
  appointmentsForDoctor: appointmentsForDoctorReducer,
  // other reducers...
});

test('fetches & receives appointments after render due to useEffect', async () => {
  const preloadedState: Partial<{ currentUser: CurrentUser & PersistPartial }> =
    {
      currentUser: {
        error: null,
        status: 'login success',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmMxZjEwYWQwMTVlNmRmMTdhOThlNCIsImlhdCI6MTcyNDM2NDc0MywiZXhwIjoxNzI0MzY2NTQzfQ.Dou2IoNts0qtTH6H0IVT0xnw2GsFUEiugZm3F_SagGo',
        userData: {
          _id: '666c1f10ad015e6df17a98e4',
          name: 'Aytekin',
          email: 'aytekin@test.com',
          role: 'doctor',
          doctorId: 'mockDoctorID',
          DOB: '1980-11-04T00:00:00.000Z',
          image:
            'https://patient-appointment-system.s3.eu-west-2.amazonaws.com/1721905296892-doctor.jpg',
          address: {
            street: 'Burleigh Road',
            city: 'London',
            town: 'London Borough of Sutton',
            country: 'United Kingdom',
            postalCode: 'SM3 9NB',
          },
          policy: true,
        },
        _persist: {
          version: -1,
          rehydrated: false,
        },
      },
    };

  renderWithProviders(<Appointments />, {
    reducer: reducers,
    preloadedState,
  });

  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});

// should show no user initially, and not be fetching a user
//expect(screen.getByText(/no user/i)).toBeInTheDocument();
//expect(screen.queryByText(/Loading\.\.\./i)).not.toBeInTheDocument();

// after clicking the 'Fetch user' button, it should now show that it is fetching the user
//fireEvent.click(screen.getByRole('button', { name: /Fetch user/i }));
//expect(screen.getByText(/no user/i)).toBeInTheDocument();

// after some time, the user should be received
// expect(await screen.findByText(/John Smith/i)).toBeInTheDocument();
//expect(screen.queryByText(/no user/i)).not.toBeInTheDocument();
//expect(screen.queryByText(/Fetching user\.\.\./i)).not.toBeInTheDocument();
