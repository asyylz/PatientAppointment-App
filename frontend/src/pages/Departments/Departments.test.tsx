import renderer from 'react-test-renderer';
import { act } from 'react';
import '@testing-library/jest-dom';
import { waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers } from 'redux';
import deparmentsReducer from '../../store/departments-slice/departments-slice';
import { configureStore } from '@reduxjs/toolkit/react';
import Departments from './Departments';
import searchReducer from '../../store/search-slice/search-slice';
import currentUserReducer from '../../store/currentUser-slice/currentUser-slice';
import {
  toContainRole,
  renderComponent,
} from './../../_testUtils/mocks/helper.tsx';

expect.extend({ toContainRole });
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
  departments: deparmentsReducer,
  search: searchReducer,
  // other reducers...
});

const store = configureStore({
  reducer: mockAllReducers,
  preloadedState: {
    currentUser: initialCurrentUserState,
  },
});

describe('Departments Page', () => {
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
    //renderComponent(<Departments />, store);
    const tree = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <Departments />
        </MemoryRouter>
      </Provider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  /* -------------------------- - ------------------------- */
  it('2--After rendering useEffect fetch departments with status "loading', async () => {
    renderComponent(<Departments />, store);
    expect(store.getState().departments.status).toEqual('loading');

    expect(
      store.dispatch({
        type: 'departments/fetch/pending',
      })
    ).toHaveBeenCalled;
    expect(store.getState().departments.status).toEqual('loading');
    await waitFor(() => {
      expect(screen.getByText('Departments loading...'));
    });
  });

  /* -------------------------- - ------------------------- */
  it('3--fetchDepartments action fulfilled and screen expect  related data', async () => {
    renderComponent(<Departments />, store);
    await act(async () => {
      store.dispatch({
        type: 'departments/fetch/fulfilled',
        payload: [
          {
            _id: '6660fbd12e3c00fe18cfceec',
            departmentMain: 'Allergy & Immunology',
            departmentSub: [
              'Allergy',
              'Allergy & Immunology',
              'Immunology',
              'Immunopathology',
              'Pediatric Allergy',
            ],
          },
          {
            _id: '6660fbd12e3c00fe18cfceed',
            departmentMain: 'Anesthesiology',
            departmentSub: [
              'Anesthesiology',
              'Critical Care Anesthesiology',
              'Critical Care Medicine',
              'Pain Management',
            ],
          },
        ],
      });
    });
    expect(store.getState().departments.status).toEqual('succeeded');

    const departmentsContainer = screen.getByRole('departments-container');
    expect(departmentsContainer).toContainRole('department', 2);
  });
  /* -------------------------- - ------------------------- */
  it('After departments being fetched data should be in the snapshot', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <Departments />
        </MemoryRouter>
      </Provider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  /* -------------------------- - ------------------------- */
  it('fetchDepartments action rejected and screen expect error message', async () => {
    renderComponent(<Departments />, store);
    await act(async () => {
      store.dispatch({
        type: 'departments/fetch/rejected',
        error: { message: 'Network Error' },
      });
    });
    console.log(store.getState().departments.error);
    expect(store.getState().departments.status).toEqual('failed');
    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });
  /* -------------------------- - ------------------------- */
  it('fetchDepartments action rejected and screen expect error message comes from payload', async () => {
    renderComponent(<Departments />, store);

    act(() => {
      store.dispatch({
        type: 'departments/fetch/rejected',
        payload: {
          message: 'Payload error',
        },
      });
    });
    expect(store.getState().departments.status).toEqual('failed');
    expect(screen.getByText('Payload error')).toBeInTheDocument();
  });
});
