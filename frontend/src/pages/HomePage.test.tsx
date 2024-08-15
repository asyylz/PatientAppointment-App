import renderer from 'react-test-renderer';
import HomePage from './HomePage'; // Make sure this path is correct
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import store from '../store/index';
import { render, act, screen } from '@testing-library/react';
import { fetchDoctors } from '../store/doctors-slice';

// Mock useEffect globally
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

describe('HomePage snapshot', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /* -------------------------- - ------------------------- */
  it('1--Renders correctly before data is fetched', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  /* -------------------------- - ------------------------- */
  it('2--Initializes state with status "idle', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );
    // Initial state should be 'idle'
    expect(store.getState().doctors.status).toEqual('idle');
    expect(store.getState().doctors).toEqual({
      entities: [],
      status: 'idle',
      error: null,
      _persist: { version: -1, rehydrated: true },
    });
  });
  /* -------------------------- - ------------------------- */
  it('3--Dispatches fetchEntities action and updates state with the action payload', async () => {
    expect(store.getState().doctors.status).toEqual('idle');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      store.dispatch(fetchDoctors('mockURL'));
    });

    expect(store.getState().doctors.status).toEqual('loading');
    //console.log(store.getState().doctors.status);

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

    await act(async () => {
      store.dispatch(fullfilledAction);
    });
    //console.log(store.getState().doctors.status);
    //console.log(store.getState().doctors.entities);
  });
  /* -------------------------- - ------------------------- */
  it('4--Renders fetched data in the DOM after dispatching action', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

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
      _persist: { version: -1, rehydrated: true },
    });
  });
  /* -------------------------- - ------------------------- */
  it('5--Displays doctors correctly after data is successfully fetched', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  /* -------------------------- - ------------------------- */
  it('6--Displays doctor name and department', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );
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
