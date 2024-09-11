import HomePage from './HomePage.tsx';
import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
import { fetchDoctors } from '../../store/doctors-slice/doctors-slice';
import { renderWithProviders } from '../../_testUtils/test-helpers/renderWithContext';
import { AppStore } from '../../store/index';
import { combineReducers } from 'redux';
import currentUserReducer from '../../store/currentUser-slice/currentUser-slice';
import doctorsReducer from '../../store/doctors-slice/doctors-slice';
// Mock useEffect globally
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

const reducers = combineReducers({
  currentUser: currentUserReducer,
  doctors: doctorsReducer,
  // other reducers...
});

const fullfilledAction = {
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
      firstName: 'Aytekin',
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
  ],
};

describe('HomePage snapshot', () => {
  let store: AppStore;
  let asFragment: () => DocumentFragment;

  beforeEach(() => {
    const result = renderWithProviders(<HomePage />, {
      reducer: reducers,
    });

    store = result.store;
    asFragment = result.asFragment;
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* -------------------------- - ------------------------- */
  it('1--Renders correctly before data is fetched', async () => {
    console.log(store.getState());
    expect(asFragment()).toMatchSnapshot();
    await act(async () => {
      store.dispatch(fullfilledAction);
    });
    expect(asFragment()).toMatchSnapshot();
  });

  /* -------------------------- - ------------------------- */
  it('2--Initializes state with status "idle', () => {
    // Initial state should be 'idle'
    expect(store.getState().doctors.status).toEqual('idle');
    expect(store.getState().doctors).toEqual({
      entities: [],
      status: 'idle',
      error: null,
    });
  });
  /* -------------------------- - ------------------------- */
  it('3--Dispatches fetchEntities action and updates status loading', async () => {
    expect(store.getState().doctors.status).toEqual('idle');

    await act(async () => {
      store.dispatch(fetchDoctors('mockURL'));
    });

    expect(store.getState().doctors.status).toEqual('loading');
    console.log(store.getState().doctors.status);
  });
  /* -------------------------- - ------------------------- */
  it('3--Renders fetched data in the DOM after dispatching action', async () => {
    await act(async () => {
      store.dispatch(fullfilledAction);
    });

    // After dispatching the action, the state should be updated
    expect(store.getState().doctors).toEqual({
      entities: [
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
          firstName: 'Aytekin',
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
      ],
      status: 'succeeded',
      error: null,
    });
    expect(screen.getByText('Dr Aytekin Yaliz')).toBeInTheDocument();
    expect(screen.getByText('Allergy & Immunology')).toBeInTheDocument();
    expect(screen.getByAltText('Dr Aytekin Yaliz')).toHaveAttribute(
      'src',
      'https://patient-appointment-system.s3.eu-west-2.amazonaws.com/1721905296892-doctor.jpg'
    );
    expect(screen.getByAltText('Dr Aytekin Yaliz')).not.toHaveAttribute(
      'src',
      'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*'
    );
  });
});
