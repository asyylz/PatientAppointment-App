import axios from 'axios';
import { logout, refreshSession } from '../store/currentUser-slice';
import store from '../store/index';
import Cookies from 'js-cookie';
import { toastErrorNotify } from '../helper/ToastNotify';

/* ------------------------------------------------------ */
/*                     ERROR HANDLING                     */
/* ------------------------------------------------------ */
// Centralized error management for both instances
const handleErrorResponse = async (error: any) => {
  const status = error.response ? error.response.status : null;
  console.log(error.response.data.message);
  const message =
    error.response?.data?.message || 'An unexpected error occurred';

  if (status === 401) {
    await store.dispatch(logout());
    toastErrorNotify(error.response.data.message); // wrong logi credentials
  } else if (status === 404) {
    toastErrorNotify('Resource not found!');
  } else {
    toastErrorNotify(message);
  }

  return Promise.reject(error);
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
        await store.dispatch(logout());
        console.log('asiye');
      }
    }
  }
};

/* ------------------------------------------------------ */
/*                       WITH TOKEN                       */
/* ------------------------------------------------------ */

const axiosInterceptorsWithToken = axios.create({
  //baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  //timeout: 10000, // 10 seconds Set a timeout to handle slow network requests or unresponsive servers.
});
// Axios interceptor for attaching token to requests
axiosInterceptorsWithToken.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const currentToken = state.currentUser.token;
    console.log(currentToken);
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInterceptorsWithToken.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : 500;
    console.log(status);
    console.log(error);
    console.log(error.response.data.message);
    toastErrorNotify(error.response.data.message);
    handleErrorResponse;

    // if (
    //   (status === 401 &&
    //     error.response.data.message ===
    //       'Your session expired. Please login again!') ||
    //   (status === 500 && error.response.data.message === 'jwt expired')
    // ) {
    //   await store.dispatch(logout());
    //   console.log('aaa');
    //   toastErrorNotify('Your session expired. Please login again!');
    // } else if (status === 404) {
    //   // Handle not found errors
    // } else if (status === 401) {
    //   toastErrorNotify(error.response.data.message);
    //   console.log(error.response.data.message);
    // } else {
    //   toastErrorNotify(error.response.data.message); // status 400
    // }

    return Promise.reject(error);
  }
);

/* ------------------------------------------------------ */
/*                      WITHOUT TOKEN                     */
/* ------------------------------------------------------ */
const axiosInterceptorsWithoutToken = axios.create({
  //baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// Adding response interceptor for axiosInterceptorsWithoutToken
axiosInterceptorsWithoutToken.interceptors.response.use(
  (response) => response,
  handleErrorResponse
);

export { axiosInterceptorsWithToken, axiosInterceptorsWithoutToken };
