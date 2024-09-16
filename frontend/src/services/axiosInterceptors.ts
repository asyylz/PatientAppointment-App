import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import {
  performLogout,
  refreshSession,
} from '../store/currentUser-slice/currentUser-slice';
import store from '../store/index/index';
import Cookies from 'js-cookie';
import { toastErrorNotify, toastWarnNotify } from '../helper/ToastNotify';
import { ErrorResponse } from 'react-router-dom';

/* ------------------------------------------------------ */
/*                     ERROR HANDLING                     */
/* ------------------------------------------------------ */
// Centralized error management for both instances
const handleErrorResponse = async (error: AxiosError<ErrorResponse> | any) => {
  const status = error.response?.status;

  const message =
    error.response?.data?.message || 'An unexpected error occurred';

  console.error('API Error:', error);

  switch (status) {
    case 500:
      await forceLogout('Session expired. Please log in again.');
      break;
    case 401:
      await forceLogout('Session expired. Please log in again.');
      break;
    case 403:
      toastErrorNotify('You do not have permission to perform this action.');
      break;
    case 404:
      toastErrorNotify('Resource not found!');
      break;
    default:
      toastErrorNotify(message);
  }

  return Promise.reject(error);
};

// Force logout function
const forceLogout = async (message: string) => {
  toastWarnNotify(message);
  await store.dispatch(performLogout());
  // Redirect to login page
  window.location.href = '/';
};

/* ------------------------------------------------------ */
/*                       TOKEN CHECK                      */
/* ------------------------------------------------------ */
let isRefreshing = false;

export const TOKEN_CHECK_INTERVAL = 10000; // Check every 10 seconds
const TOKEN_WARNING_THRESHOLD = 60000; // 1 minute before expiry

export const checkTokenExpiration = async () => {
  const currentToken = store.getState().currentUser.token;

  if (currentToken) {
    const tokenExpiry = Cookies.get('jwtExpiry');
    const now = Date.now();
    const timeLeft = Number(tokenExpiry) - now;
    console.log(timeLeft);

    console.log(`Token expiry from cookie: ${tokenExpiry}`);
    console.log(`Time left for token expiry: ${timeLeft}ms`);
    console.log(`Is Refreshing: ${isRefreshing}`);

    if (timeLeft > 0 && timeLeft <= TOKEN_WARNING_THRESHOLD && !isRefreshing) {
      const userConfirmed = window.confirm(
        'Your session is about to expire. Would you like to extend it?'
      );
      console.log(userConfirmed);
      if (userConfirmed) {
        console.log('asiye');
        isRefreshing = true;
        await store.dispatch(refreshSession());
        //console.log('Session successfully extended.');
        isRefreshing = false;
      } else {
        console.log('from user not confirm');
        await store.dispatch(performLogout());
      }
    }
  }
};

/* ------------------------------------------------------ */
/*                       WITH TOKEN                       */
/* ------------------------------------------------------ */

const createAxiosInstanceWithToken = (): AxiosInstance => {
  const instance = axios.create({
    //baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = store.getState().currentUser.token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    handleErrorResponse
  );

  return instance;
};

/* ------------------------------------------------------ */
/*                      WITHOUT TOKEN                     */
/* ------------------------------------------------------ */
// Create Axios instance without token
const createAxiosInstanceWithoutToken = (): AxiosInstance => {
  const instance = axios.create({
    //baseURL: URL,
    withCredentials: true,
    timeout: 10000,
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    handleErrorResponse
  );

  return instance;
};

const axiosInterceptorsWithoutToken = createAxiosInstanceWithoutToken();
const axiosInterceptorsWithToken = createAxiosInstanceWithToken();
export { axiosInterceptorsWithToken, axiosInterceptorsWithoutToken };
