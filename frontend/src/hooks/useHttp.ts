import axios, { AxiosError } from 'axios';
import { toastErrorNotify, toastSuccessNotify } from '../helper/ToastNotify';
import useAxios from './useAxios';

interface ReviewData {
  doctorId: string;
  userId: string;
  attributes: AttributesAndComment;
  comments: string | undefined;
}

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
      console.log(fieldName);
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
    try {
      const response = await axiosWithToken.patch(
        `http://localhost:3000/api/v1/appointments/${id}`,
        data
      );
      toastSuccessNotify('Your appointment successfully updated');
      return response.data;
    } catch (error: AxiosError) {
      console.log(error.response.data);
      const fieldName = Object.keys(error.response.data.message)[0];
      console.log(fieldName);
      if (fieldName === '0') {
        toastErrorNotify(error.response.data.message);
      } else {
        toastErrorNotify(`${error.response.data.message[fieldName].message}`);
      }
    }
  };

  const deleteAppointment = async (id: ObjectId | undefined) => {
    console.log(id);

    try {
      const response = await axiosWithToken.delete(
        `http://localhost:3000/api/v1/appointments/${id}`
      );
      toastSuccessNotify('Your appointment successfully deleted.');
      console.log(response);
      return response;
    } catch (error: AxiosError) {
      console.log(error);
      toastErrorNotify(`${error.response.data.message}`);
    }
  };

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

  const getDoctorAppointments = async (id: ObjectId) => {
    console.log(id);
    try {
      const response = await axiosWithToken.get(
        `http://localhost:3000/api/v1/appointments/doctors/${id}`
      );
      console.log(response.data.data.appointmentsForDoctor);
      return response.data.data.appointmentsForDoctor;
    } catch (error) {
      console.log(error);
      toastErrorNotify(`${error.response.data.message}`);
    }
  };

  const getDoctorWithAvailabilities = async (id: ObjectId) => {
    console.log(id);
    try {
      const response = await axiosWithToken.get(
        `http://localhost:3000/api/v1/doctors/${id}`
      );
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      toastErrorNotify(`${error.response.data.message}`);
    }
  };
  const postReview = async (data: ReviewData) => {
    console.log(data);
    try {
      const response = await axiosWithToken.post(
        `http://localhost:3000/api/v1/reviews`,
        data
      );
      console.log(response.data);
      toastSuccessNotify('Your review successfully posted');
      return response.data.data;
    } catch (error) {
      console.log(error);
      toastErrorNotify(`${error.response.data.message}`);
    }
  };
  return {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateUserPassWord,
    getDoctorAppointments,
    getDoctorWithAvailabilities,
    postReview,
  };
};

export default useHttp;
