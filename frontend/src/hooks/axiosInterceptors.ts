import axios from 'axios';
import { logout, refreshSession } from '../store/currentUser-slice';
import store from '../store/index';
import Cookies from 'js-cookie';
//import { toastWarnNotify } from '../helper/ToastNotify';

const axiosInterceptors = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

//axiosInterceptors.defaults.withCredentials = true;

axiosInterceptors.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const currentToken = state.currentUser.token;

    if (currentToken) {
      const tokenExpiry: string | undefined = Cookies.get('jwtExpiry');
      const now = Date.now();
      const timeLeft = Number(tokenExpiry) - now;

     // console.log(timeLeft);

      if (timeLeft > 5000) {
        setTimeout(() => {
          alert(
            'Your session is about to expire. Would you like to extend it?'
          );
          // You can make an API call here to refresh the token or extend the session
          store.dispatch(refreshSession());
        }, timeLeft - 5000); // 5 seconds before expiration
      }

      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInterceptors.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    console.log(error.response);

    if (status === 401) {
      //console.log('logout');
      store.dispatch(logout());
    } else if (status === 404) {
      // Handle not found errors
    } else {
      // Handle other errors
    }

    return Promise.reject(error);
  }
);

export default axiosInterceptors;
