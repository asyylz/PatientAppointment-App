import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import {
  performLogout,
  refreshSession,
} from '../store/currentUser-slice/currentUser-slice';
import store from '../store/index/index';
import { jwtDecode } from 'jwt-decode';
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
      //await forceLogout('Session expired. Please log in again.');
      toastErrorNotify(message);
      break;
    case 401:
      //toastErrorNotify(message)
      await forceLogout('Session expired. Please log in again.');
      break;
    case 403:
      toastErrorNotify('You do not have permission to perform this action.');
      break;
    case 404:
      toastErrorNotify(message);
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

export const TOKEN_CHECK_INTERVAL = 20000; // Check every 20 seconds
const TOKEN_WARNING_THRESHOLD = 300000; // 5 minute before expiry

export const checkTokenExpiration = async () => {
  const currentToken = store.getState().currentUser.token;

  if (currentToken) {
    const decoded = jwtDecode(currentToken);
    const now = Date.now();
    let tokenExpiry;
    if (decoded.exp) {
      tokenExpiry = decoded.exp * 1000;
    }
    const timeLeft = Number(tokenExpiry) - now;

    console.log(`Token expiry from cookie: ${tokenExpiry}`);
    console.log(`Time left for token expiry: ${timeLeft}ms`);
    console.log(`Is Refreshing: ${isRefreshing}`);

    if (timeLeft > 0 && timeLeft <= TOKEN_WARNING_THRESHOLD && !isRefreshing) {
      const userConfirmed = window.confirm(
        'Your session is about to expire. Would you like to extend it?'
      );
      console.log(userConfirmed);
      if (userConfirmed) {
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
