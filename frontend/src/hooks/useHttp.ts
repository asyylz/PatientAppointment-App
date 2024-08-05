import { toastSuccessNotify } from '../helper/ToastNotify';
import { axiosInterceptorsWithToken } from './axiosInterceptors';

interface ReviewData {
  doctorId: string;
  userId?: string;
  attributes: AttributesAndComment;
  comments: string | undefined;
}

const useHttp = () => {
  const createAppointment = async (data: AppointmentForBooking) => {
    const response = await axiosInterceptorsWithToken.post(
      'http://localhost:3000/api/v1/appointments',
      data
    );
    toastSuccessNotify('Your appointment successfully placed');
    return response.data;
  };

  const updateAppointment = async (
    data: object | undefined,
    id: ObjectId | undefined
  ) => {
    const response = await axiosInterceptorsWithToken.patch(
      `http://localhost:3000/api/v1/appointments/${id}`,
      data
    );
    toastSuccessNotify('Your appointment successfully updated');
    return response.data;
  };

  const deleteAppointment = async (id: ObjectId | undefined) => {
    const response = await axiosInterceptorsWithToken.delete(
      `http://localhost:3000/api/v1/appointments/${id}`
    );
    toastSuccessNotify('Your appointment successfully deleted.');
    return response;
  };

  const updateUserPassWord = async (
    updatedUserData: UpdatedUserPasswordAndToken
  ) => {
    const response = await axiosInterceptorsWithToken.patch(
      `http://localhost:3000/api/v1/users/updateMyPassword`,
      updatedUserData
    );
    toastSuccessNotify('Your password successfully updated.');
    return response;
  };

  const getDoctorAppointments = async (id: ObjectId) => {
    const response = await axiosInterceptorsWithToken.get(
      `http://localhost:3000/api/v1/appointments/doctors/${id}`
    );
    return response.data.data.appointmentsForDoctor;
  };

  const getDoctorWithAvailabilities = async (id: string) => {
    const response = await axiosInterceptorsWithToken.get(
      `http://localhost:3000/api/v1/doctors/${id}`
    );

    return response.data.data;
  };
  const postReview = async (data: ReviewData) => {
    const response = await axiosInterceptorsWithToken.post(
      `http://localhost:3000/api/v1/reviews`,
      data
    );
    console.log(response.data);
    toastSuccessNotify('Your review successfully posted');
    return response.data;
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
