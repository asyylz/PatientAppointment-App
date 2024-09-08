import { toastSuccessNotify } from '../helper/ToastNotify';
import {
  axiosInterceptorsWithoutToken,
  axiosInterceptorsWithToken,
} from './axiosInterceptors';



const useHttp = () => {
  const createAppointment = async (data: AppointmentForBooking) => {
    const response = await axiosInterceptorsWithToken.post(
      'http://localhost:3000/api/v1/appointments',
      data
    );
    toastSuccessNotify('Your appointment successfully placed.');
    return response.data;
  };

  const updateAppointment = async (
    data: object | undefined,
    id: string | undefined
  ) => {
    const response = await axiosInterceptorsWithToken.patch(
      `http://localhost:3000/api/v1/appointments/${id}`,
      data
    );
    toastSuccessNotify('Your appointment successfully updated.');
    return response.data;
  };

  const deleteAppointment = async (id: string | undefined) => {
    const response = await axiosInterceptorsWithToken.delete(
      `http://localhost:3000/api/v1/appointments/${id}`
    );
    toastSuccessNotify('Your appointment successfully deleted.');
    return response;
  };

  const updateUserPassword = async (
    updatedUserData: UpdatedUserPasswordData
  ) => {
    const response = await axiosInterceptorsWithToken.patch(
      `http://localhost:3000/api/v1/users/updateMyPassword`,
      updatedUserData
    );
    toastSuccessNotify('Your password successfully updated.');
    return response;
  };

  const getDoctorAppointments = async (id: string) => {
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
    toastSuccessNotify('Your review successfully posted.');
    return response.data;
  };

  const submitContactForm = async (data: ContactFormData) => {
    const response = await axiosInterceptorsWithoutToken.post(
      'http://localhost:3000/api/v1/contact',
      data
    );
    toastSuccessNotify('Your message successfully sent.');
    return response.data;
  };
  const forgotPassword = async (email: string) => {
    const response = await axiosInterceptorsWithoutToken.post(
      'http://localhost:3000/api/v1/users/forgotPassword',
      email
    );
    toastSuccessNotify(`Email sent to ${email} successfully!`);
    return response.data;
  };

  const resetPassword = async (data: PasswordResetData) => {
    const { password, passwordConfirm, resetToken } = data;
    const response = await axiosInterceptorsWithoutToken.patch(
      `http://localhost:3000/api/v1/users/resetPassword/${resetToken}`,
      {
        password,
        passwordConfirm,
      }
    );
    toastSuccessNotify(`Your password successfully re-set.`);
    console.log(response.data);
    return response.data;
  };

  return {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateUserPassword,
    getDoctorAppointments,
    getDoctorWithAvailabilities,
    postReview,
    submitContactForm,
    forgotPassword,
    resetPassword,
  };
};

export default useHttp;
