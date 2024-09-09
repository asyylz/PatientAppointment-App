import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit/react';
import TopSearchBar from './TopSearchBar';
import searchReducer from '../../store/search-slice';
import currentUserReducer from '../../store/currentUser-slice';
import { act } from 'react';
import * as router from 'react-router-dom';
import { toastSuccessNotify } from '../../helper/ToastNotify';
import * as currentUserSlice from '../../store/currentUser-slice';
import { renderComponent } from './../../_testUtils/mocks/helper';
//import { AppDispatch } from '../../store';

jest.mock('../../helper/ToastNotify', () => ({
  toastSuccessNotify: jest.fn(),
}));
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

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
// Start store with initial state for `currentUser`
const initialCurrentUserState: CurrentUser = {
  status: 'login success',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzM2NjJmYmQ0MmE5NjZiNzVkZWM5MiIsImlhdCI6MTcyMzc1NDAzOSwiZXhwIjoxNzIzNzU1ODM5fQ.4Nmyge8591WiGN3wEijyn-9Tx7A0GCBu5w2a0CgVaQs',
  userData: {
    _id: '6673662fbd42a966b75dec92',
    name: 'Asiye',
    email: 'alice@test.com',
    role: 'patient',
    __v: 0,
    DOB: '1986-01-22T00:00:00.000Z',
    image:
      'https://patient-appointment-system.s3.eu-west-2.amazonaws.com/1722605356602-asiye%20serife.jpeg',
    policy: true,
  },
  error: null,
};

const mockAllReducers = combineReducers({
  currentUser: currentUserReducer,
  search: searchReducer,
  // other reducers...
});

const store = configureStore({
  reducer: mockAllReducers,
  preloadedState: {
    currentUser: initialCurrentUserState,
  },
});

describe('TopSearchBar Component', () => {
  const navigate = jest.fn();
 // let mockPerformLogout;

  beforeEach(() => {
    jest.spyOn(store, 'dispatch');
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    // mockPerformLogout = jest.fn().mockResolvedValue({});
    // jest
    //   .spyOn(currentUserSlice, 'performLogout')
    //   .mockImplementation(mockPerformLogout);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
    renderComponent(<TopSearchBar />, store);
    const tree = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <TopSearchBar />
        </MemoryRouter>
      </Provider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
    expect(screen.getByText('Asiye'));
    expect(screen.getByText('Logout'));
  });
  /* -------------------------- - ------------------------- */
  it('2--Search input typed and trigger departments to be filtered', async () => {
    renderComponent(<TopSearchBar />, store);
    const searchInput = screen.getByPlaceholderText('Search here');
    fireEvent.change(searchInput, { target: { value: 'Anesthesiology' } });

    expect(store.dispatch).not.toHaveBeenCalledWith({
      type: 'search/setSearch',
      payload: 'Anesthesiology',
    }); // time for debounce, so  no call yet

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'search/setSearch',
        payload: 'Anesthesiology',
      });
    });

    // Here we expilicitly update state
    await act(async () => {
      store.dispatch({
        type: 'search/setSearch',
        payload: 'Anesthesiology',
      });
    });
    expect(store.getState().search).toEqual('Anesthesiology');
  });
  /* -------------------------- - ------------------------- */
  it('3--Logout button should navigate user to home page', async () => {
    renderComponent(<TopSearchBar />, store);
  
    // Mock the performLogout action
    const mockPerformLogout = jest.fn().mockResolvedValue({ status: 'success' });
    jest.spyOn(currentUserSlice, 'performLogout').mockImplementation(() => () => mockPerformLogout());

    // Find and click the logout button
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Wait for performLogout to be called
    await waitFor(() => {
      expect(mockPerformLogout).toHaveBeenCalled();
    });

    // Check if toastSuccessNotify was called
    await waitFor(() => {
      expect(toastSuccessNotify).toHaveBeenCalledWith('Successfully logged out!');
    });

    // Check if navigate was called
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });
});
