import renderer from 'react-test-renderer';
import HomePage from './HomePage'; // Make sure this path is correct
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
// import { fetchDoctors } from '../store/doctors-slice';
import '@testing-library/jest-dom';

const mockStore = configureStore();
jest.mock('../store/doctors-slice', () => ({
  fetchDoctors: jest.fn(() => ({
    type: 'doctors/fetchDoctors/fulfilled',
    payload: {
      doctors: [],
    },
    fulfilled: {
      match: jest.fn((action) => action.type.endsWith('/fulfilled')),
    },
  })),
}));
describe('HomePage snapshot', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      currentUser: {
        status: 'idle',
      },
      doctors: {
        status: 'idle',
        entities: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            userId: { image: 'https://example.com/johndoe.jpg' },
            departmentId: { departmentMain: 'Cardiology' },
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            userId: { image: null },
            departmentId: { departmentMain: 'Neurology' },
          },
        ],
        error: null,
        selectedDoctor: null,
      },
    });
    store.dispatch = jest.fn();
  });

  it('matches the DOM snapshot', () => {
    let domTree;
    try {
      domTree = renderer
        .create(
          <Provider store={store}>
            <MemoryRouter>
              <HomePage />
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
    } catch (error) {
      console.error('Rendering error:', error);
    }
    expect(domTree).toMatchSnapshot();
  });
});
