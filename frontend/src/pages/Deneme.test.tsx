import { combineReducers } from '@reduxjs/toolkit';
import currentUserReducer from './../store/currentUser-slice';
import doctorsReducer from './../store/doctors-slice';
import searchReducer from './../store/search-slice';

jest.mock('./../store/index', () => {
  const actualStore = jest.requireActual('./../store/index');
  const mockStore = {
    getState: jest.fn(() => ({
      currentUser: {
        status: 'login success',
        // other state
      },
      doctors: {
        status: 'idle',
        // other state
      },
      search: '',
    })),
    dispatch: jest.fn(),
    replaceReducer: jest.fn(),
    subscribe: jest.fn(),
  };

  const allReducers = combineReducers({
    currentUser: currentUserReducer,
    doctors: doctorsReducer,
    search: searchReducer,
  });

  return {
    ...actualStore,
    store: mockStore,
    allReducers,
  };
});

describe('Test Store Mock', () => {
  it('should log currentUser state', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const store = require('./../store/index').store;
    console.log(store.getState().currentUser);
    expect(store.getState).toHaveBeenCalled();
  });
});
