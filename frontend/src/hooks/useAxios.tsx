import axios from 'axios';
import { useSelector } from 'react-redux';

const useAxios = () => {
  const {
    entities: { token, currentUser },
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

  console.log(currentUser);

  const axiosWithToken = axios.create({
    baseURL: import.meta.env.BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
  return axiosWithToken;
};

export default useAxios;
