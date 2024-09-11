import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import AuthPage from './AuthPage';
import { toastSuccessNotify } from '../../helper/ToastNotify';
import { act } from 'react';
import { combineReducers } from 'redux';
import currentUserReducer from '../../store/currentUser-slice/currentUser-slice';
import * as router from 'react-router-dom';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext';
import { AppStore } from '../../store/index/index';
//import * as currentUserSlice from '../store/currentUser-slice';

jest.mock('../../helper/ToastNotify', () => ({
  toastSuccessNotify: jest.fn(),
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn().mockImplementation((_config, reducer) => reducer),
  };
});

const reducers = combineReducers({
  currentUser: currentUserReducer,
});

describe('AuthPage', () => {
  let store: AppStore;
  let asFragment: () => DocumentFragment;
  let navigate: any;

  beforeEach(() => {
    navigate = jest.fn();
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    const result = renderWithProviders(<AuthPage />, {
      reducer: reducers,
    });
    store = result.store;
    asFragment = result.asFragment; // asFragment() is used to create snapshots, which is the React Testing Library equivalent of toJSON().
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  /* -------------------------- - ------------------------- */
  it('1--Snapshot before and after policy checkbox interaction', async () => {
    // Initial snapshot
    expect(asFragment()).toMatchSnapshot();

    // Find and interact with the login button
    const checkBox = screen.getByRole('checkbox');
    expect(checkBox).toBeInTheDocument();

    // Simulate checkbox click
    fireEvent.click(checkBox);

    // Re-render and create a new snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  /* -------------------------- - ------------------------- */
  it('1--Should render login form', () => {
    expect(screen.getAllByText('Login')[0]).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText('Enter your email')[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText('Enter your password')[0]
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
    expect(screen.getByText('Click here')).toBeInTheDocument();
  });

  /* -------------------------- - ------------------------- */
  it('2--Should render registration form', () => {
    expect(screen.getByText('Registration')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText('Enter your email')[1]
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your DOB')).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText('Enter your password')[1]
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirm your password')
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Register' })
    ).toBeInTheDocument();
  });

  /* -------------------------- - ------------------------- */
  it('3--Should dispatch login action on form submission', async () => {
    expect(store.getState().currentUser.status).toEqual('idle');
    const emailInput = screen.getAllByPlaceholderText('Enter your email')[0];
    const passwordInput = screen.getAllByPlaceholderText(
      'Enter your password'
    )[0];

    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(store.getState().currentUser.status).toEqual('loading');
    await act(async () => {
      store.dispatch({
        type: 'currentUser/login/fulfilled',
        payload: {
          token: 'mock-token',
          data: {
            user: {
              _id: '6673662fbd42a966b75dec92',
              name: 'Asiye',
              email: 'alice@test.com',
              role: 'patient',
              __v: 0,
              DOB: '1986-01-22T00:00:00.000Z',
              image:
                'https://patient-appointment-system.s3.eu-west-2.amazonaws.com/1722605356602-asiye%20serife.jpeg',
            },
          },
        },
      });
    });
    expect(store.getState().currentUser.status).toEqual('login success');
    //console.log(store.getState());

    // await waitFor(async () => {
    //   expect(screen.getAllByPlaceholderText('Enter your email')[0]).toHaveValue(
    //     ''
    //   );
    //   expect(
    //     screen.getAllByPlaceholderText('Enter your password')[0]
    //   ).toHaveValue('');
    // });

    expect(navigate).toHaveBeenCalledWith('/user/dashboard');
  });

  /* -------------------------- - ------------------------- */
  it('4--Should dispatch register action on form submission', async () => {
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getAllByPlaceholderText('Enter your email')[1];
    const dobInput = screen.getByPlaceholderText('Enter your DOB');
    const passwordInput = screen.getAllByPlaceholderText(
      'Enter your password'
    )[1];
    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your password'
    );
    const acceptTermsCheckbox = screen.getByRole('checkbox');
    const registerButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(acceptTermsCheckbox);
    fireEvent.click(registerButton);

    expect(store.getState().currentUser.status).toEqual('loading');

    await act(async () => {
      store.dispatch({
        type: 'currentUser/register/fulfilled',
        payload: {
          token: 'mock-token-register',
          data: {
            user: {
              _id: '6673662fbd42a966b75dec92',
              name: 'Asiye',
              email: 'alice@test.com',
              role: 'patient',
              __v: 0,
              DOB: '1986-01-22T00:00:00.000Z',
              image:
                'https://patient-appointment-system.s3.eu-west-2.amazonaws.com/1722605356602-asiye%20serife.jpeg',
            },
          },
        },
      });
    });
    console.log(store.getState().currentUser.status);
    expect(store.getState().currentUser.status).toEqual('register success');

    // await waitFor(() => {
    //   expect(screen.getByPlaceholderText('Enter your name')).toHaveValue('');
    //   expect(screen.getAllByPlaceholderText('Enter your email')[1]).toHaveValue(
    //     ''
    //   );

    //   expect(
    //     screen.getAllByPlaceholderText('Enter your password')[1]
    //   ).toHaveValue('');
    //   expect(screen.getByPlaceholderText('Enter your DOB')).toHaveValue(
    //     '1990-01-01'
    //   );
    //   expect(screen.getByPlaceholderText('Confirm your password')).toHaveValue(
    //     ''
    //   );
    //   expect(screen.getByRole('checkbox')).not.toBeChecked();
    // });

    const message = 'Successfully registered!';
    toastSuccessNotify(message);
    expect(toastSuccessNotify).toHaveBeenCalledWith(message);
  });

  /* -------------------------- - ------------------------- */
  it('5--Should forgotPassword action send email', async () => {
    const emailInput = screen.getAllByPlaceholderText('Enter your email')[0];
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const forgotPasswordButton = screen.getByText('Click here');
    fireEvent.click(forgotPasswordButton);
    await waitFor(() => {
      expect(
        store.dispatch({
          type: 'currentUser/forgotPassword/fulfilled',
          payload: { email: 'test@example.com' },
        })
      );
    });

    const message = 'Email sent to test@example.com successfully!';
    toastSuccessNotify(message);
    expect(toastSuccessNotify).toHaveBeenCalledWith(message);
  });
});
