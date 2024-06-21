import axios from 'axios';
import { useSelector } from 'react-redux';

const useAxios = () => {
  const {
    entities = { token: null, data: null },
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

  const axiosWithToken = axios.create({
    baseURL: import.meta.env.BASE_URL,
    headers: { Authorization: `Bearer ${entities?.token}` },
  });
  return axiosWithToken;
};

export default useAxios;
