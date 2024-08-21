import {
  checkTokenExpiration,
  TOKEN_CHECK_INTERVAL,
} from '../hooks/axiosInterceptors';

// Global variable to hold the interval ID
let intervalId: NodeJS.Timeout | null = null;

const startTokenCheckInterval = () => {
  // Clear existing interval if it exists
  if (intervalId) {
    clearInterval(intervalId);
    console.log('Cleared existing interval with ID:', intervalId);
  }

  // Start a new interval
  intervalId = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
  console.log('Set new interval with ID:', intervalId);
};

const stopTokenCheckInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('Stopped interval with ID:', intervalId);
    intervalId = null; // Ensure to nullify the interval ID
  }
};

export { startTokenCheckInterval, stopTokenCheckInterval };
