import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
import { combineReducers } from 'redux';
import doctorsReducer, {
  fetchDoctors,
} from '../../store/doctors-slice/doctors-slice';
import searchReducer from '../../store/search-slice/search-slice.ts';
import currentUserReducer from '../../store/currentUser-slice/currentUser-slice';
import { toContainRole } from './../../_testUtils/mocks/helper.tsx';
import DoctorsPage from './../DoctorsPage/DoctorsPage.tsx';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext.tsx';
import { AppStore } from '../../store/index/index.ts';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import * as axiosInterceptors from '../../services/axiosInterceptors.ts';
import doctors from './../../../public/test_data/doctors.json';

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
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzM2NjJmYmQ0MmE5NjZiNzVkZWM5MiIsImlhdCI6MTcyMzc1NDAzOSwiZXhwIjoxNzIzNzU1ODM5fQ.4Nmyge8591WiGN3wEijyn-9Tx7A0GCBu5w2a0CgVaQs',
  userData: {
    _id: 'mocked_id',
    name: 'Asiye',
    email: 'alice@test.com',
    role: 'patient',
    __v: 0,
    DOB: '1986-01-22T00:00:00.000Z',
    image: 'mocked_image_url',
    policy: true,
  },
  error: null,
};

const reducers = combineReducers({
  currentUser: currentUserReducer,
  doctors: doctorsReducer,
  search: searchReducer,
});

describe('Doctors Page', () => {
  let store: AppStore;
  let asFragment: () => DocumentFragment;
  //let navigate: any;
  beforeEach(() => {
    //navigate = jest.fn();
    //jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    const result = renderWithProviders(<DoctorsPage />, {
      reducer: reducers,
      preloadedState: { currentUser: initialCurrentUserState } as Partial<{
        currentUser: CurrentUser & PersistPartial;
      }>,
    });
    store = result.store;
    asFragment = result.asFragment; // asFragment() is used to create snapshots, which is the React Testing Library equivalent of toJSON().
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
    //console.log(store.getState().doctors.status);
    expect(store.getState().doctors.status).toEqual('loading');
    expect(screen.getByRole('loader'));
    expect(
      store.dispatch({
        type: 'doctors/fetch/pending',
      })
    ).toHaveBeenCalled;
  });
  describe('Test fetch doctors functionality', () => {
    let mockFn: any;
    beforeAll(() => {
      mockFn = jest.spyOn(
        axiosInterceptors.axiosInterceptorsWithoutToken,
        'get'
      );
      mockFn.mockResolvedValue({ data: { data: { doctors: doctors } } });
    });
    afterAll(() => {
      mockFn.mockRestore();
    });
    /* -------------------------- - ------------------------- */
    it('2--After rendering useEffect fetch doctors', async () => {
      await act(async () => {
        store.dispatch(fetchDoctors('mockurl'));
      });
      //console.log(store.getState().doctors.status);
      expect(store.getState().doctors.status).toEqual('succeeded');
      expect(screen.findByText('Aytekin Test'));
      const doctorsContainer = screen.getByRole('doctors-container');
      expect(doctorsContainer).toContainRole('doctor', 2);
    });
    /* -------------------------- - ------------------------- */
    it('', async () => {
      //console.log(store.getState().doctors.status);
      //screen.debug();
      await act(async () => {
        store.dispatch({
          type: 'search/setSearch',
          payload: 'Aytekin',
        });
      });

      expect(store.getState().search).toEqual('Aytekin');
      expect(screen.queryByText('Aytekin Yaliz')).toBeInTheDocument();
    });
  });

  /* -------------------------- - ------------------------- */
});
