import HomePage from '../Homepage/HomePage'; // Make sure this path is correct
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import store from '../../store/index';
import { render, act, screen } from '@testing-library/react';

describe('HomePage snapshot', () => {
  afterEach(() => {
    jest.useRealTimers(); // Restore real timers after each test
  });

  /* -------------------------- - ------------------------- */
  it('7--Should update currentImageIndex class every 3 seconds', () => {
    jest.useFakeTimers(); // Enable fake timers

    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

    // Initially, the image should have the class corresponding to index 0
    expect(screen.getByTestId('current-image')).toHaveClass(
      'galeria__image galeria__image--one galeria__image--fade'
    );

    // Advance time by 3 seconds (3000ms)
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Check the current image class
    console.log(
      'After 3 seconds:',
      screen.getByTestId('current-image').className
    ); // this consoles galeria__image--one still

    // Now, the class should correspond to index 1
    expect(screen.getByTestId('current-image')).toHaveClass(
      'galeria__image galeria__image--two galeria__image--fade'
    );

    // Advance time by 3 seconds (3000ms)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // Now, the class should correspond to index 2
    expect(screen.getByTestId('current-image')).toHaveClass(
      'galeria__image galeria__image--three galeria__image--fade'
    );

    // Advance time by 3 seconds (3000ms)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // Now, the class should correspond to index 3
    expect(screen.getByTestId('current-image')).toHaveClass(
      'galeria__image galeria__image--four galeria__image--fade'
    );

    // Check the current image class
    console.log(
      'After 3 seconds:',
      screen.getByTestId('current-image').className
    ); // this consoles galeria__image--one still
    // Advance time by 3 seconds (3000ms)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // Now, the class should correspond to index 4
    expect(screen.getByTestId('current-image')).toHaveClass(
      'galeria__image galeria__image--five galeria__image--fade'
    );

    // Clean up by unmounting the component
    unmount();

    // Restore original timers
    jest.useRealTimers();
    console.log('asiye');
  });
});
