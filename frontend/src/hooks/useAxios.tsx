import axios from 'axios';
import { useSelector } from 'react-redux';

const useAxios = () => {
  const { token } = useSelector((state: RootState) => state.currentUser);
 
  const axiosWithToken = axios.create({
    //baseURL: import.meta.env.BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
  return axiosWithToken;
};

export default useAxios;
