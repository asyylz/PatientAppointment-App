import { AxiosError } from 'axios';
import { toastErrorNotify, toastSuccessNotify } from '../helper/ToastNotify';

import useAxios from './useAxios';

const useHttp = () => {
  const axiosWithToken = useAxios();

  const createAppointment = async (data: AppointmentForBooking) => {
    try {
      const response = await axiosWithToken.post(
        'http://localhost:3000/api/v1/appointments',
        data
      );
      toastSuccessNotify('Your appointment successfully placed');
      return response.data;
    } catch (error: AxiosError) {
      const fieldName = Object.keys(error.response.data.message)[0];

      if (error.response.data.message[fieldName].message) {
        toastErrorNotify(`${error.response.data.message[fieldName].message}`);
      } else {
        toastErrorNotify(error.response.data.message);
      }
    }
  };

  const updateAppointment = async (
    data: object | undefined,
    id: ObjectId | undefined
  ) => {
    console.log(data);
    console.log(id);

    try {
      const response = await axiosWithToken.patch(
        `http://localhost:3000/api/v1/appointments/${id}`,
        data
      );
      toastSuccessNotify('Your appointment successfully updated');
      return response.data;
    } catch (error: AxiosError) {
      const fieldName = Object.keys(error.response.data.message)[0];
      toastErrorNotify(`${error.response.data.message[fieldName].message}`);
    }
  };

  const deleteAppointment = async (id: ObjectId | undefined) => {
    console.log(id);

    try {
      const response = await axiosWithToken.delete(
        `http://localhost:3000/api/v1/appointments/${id}`
      );
      toastSuccessNotify('Your appointment successfully deleted.');
      return response;
    } catch (error: AxiosError) {
      console.log(error);
      toastErrorNotify(`${error.response.data.message}`);
    }
  };

  // const updateUserInfo = async (updatedUserData: object) => {
  //   console.log(updatedUserData);
  //   try {
  //     const response = await axiosWithToken.patch(
  //       `http://localhost:3000/api/v1/users/updateUser`,
  //       updatedUserData
  //     );
  //     toastSuccessNotify('Your profile  successfully updated.');
  //     return response;
  //   } catch (error: AxiosError) {
  //     console.log(error);
  //     toastErrorNotify(`${error.response.data.message}`);
  //   }
  // };

  const updateUserPassWord = async (updatedUserData: object) => {
    console.log(updatedUserData);
    try {
      const response = await axiosWithToken.patch(
        `http://localhost:3000/api/v1/users/updateMyPassword`,
        updatedUserData
      );
      toastSuccessNotify('Your password successfully updated.');
      return response;
    } catch (error: AxiosError) {
      console.log(error);
      toastErrorNotify(`${error.response.data.message}`);
    }
  };

  // const getUserInfo = async (id: ObjectId) => {
  //   try {
  //     const response = await axiosWithToken.get(
  //       `http://localhost:3000/api/v1/users/${id}`
  //     );
  //     console.log(response.data);
  //     return response.data;
  //   } catch (error: AxiosError) {
  //     console.log(error);
  //     toastErrorNotify(`${error.response.data.message}`);
  //   }
  // };

  return {
    createAppointment,
    updateAppointment,
    deleteAppointment,
   // updateUserInfo,
    updateUserPassWord,
   // getUserInfo,
  };
};

export default useHttp;
