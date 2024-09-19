import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
//import { jwtDecode } from 'jwt-decode';
import store from '../store/index/index';
// import {
//   performLogout,
//   refreshSession,
// } from '../store/currentUser-slice/currentUser-slice';
import { toastErrorNotify } from '../helper/ToastNotify';

import {
  //checkTokenExpiration,
  axiosInterceptorsWithToken,
  // axiosInterceptorsWithoutToken,
  ///TOKEN_CHECK_INTERVAL,
} from './axiosInterceptors';

jest.mock('../store/index/index');
jest.mock('../helper/ToastNotify', () => ({
  toastErrorNotify: jest.fn(),
  toastWarnNotify: jest.fn(),
}));
jest.mock('jwt-decode');

describe('Axios Interceptor', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    jest.clearAllMocks();
    // @ts-ignore
    store.getState.mockReturnValue({ currentUser: { token: 'fake-token' } });
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe('handleErrorResponse', () => {
    it('1--Should handle 500 error', async () => {
      mockAxios
        .onGet('/test')
        .reply(500, { message: 'An unexpected error occurred' });

      await expect(axiosInterceptorsWithToken.get('/test')).rejects.toThrow();
      expect(toastErrorNotify).toHaveBeenCalledWith(
        'An unexpected error occurred'
      );
    });
  });
});
