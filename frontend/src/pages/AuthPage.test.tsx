import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from './AuthPage';
import '@testing-library/jest-dom';
import { toastSuccessNotify } from '../helper/ToastNotify';
import { act } from 'react';
import { combineReducers } from 'redux';
import currentUserReducer from '../store/currentUser-slice';
import { configureStore } from '@reduxjs/toolkit/react';
import * as router from 'react-router-dom';

jest.mock('./../helper/ToastNotify', () => ({
  toastSuccessNotify: jest.fn(),
}));
// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

//jest.mock('redux-persist');
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

const mockAllReducers = combineReducers({
  currentUser: currentUserReducer,
  // other reducers...
});

const store = configureStore({
  reducer: mockAllReducers,
});

describe('AuthPage', () => {
  const navigate = jest.fn();
  beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    jest.clearAllMocks();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );
  });

  /* -------------------------- - ------------------------- */
  it('1--Snapshot before login', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <AuthPage />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  /* -------------------------- - ------------------------- */
  it('2--Should render login form', () => {
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
  it('3--Should render registration form', () => {
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
  it('4--Should dispatch login action on form submission', async () => {
    expect(store.getState().currentUser.status).toEqual('idle');
    const emailInput = screen.getAllByPlaceholderText('Enter your email')[0];
    const passwordInput = screen.getAllByPlaceholderText(
      'Enter your password'
    )[0];
    const loginButton = screen.getByRole('button', { name: 'Login' });
    //const form = screen.getByRole('form', { name: 'login-form' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    // fireEvent.submit(form);

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
    expect(store.getState().currentUser.status).toEqual('success');

    await waitFor(async () => {
      expect(screen.getAllByPlaceholderText('Enter your email')[0]).toHaveValue(
        ''
      );
      expect(
        screen.getAllByPlaceholderText('Enter your password')[0]
      ).toHaveValue('');
    });
    expect(navigate).toHaveBeenCalledWith('/user/dashboard');
  });

  /* -------------------------- - ------------------------- */
  it('5--Should dispatch register action on form submission', async () => {
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
    console.log(store.getState().currentUser.status);

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
    //console.log(store.getState().currentUser.status);
    expect(store.getState().currentUser.status).toEqual('success');

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your name')).toHaveValue('');
      expect(screen.getAllByPlaceholderText('Enter your email')[1]).toHaveValue(
        ''
      );

      expect(
        screen.getAllByPlaceholderText('Enter your password')[1]
      ).toHaveValue('');
      expect(screen.getByPlaceholderText('Enter your DOB')).toHaveValue(
        '1990-01-01'
      );
      expect(screen.getByPlaceholderText('Confirm your password')).toHaveValue(
        ''
      );
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    const message = 'Successfully registered!';
    toastSuccessNotify(message);
    expect(toastSuccessNotify).toHaveBeenCalledWith(message);
  });

  it('6--Should forgotPassword action send email', async () => {
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
