import { renderComponent } from '../../_testUtils/mocks/helper';
import ContactPage from '../ContactPage/ContactPage';
import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import store from '../../store/index';
import { submitContactFormMock } from '../../_testUtils/mocks/mockHttp';

jest.mock('../../hooks/useHttp/useHttp.ts');

describe('ContactPage Snapshot', () => {
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
    const { asFragment } = renderComponent(<ContactPage />, store);

    // Initial snapshot
    expect(asFragment()).toMatchSnapshot();

    // Find and interact with the name input
    const name = screen.getByPlaceholderText('Name');
    expect(name).toBeInTheDocument();

    // Simulate name input typed
    fireEvent.change(name, { target: { value: 'Asiye' } });

    // Re-render and create a new snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
describe('ContactPage', () => {
  beforeEach(() => {
    renderComponent(<ContactPage />, store);
  });
  /* -------------------------- - ------------------------- */
  it('1--Should render contact form', () => {
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Subject')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Please write here...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' }));
  });
  /* -------------------------- - ------------------------- */
  it('2--Contact form fields are typed into and form submission is triggered', async () => {
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
