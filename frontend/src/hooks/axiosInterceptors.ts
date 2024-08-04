import axios from 'axios';
import { logout, refreshSession } from '../store/currentUser-slice';
import store from '../store/index';
import Cookies from 'js-cookie';
//import { toastWarnNotify } from '../helper/ToastNotify';

let isRefreshing = false;

const axiosInterceptors = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  //timeout: 10000, // 10 seconds Set a timeout to handle slow network requests or unresponsive servers.
});

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
      if (userConfirmed) {
        isRefreshing = true;
        try {
          await store.dispatch(refreshSession());
          console.log('Session successfully extended.');
        } catch (error) {
          console.error('Failed to refresh session:', error);
          await store.dispatch(logout());
        } finally {
          isRefreshing = false;
        }
      } else {
        await store.dispatch(logout());
        console.log('asiye');
      }
    }
  }
};

// Axios interceptor for attaching token to requests
axiosInterceptors.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const currentToken = state.currentUser.token;

    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInterceptors.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    //console.log(status);
    //console.log(error);
    // console.log(error.response.data.message);
    if (
      status === 401 &&
      error.response.data.message ===
        'Your session expired. Please login again!'
    ) {
      await store.dispatch(logout());
    } else if (status === 404) {
      // Handle not found errors
    } else {
      // Handle other errors
    }

    return Promise.reject(error);
  }
);

export default axiosInterceptors;
