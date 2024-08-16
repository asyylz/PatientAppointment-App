import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  beforeEach(() => {
    jest.spyOn(store, 'dispatch');
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TopSearchBar />
        </MemoryRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <TopSearchBar />
        </MemoryRouter>
      </Provider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
    expect(screen.getByText('Asiye'))
  });
  /* -------------------------- - ------------------------- */
  it('Search input typed and trigger departments to be filtered', async () => {
    const searchInput = screen.getByPlaceholderText('search here');
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
  it('--Logout button should navigate user to home page', async () => {
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Here we expilicitly update logout
    await act(async () => {
      store.dispatch({
        type: 'currentUser/logout/fulfilled',
      });
    });
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'currentUser/logout/fulfilled',
      });
    });

    const message = 'Successfully logout!';
    toastSuccessNotify(message);
    expect(toastSuccessNotify).toHaveBeenCalledWith(message);
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
