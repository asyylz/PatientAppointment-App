import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import configureStore from 'redux-mock-store';
import AuthPage from './AuthPage';

import { login, register, forgotPassword } from '../store/currentUser-slice';
import '@testing-library/jest-dom';
import { toastSuccessNotify } from './../helper/ToastNotify';

// Mock the toast function
jest.mock('./../helper/ToastNotify', () => ({
  toastSuccessNotify: jest.fn(),
}));

describe('toastSuccessNotify', () => {
  it('should call toast.success with the correct message', () => {
    const message = 'Email sent to test@example.com successfully!';
    toastSuccessNotify(message);

    expect(toastSuccessNotify).toHaveBeenCalledWith(message);
  });
});

// Create a mock store with thunk middleware
const mockStore = configureStore();

jest.mock('../store/currentUser-slice', () => ({
  login: jest.fn(() => ({
    type: 'currentUser/login/fulfilled',
    payload: {},
    fulfilled: {
      match: jest.fn((action) => action.type.endsWith('/fulfilled')),
    },
    rejected: {
      match: jest.fn((action) => action.type.endsWith('/rejected')),
    },
  })),
  register: jest.fn(() => ({
    type: 'currentUser/register/fulfilled',
    payload: {},
    fulfilled: {
      match: jest.fn((action) => action.type.endsWith('/fulfilled')),
    },
    rejected: {
      match: jest.fn((action) => action.type.endsWith('/rejected')),
    },
  })),
  forgotPassword: jest.fn(() => ({
    type: 'currentUser/forgotPassword/fulfilled',
    payload: {},
    fulfilled: {
      match: jest.fn((action) => action.type.endsWith('/fulfilled')),
    },
    rejected: {
      match: jest.fn((action) => action.type.endsWith('/rejected')),
    },
  })),
}));

describe('AuthPage', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      currentUser: {
        status: 'idle',
      },
      doctors: {
        selectedDoctor: null,
      },
    });
    store.dispatch = jest.fn();
  });

  it('should render login form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );

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

  it('should render registration form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );

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

  it('should dispatch login action on form submission', async () => {
    const mockLoginResponse = {
      type: 'currentUser/login/fulfilled',
      payload: {},
    };
    (login as unknown as jest.Mock).mockReturnValueOnce(mockLoginResponse);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getAllByPlaceholderText('Enter your email')[0];
    const passwordInput = screen.getAllByPlaceholderText(
      'Enter your password'
    )[0];
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(
        store.dispatch(
          login({ email: 'test@example.com', password: 'password123' })
        )
      ).toHaveBeenCalled;
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(login).toHaveReturnedWith(mockLoginResponse);
    });
  });

  it('should dispatch forgotPassword action', async () => {
    const mockForgotPasswordResponse = {
      type: 'currentUser/forgotPassword/fulfilled',
      payload: {},
    };
    (forgotPassword as unknown as jest.Mock).mockReturnValueOnce(
      mockForgotPasswordResponse
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );

    const forgotPasswordButton = screen.getByText('Click here');
    fireEvent.click(forgotPasswordButton);

    await waitFor(() => {
      expect(store.dispatch(forgotPassword({ email: 'test@example.com' })))
        .toHaveBeenCalled;
      expect(forgotPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(forgotPassword).toHaveReturnedWith(mockForgotPasswordResponse);
    });

    await waitFor(() => {
      expect(toastSuccessNotify).toHaveBeenCalledWith(
        'Email sent to test@example.com successfully!'
      );
    });
  });

  it('should dispatch register action on form submission', async () => {
    const mockRegisterResponse = {
      type: 'currentUser/register/fulfilled',
      payload: {},
    };
    (register as unknown as jest.Mock).mockReturnValueOnce(
      mockRegisterResponse
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );

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

    await waitFor(() => {
      expect(
        store.dispatch(
          register({
            name: 'John Doe',
            email: 'test@example.com',
            DOB: new Date('1990-01-01T00:00:00.000Z'),
            password: 'password123',
            passwordConfirm: 'password123',
            policy: true,
          })
        )
      ).toHaveBeenCalled;
      expect(register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'test@example.com',
        DOB: new Date('1990-01-01T00:00:00.000Z'),
        password: 'password123',
        passwordConfirm: 'password123',
        policy: true,
      });
      expect(register).toHaveReturnedWith(mockRegisterResponse);
    });
  });
});
