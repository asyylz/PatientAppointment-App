import { act } from 'react';
import '@testing-library/jest-dom';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import { combineReducers } from 'redux';
import deparmentsReducer, {
  fetchDepartments,
} from '../../store/departments-slice/departments-slice';
import Departments from './Departments';
import searchReducer from '../../store/search-slice/search-slice';
import currentUserReducer from '../../store/currentUser-slice/currentUser-slice';
import { toContainRole } from './../../_testUtils/mocks/helper.tsx';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext.tsx';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { AppStore } from '../../store/index/index.ts';
import * as axiosInterceptors from '../../services/axiosInterceptors.ts';
import departments from './../../../public/test_data/departments.json';
import TopSearchBar from '../../components/TopSearchBar/TopSearchBar.tsx';
expect.extend({ toContainRole });

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn().mockImplementation((_config, reducer) => reducer),
  };
});

// Start store with initial state for `currentUser`
const initialCurrentUserState: CurrentUser = {
  status: 'login success',
  token: 'mockToken',
  userData: {
    _id: '6673662fbd42a966b75dec92',
    name: 'Asiye',
    email: 'alice@test.com',
    role: 'patient',
    __v: 0,
    DOB: '1986-01-22T00:00:00.000Z',
    image: 'mockImgUrl',
    policy: true,
  },
  error: null,
};

const reducers = combineReducers({
  currentUser: currentUserReducer,
  departments: deparmentsReducer,
  search: searchReducer,
});
describe('Departments Page', () => {
  let store: AppStore;
  let asFragment: () => DocumentFragment;

  beforeEach(() => {
    const result = renderWithProviders(
      <>
        <TopSearchBar />
        <Departments />
      </>,
      {
        reducer: reducers,
        preloadedState: { currentUser: initialCurrentUserState } as Partial<{
          currentUser: CurrentUser & PersistPartial;
        }>,
      }
    );
    store = result.store;
    asFragment = result.asFragment;
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', async () => {
    expect(asFragment()).toMatchSnapshot();
    expect(store.getState().departments.status).toEqual('loading');
    expect(
      store.dispatch({
        type: 'departments/fetch/pending',
      })
    ).toHaveBeenCalled;
    await waitFor(() => {
      expect(screen.getByText('Departments loading...'));
    });
  });

  describe('', () => {
    let mockFn: any;
    beforeAll(() => {
      mockFn = jest.spyOn(
        axiosInterceptors.axiosInterceptorsWithoutToken,
        'get'
      );
      mockFn.mockResolvedValue({
        data: { data: { departments: departments } },
      });
    });
    afterAll(() => {
      mockFn.mockRestore();
    });
    /* -------------------------- - ------------------------- */
    it('2--Should fetch departments and filter departments', async () => {
      await act(async () => {
        store.dispatch(fetchDepartments('mockurlForDepartments'));
      });
      console.log(store.getState().departments.status);
      expect(store.getState().departments.status).toEqual('succeeded');
      const departmentsContainer = screen.getByRole('departments-container');
      expect(departmentsContainer).toContainRole('department', 3);
      expect(asFragment()).toMatchSnapshot();

      const searchInput = screen.getByPlaceholderText('Search here');
      fireEvent.change(searchInput, { target: { value: 'Anesthesiology' } });
      await waitFor(() => {
        expect(screen.getAllByText('Anesthesiology')[0]).toBeInTheDocument();
      });
    });
  });

  /* -------------------------- - ------------------------- */
  it('3--fetchDepartments action rejected and screen expect error message', async () => {
    console.log(store.getState().departments.status);
    await act(async () => {
      store.dispatch({
        type: 'departments/fetch/rejected',
        error: { message: 'Network Error' },
      });
    });
    expect(store.getState().departments.status).toEqual('failed');
    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });
  /* -------------------------- - ------------------------- */
  it('4--fetchDepartments action rejected and screen expect error message comes from payload', async () => {
    act(() => {
      console.log(store.getState().departments.status);
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
