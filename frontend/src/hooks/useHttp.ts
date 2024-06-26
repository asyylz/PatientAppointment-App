import { AxiosError } from 'axios';
import { toastErrorNotify } from '../helper/ToastNotify';
import useAxios from './useAxios';

const useHttp = () => {
  const axiosWithToken = useAxios();

  const createAppointment = async (data: Appointment) => {
    console.log(data);
    try {
      await axiosWithToken.post(
        'http://localhost:3000/api/v1/appointments',
        data
      );
    } catch (error: AxiosError) {
      const fieldName = Object.keys(error.response.data.message)[0];
      toastErrorNotify(`${error.response.data.message[fieldName].message}`);
    }
  };

  return { createAppointment };
};

export default useHttp;
