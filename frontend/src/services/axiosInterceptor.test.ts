import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { jwtDecode } from 'jwt-decode';
import store from '../store/index/index';
import {
  performLogout,
  refreshSession,
} from '../store/currentUser-slice/currentUser-slice';
import { toastErrorNotify, toastWarnNotify } from '../helper/ToastNotify';
import {
  checkTokenExpiration,
  axiosInterceptorsWithToken,
  axiosInterceptorsWithoutToken,
  ///TOKEN_CHECK_INTERVAL,
} from './axiosInterceptors'; 

// jest.mock('redux-persist', () => {
//   const actual = jest.requireActual('redux-persist');
//   return {
//     ...actual,
//     persistReducer: jest.fn().mockImplementation((_config, reducer) => reducer),
//   };
// });

jest.mock('../store/index/index');
jest.mock('../helper/ToastNotify');
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

    it('2--Should handle 401 error', async () => {
      mockAxios.onGet('/test').reply(401, { message: 'Unauthorized' });

      await expect(axiosInterceptorsWithToken.get('/test')).rejects.toThrow();
      expect(toastWarnNotify).toHaveBeenCalledWith(
        'Session expired. Please log in again.'
      );
      //expect(performLogout).toHaveBeenCalled();
    });

    // Add more tests for other error cases (403, 404, etc.)
  });

  describe('3--CheckTokenExpiration', () => {
    it('should refresh session when token is about to expire', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      // @ts-ignore
      jwtDecode.mockReturnValue({
        exp: Math.floor(mockDate.getTime() / 1000) + 240,
      }); // 4 minutes until expiry

      global.confirm = jest.fn(() => true);

      await checkTokenExpiration();

      expect(global.confirm).toHaveBeenCalled();
      expect(refreshSession).toHaveBeenCalled();
    });

    it('should logout when user declines to extend session', async () => {
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      // @ts-ignore
      jwtDecode.mockReturnValue({
        exp: Math.floor(mockDate.getTime() / 1000) + 240,
      }); // 4 minutes until expiry

      global.confirm = jest.fn(() => false);

      await checkTokenExpiration();

      expect(global.confirm).toHaveBeenCalled();
      expect(performLogout).toHaveBeenCalled();
    });
  });

  describe('Axios instances', () => {
    it('should add Authorization header to requests with token', async () => {
      mockAxios.onGet('/test').reply(200);

      await axiosInterceptorsWithToken.get('/test');

      const request = mockAxios.history.get[0];
      expect(request.headers?.Authorization).toBe('Bearer fake-token');
    });

    it('should not add Authorization header to requests without token', async () => {
      mockAxios.onGet('/test').reply(200);

      await axiosInterceptorsWithoutToken.get('/test');

      const request = mockAxios.history.get[0];
      expect(request.headers?.Authorization).toBeUndefined();
    });
  });
});
