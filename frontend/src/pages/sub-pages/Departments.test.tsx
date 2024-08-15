import renderer from 'react-test-renderer';
import { act } from 'react';
import '@testing-library/jest-dom';
import { render, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers } from 'redux';
import deparmentsReducer from '../../store/departments-slice';
import { configureStore } from '@reduxjs/toolkit/react';
//import * as router from 'react-router-dom';
import Departments from './Departments';
import searchReducer from '../../store/search-slice';

const mockAllReducers = combineReducers({
  departments: deparmentsReducer,
  search: searchReducer,
  // other reducers...
});

const store = configureStore({
  reducer: mockAllReducers,
});

console.log(store.getState());
describe('Departments Page', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Departments />
        </MemoryRouter>
      </Provider>
    );
  });
  /* -------------------------- - ------------------------- */
  it('1--Matches the DOM snapshot', () => {
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
    console.log(store.getState().departments.status);
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
    console.log(store.getState().departments.status);
  });

  /* -------------------------- - ------------------------- */
  it('fetchDepartments action fulfilled and screen expect  related data', async () => {
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
    expect(screen.getAllByText('Allergy & Immunology')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Anesthesiology')[0]).toBeInTheDocument();
  });
  /* -------------------------- - ------------------------- */
  it('fetchDepartments action rejected and screen expect error message', async () => {
    await act(async () => {
      store.dispatch({
        type: 'departments/fetch/rejected',
        error: new Error('Network Error'),
      });
    });
    expect(store.getState().departments.status).toEqual('failed');
    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });
  /* -------------------------- - ------------------------- */
  it('fetchDepartments action rejected and screen expect error message comes from payload', async () => {
    await act(async () => {
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
