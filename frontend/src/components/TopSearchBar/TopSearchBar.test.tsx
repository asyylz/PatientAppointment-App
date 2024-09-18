import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { combineReducers } from 'redux';
import TopSearchBar from '../TopSearchBar/TopSearchBar.tsx';
import searchReducer from '../../store/search-slice/search-slice';
import currentUserReducer from '../../store/currentUser-slice/currentUser-slice';
//import * as router from 'react-router-dom';
import * as currentUserSlice from '../../store/currentUser-slice/currentUser-slice';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { AppStore } from '../../store/index';


jest.mock('../../helper/ToastNotify', () => ({
  toastSuccessNotify: jest.fn(),
}));
jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn().mockImplementation((_config, reducer) => reducer),
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

const reducers = combineReducers({
  currentUser: currentUserReducer,
  search: searchReducer,
  // other reducers...
});

describe('TopSearchBar Component', () => {
 // const navigate = jest.fn();
  let store: AppStore;
  let asFragment: () => DocumentFragment;

  beforeEach(() => {
    //jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    const result = renderWithProviders(<TopSearchBar />, {
      reducer: reducers,
      preloadedState: { currentUser: initialCurrentUserState } as Partial<{
        currentUser: CurrentUser & PersistPartial;
      }>,
    });

    store = result.store;
    asFragment = result.asFragment;
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
    //jest.restoreAllMocks();
  });
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Asiye')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
  /* -------------------------- - ------------------------- */
  it('2--Search input typed and trigger departments to be filtered', async () => {
    const searchInput = screen.getByPlaceholderText('Search here');
    fireEvent.change(searchInput, { target: { value: 'Anesthesiology' } });

    expect(store.dispatch).not.toHaveBeenCalledWith({
      type: 'search/setSearch',
      payload: 'Anesthesiology',
    }); // time for debounce, so  no call yet

    // Here we expilicitly update state
    await act(async () => {
      store.dispatch({
        type: 'search/setSearch',
        payload: 'Anesthesiology',
      });
    });
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'search/setSearch',
        payload: 'Anesthesiology',
      });
    });
    expect(store.getState().search).toEqual('Anesthesiology');
  });
  /* -------------------------- - ------------------------- */
  it('3--Logout button should navigate user to home page', async () => {
    // Mock the performLogout action
    const mockPerformLogout = jest
      .fn()
      .mockResolvedValue({ status: 'success' });
    jest
      .spyOn(currentUserSlice, 'performLogout')
      .mockImplementation(() => () => mockPerformLogout());

    // Find and click the logout button
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Wait for performLogout to be called
    await waitFor(() => {
      expect(mockPerformLogout).toHaveBeenCalled();
    });
  });
});
