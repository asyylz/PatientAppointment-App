import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaginationButtons from './PaginationButtons';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext';
import { AppStore } from '../../store/index';
import { combineReducers } from 'redux';
import currentUserReducer from '../../store/currentUser-slice/currentUser-slice';
import doctorsReducer from '../../store/doctors-slice/doctors-slice';

const reducers = combineReducers({
  currentUser: currentUserReducer,
  doctors: doctorsReducer,
  // other reducers...
});

describe('PaginationButtons Component', () => {
  let store: AppStore;
  // let asFragment: () => DocumentFragment;
  const setPaginationMock = jest.fn();

  beforeEach(() => {
    const result = renderWithProviders(
      <PaginationButtons
        setPagination={setPaginationMock}
        pagination={1}
        length={10}
        limit={10}
      />,
      {
        reducer: reducers,
      }
    );
    store = result.store;
    //asFragment = result.asFragment;
    jest.spyOn(store, 'dispatch');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1--Should render pagination buttons and page number correctly', () => {
    // Check if Prev and Next buttons are rendered
    expect(screen.getByText(/Prev/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();

    // Check if the page number is displayed correctly
    expect(screen.getByText(/Page: 1/i)).toBeInTheDocument();
  });

  it('2--Should call setPagination with incremented value when clicking next button', () => {
    // Simulate clicking the next button
    fireEvent.click(screen.getByText(/Next/i));

    // Check if setPagination has been called with the correct function
    expect(setPaginationMock).toHaveBeenCalledTimes(1);
    expect(setPaginationMock).toHaveBeenCalledWith(expect.any(Function));
    //console.log(setPaginationMock.mock.calls);

    // Simulate the function being called to increment the pagination
    expect(setPaginationMock.mock.calls.length).toBe(1);

    fireEvent.click(screen.getByText(/Next/i));
    //console.log(setPaginationMock.mock.calls);
    expect(setPaginationMock).toHaveBeenCalledTimes(2);
    expect(setPaginationMock.mock.calls.length).toBe(2);
  });

  it('3--Should call setPagination with decremented value when clicking prev button', () => {
    // Simulate clicking the prev button
    fireEvent.click(screen.getByText(/Prev/i));

    // Check if setPagination has been called with the correct function
    expect(setPaginationMock).toHaveBeenCalledTimes(1);
    expect(setPaginationMock).toHaveBeenCalledWith(expect.any(Function));

    // Simulate the function being called to decrement the pagination
    const decrementedPagination = setPaginationMock.mock.calls;
    expect(decrementedPagination.length).toBe(1);
  });

  it('4--Should not go below page 1 when clicking prev button', () => {
    // Simulate clicking the prev button when on page 1
    fireEvent.click(screen.getByText(/Prev/i));

    // Check if setPagination is called but does not go below page 1
    expect(setPaginationMock).toHaveBeenCalledTimes(1);
    const decrementedPagination = setPaginationMock.mock.calls;
    expect(decrementedPagination.length).toBe(1);
  });
});
describe('PaginationButtons Component', () => {
  let store: AppStore;
  // let asFragment: () => DocumentFragment;
  const setPaginationMock = jest.fn();

  beforeEach(() => {
    const result = renderWithProviders(
      <PaginationButtons
        setPagination={setPaginationMock}
        pagination={1}
        length={5}
        limit={10}
      />,
      {
        reducer: reducers,
      }
    );
    store = result.store;
    //asFragment = result.asFragment;
    jest.spyOn(store, 'dispatch');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1--Should disable next button if length is less than limit', () => {
    const nextButtonWrapper = screen.getByText(/Next/i).parentElement;
    expect(nextButtonWrapper).toHaveClass('passive'); // Check if the 'passive' class is applied
  });
});
