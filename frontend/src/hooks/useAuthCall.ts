import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { currentUserActions } from '../store/currentUser-slice';
import useAxios from './useAxios';

const useAuthCall = () => {
  const axiosWithToken = useAxios();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    dispatch(currentUserActions.logout());
    try {
      await axiosWithToken.get('http://localhost:3000/api/v1/users/logout');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return { logout };
};

export default useAuthCall;
