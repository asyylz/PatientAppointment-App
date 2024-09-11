import renderer from 'react-test-renderer';
import { act } from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers } from 'redux';
import doctorsReducer from '../../store/doctors-slice/doctors-slice';
import { configureStore } from '@reduxjs/toolkit/react';
import searchReducer from '../../store/search-slice/search-slice.ts';
import {
  toContainRole,
  renderComponent,
} from './../../_testUtils/mocks/helper.tsx';

import DoctorsPage from './../DoctorsPage/DoctorsPage.tsx';

expect.extend({ toContainRole });

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

const mockAllReducers = combineReducers({
  doctors: doctorsReducer,
  search: searchReducer,
  currentUser: jest.fn(() => {
    return {
      ...initialCurrentUserState,
      // other state
    };
  }),
  // other reducers...
});

const store = configureStore({
  reducer: mockAllReducers,
});

describe('Doctors Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <DoctorsPage />
        </MemoryRouter>
      </Provider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  /* -------------------------- - ------------------------- */
  it('2--After rendering useEffect fetch doctors', async () => {
    renderComponent(
      <>
        <DoctorsPage />
      </>,
      store
    );

    expect(store.getState().doctors.status).toEqual('loading');
    // console.log(store.getState().doctors.status);
    expect(screen.getByRole('loader'));

    expect(
      store.dispatch({
        type: 'doctors/fetch/pending',
      })
    ).toHaveBeenCalled;

    expect(store.getState().doctors.status).toEqual('loading');
    console.log(store.getState().doctors.status);

    await act(async () => {
      store.dispatch({
        type: 'doctors/fetch/fulfilled',
        payload: [
          {
            _id: '665f0f2959c971659af920e5',
            gender: 'F',
            image: '/img/doctors/drmathai_small.jpg',
            phone: '647-722-2370',
            address: {
              street: '390 Steeles Avenue West',
              city: 'Vaughan',
              prov: 'ON',
              postal: 'L4J',
              _id: '665f0f2959c971659af920e7',
            },
            firstName: 'Aytekin Test',
            lastName: 'Yaliz',
            departmentId: {
              _id: '6660fbd12e3c00fe18cfceec',
              departmentMain: 'Allergy & Immunology',
            },
            userId: {
              _id: '666c1f10ad015e6df17a98e4',
              image:
                'https://patient-appointment-system.s3.eu-west-2.amazonaws.com/1721905296892-doctor.jpg',
            },
            reviews: [],
          },
          {
            _id: '665f0f2959c971659af920ca',
            id: 1,
            gender: 'M',
            image: '/img/doctors/chan_small.jpg',
            phone: '416-486-1956',
            address: {
              street: '473 Dupont Street',
              city: 'Toronto',
              prov: 'ON',
              postal: 'M6G 1Y6',
              _id: '665f0f2959c971659af920cc',
            },
            firstName: 'Bowen Test',
            lastName: 'Chan',
            departmentId: {
              _id: '6660fbd12e3c00fe18cfceef',
              departmentMain: 'Pediatrics',
            },
            doctorDescription:
              'Dr. Bowen Chan is board-certified in Pediatric Endocrinology and specializes in the diagnosis and management of hormonal disorders in children and adolescents. His areas of expertise include diabetes mellitus, growth disorders, and thyroid conditions.',
            reviews: [],
          },
        ],
      });
    });

    expect(store.getState().doctors.status).toEqual('succeeded');
    expect(screen.findByText('Aytekin Test'));
    const doctorsContainer = screen.getByRole('doctors-container');
    expect(doctorsContainer).toContainRole('doctor', 2);
    //const doctorprofilCards = screen.getAllByRole('doctor');
    //const link = within(doctorprofilCards[0]).getByRole('link');
  });

  /* -------------------------- - ------------------------- */
  it('--clicking make appointment link button should select doctor', async () => {
    // const doctorprofilCards = await screen.findAllByRole('doctor');
    // const link = within(doctorprofilCards[0]).getByRole('link');
    // console.log(link)
  });

  /* -------------------------- - ------------------------- */
  it('--Search term typed and doctors being filtered', async () => {
    renderComponent(
      <>
        <DoctorsPage />
      </>,
      store
    );

    console.log(store.getState().doctors.status); //succeeded
    //screen.debug();
    await act(async () => {
      store.dispatch({
        type: 'search/setSearch',
        payload: 'Aytekin',
      });
    });
  });
});
