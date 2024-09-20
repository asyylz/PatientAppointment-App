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
  console.log(message);
  console.log('API Error:', error);

  switch (status) {
    case 500:
      //await forceLogout('Session expired. Please log in again.');
      toastErrorNotify(message);
      break;
    case 401:
      if (message === 'Incorrect email or password') toastErrorNotify(message);
      else await forceLogout('Session expired. Please log in again.');
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
export const forceLogout = async (message: string) => {
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
export const TOKEN_WARNING_THRESHOLD = 300000; // 5 minute before expiry
export const ALERT_AUTO_CLOSE_DELAY = 300000;

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

    // If token has already expired, log the user out and close the window
    if (tokenExpiry && tokenExpiry <= now) {
      console.log('Token has already expired.');
      await forceLogout('Session expired. Please log in again.');
      try {
        window.close(); // Attempt to close the window
      } catch (error) {
        console.error('Failed to close window:', error);
      }
      return; // Exit the function after logging out
    }

    if (timeLeft > 0 && timeLeft <= TOKEN_WARNING_THRESHOLD && !isRefreshing) {
      isRefreshing = true;

      const alertPromise = new Promise((resolve) => {
        const alertElement = document.createElement('div');
        alertElement.innerHTML = `
           <div style="position: fixed; top: 20px; right: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 10px; border-radius: 5px; z-index: 1000;">
            <p>Your session is about to expire. Would you like to extend it?</p>
            <div style="display:flex; align-items:center; margin-top:1rem">  
            <button id="extendSession" style="width:100px; height:30px;">Extend</button>
            <button id="logoutSession" style="width:100px; height:30px;">No</button>
            </div>
          </div>
        `;
        document.body.appendChild(alertElement);

        const extendButton = document.getElementById('extendSession');
        const logoutButton = document.getElementById('logoutSession');

        extendButton &&
          extendButton.addEventListener('click', () => {
            resolve(true);
            document.body.removeChild(alertElement);
          });

        logoutButton &&
          logoutButton.addEventListener('click', () => {
            resolve(false);
            document.body.removeChild(alertElement);
          });

        // Auto-close after ALERT_AUTO_CLOSE_DELAY
        setTimeout(() => {
          if (document.body.contains(alertElement)) {
            resolve(false);
            document.body.removeChild(alertElement);
          }
        }, ALERT_AUTO_CLOSE_DELAY);
      });

      const userConfirmed = await alertPromise;

      // let userConfirmed = window.confirm(
      //   'Your session is about to expire. Would you like to extend it?'
      // );
      // console.log(userConfirmed);
      if (userConfirmed) {
        isRefreshing = true;
        await store.dispatch(refreshSession());
        //console.log('Session successfully extended.');
        isRefreshing = false;
      } else {
        console.log('User declined to extend the session.');
        console.log('User did not confirm or alert auto-closed');
        await forceLogout('Session expired. Please log in again.');
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
