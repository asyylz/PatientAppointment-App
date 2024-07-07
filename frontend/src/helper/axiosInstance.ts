import axios, { AxiosInstance } from 'axios';
import store from './../store/index'; // Adjust the path to your store file

export const createAxiosInstance = (): AxiosInstance => {
  const { token } = store.getState().currentUser;
  console.log(token);
  console.log('asiye')

  return axios.create({
    baseURL: import.meta.env.BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};
