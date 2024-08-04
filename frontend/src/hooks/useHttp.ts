import { toastErrorNotify, toastSuccessNotify } from '../helper/ToastNotify';
import axiosInterceptors from '../hooks/axiosInterceptors';

interface ReviewData {
  doctorId: string;
  userId?: string;
  attributes: AttributesAndComment;
  comments: string | undefined;
}

const useHttp = () => {

  const createAppointment = async (data: AppointmentForBooking) => {
    try {
      const response = await axiosInterceptors.post(
        'http://localhost:3000/api/v1/appointments',
        data
      );
      toastSuccessNotify('Your appointment successfully placed');
      return response.data;
    } catch (error: any) {
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
    try {
      const response = await axiosInterceptors.patch(
        `http://localhost:3000/api/v1/appointments/${id}`,
        data
      );
      toastSuccessNotify('Your appointment successfully updated');
      return response.data;
    } catch (error: any) {
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
      const response = await axiosInterceptors.delete(
        `http://localhost:3000/api/v1/appointments/${id}`
      );
      toastSuccessNotify('Your appointment successfully deleted.');
      console.log(response);
      return response;
    } catch (error: any) {
      console.log(error);
      toastErrorNotify(`${error.response.data.message}`);
    }
  };

  const updateUserPassWord = async (
    updatedUserData: UpdatedUserPasswordAndToken
  ) => {
    try {
      const response = await axiosInterceptors.patch(
        `http://localhost:3000/api/v1/users/updateMyPassword`,
        updatedUserData
      );
      toastSuccessNotify('Your password successfully updated.');
      return response;
    } catch (error: any) {
      console.log(error);
      toastErrorNotify(`${error.response.data.message}`);
    }
  };

  const getDoctorAppointments = async (id: ObjectId) => {
    console.log(id);
    try {
      const response = await axiosInterceptors.get(
        `http://localhost:3000/api/v1/appointments/doctors/${id}`
      );
      console.log(response.data.data.appointmentsForDoctor);
      return response.data.data.appointmentsForDoctor;
    } catch (error: any) {
      console.log(error);
      toastErrorNotify(`${error.response.data.message}`);
    }
  };

  const getDoctorWithAvailabilities = async (id: string) => {
   // console.log(id);
    try {
      const response = await axiosInterceptors.get(
        `http://localhost:3000/api/v1/doctors/${id}`
      );
     // console.log(response.data);
      return response.data.data;
    } catch (error: any) {
     // console.log(error.response);
      toastErrorNotify(`${error.response.data.message}`);
      throw new Error(error.response.data.message);
    }
  };
  const postReview = async (data: ReviewData) => {
    console.log(data);
    try {
      const response = await axiosInterceptors.post(
        `http://localhost:3000/api/v1/reviews`,
        data
      );
      console.log(response.data);
      toastSuccessNotify('Your review successfully posted');
      return response.data;
    } catch (error: any) {
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
