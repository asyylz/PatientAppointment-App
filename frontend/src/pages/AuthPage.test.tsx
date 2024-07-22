import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import AuthPage from './AuthPage';

import { login, register } from '../store/currentUser-slice';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

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

  it('should dispatch login action on form submission', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getAllByPlaceholderText('Enter your email')[0];
    const passwordInput = screen.getAllByPlaceholderText('Enter your password')[0];
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      login({ email: 'test@example.com', password: 'password123' })
    );
  });

  it('should dispatch register action on form submission', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const dobInput = screen.getByPlaceholderText('Enter your DOB');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
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

    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'test@example.com');
    formData.append('DOB', new Date('1990-01-01T00:00:00.000Z').toISOString());
    formData.append('password', 'password123');
    formData.append('passwordConfirm', 'password123');
    formData.append('policy', 'true');

    expect(store.dispatch).toHaveBeenCalledWith(register(formData));
  });
});
