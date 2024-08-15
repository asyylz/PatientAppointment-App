import renderer from 'react-test-renderer';
import ContactPage from './ContactPage';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import store from './../store/index';
import { submitContactFormMock } from './../_testUtils/mocks/mockHttp';

jest.mock('./../hooks/useHttp');

describe('ContactPage', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </Provider>
    );
  });
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
    let domTree;
    try {
      domTree = renderer
        .create(
          <Provider store={store}>
            <MemoryRouter>
              <ContactPage />
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
    } catch (error) {
      console.error('Rendering error:', error);
    }

    expect(domTree).toMatchSnapshot();
  });
  /* -------------------------- - ------------------------- */
  it('2--Should render contact form', () => {
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Subject')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Please write here...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' }));
  });
  /* -------------------------- - ------------------------- */
  it('3--Contact form fields are typed into and form submission is triggered', async () => {
    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const subjectInput = screen.getByPlaceholderText('Subject');
    const messageInput = screen.getByPlaceholderText('Please write here...');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(nameInput, { target: { value: 'Alice' } });
    fireEvent.change(emailInput, { target: { value: 'alice@test.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Subject Test' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);
    expect(submitContactFormMock).toHaveBeenCalledTimes(1);
    expect(submitContactFormMock).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@test.com',
      subject: 'Subject Test',
      message: 'Test message',
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toHaveValue('');
      expect(screen.getByPlaceholderText('Email')).toHaveValue('');
      expect(screen.getByPlaceholderText('Subject')).toHaveValue('');
      expect(screen.getByPlaceholderText('Please write here...')).toHaveValue(
        ''
      );
    });
  });
  /* -------------------------- - ------------------------- */
  it('3--Contact form fields are typed but canceled not to submit', async () => {
    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const subjectInput = screen.getByPlaceholderText('Subject');
    const messageInput = screen.getByPlaceholderText('Please write here...');
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    fireEvent.change(nameInput, { target: { value: 'Alice' } });
    fireEvent.change(emailInput, { target: { value: 'alice@test.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Subject Test' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toHaveValue('');
      expect(screen.getByPlaceholderText('Email')).toHaveValue('');
      expect(screen.getByPlaceholderText('Subject')).toHaveValue('');
      expect(screen.getByPlaceholderText('Please write here...')).toHaveValue(
        ''
      );
    });
  });
});
