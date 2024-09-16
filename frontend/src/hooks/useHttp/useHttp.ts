import { toastSuccessNotify } from '../../helper/ToastNotify';
//import { server } from '../../mocks/server';
import {
  axiosInterceptorsWithoutToken,
  axiosInterceptorsWithToken,
} from '../../services/axiosInterceptors';
const apiURL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_LOCAL_URL;

const useHttp = () => {
  const createAppointment = async (data: AppointmentForBooking) => {
    const response = await axiosInterceptorsWithToken.post(
      `${apiURL}/appointments`,
      //'http://localhost:3000/api/v1/appointments',
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
      `${apiURL}/appointments/${id}`,
      data
    );
    toastSuccessNotify('Your appointment successfully updated.');
    return response.data;
  };

  const deleteAppointment = async (id: string | undefined) => {
    const response = await axiosInterceptorsWithToken.delete(
      `${apiURL}/appointments/${id}`
    );
    toastSuccessNotify('Your appointment successfully deleted.');
    return response;
  };

  const updateUserPassword = async (
    updatedUserData: UpdatedUserPasswordData
  ) => {
    const response = await axiosInterceptorsWithToken.patch(
      `${apiURL}/users/updateMyPassword`,
      updatedUserData
    );
    toastSuccessNotify('Your password successfully updated.');
    return response;
  };

  const getDoctorAppointments = async (id: string) => {
    const response = await axiosInterceptorsWithToken.get(
      `${apiURL}/appointments/doctors/${id}`
    );
    return response.data.data.appointmentsForDoctor;
  };

  const getDoctorWithAvailabilities = async (id: string) => {
    const response = await axiosInterceptorsWithToken.get(
      `${apiURL}/doctors/${id}`
    );
    return response.data.data;
  };

  const postReview = async (data: ReviewData) => {
    const response = await axiosInterceptorsWithToken.post(
      `${apiURL}/reviews`,
      data
    );
    toastSuccessNotify('Your review successfully posted.');
    return response.data;
  };

  const submitContactForm = async (data: ContactFormData) => {
    const response = await axiosInterceptorsWithoutToken.post(
      `${apiURL}/contact`,
      data
    );
    toastSuccessNotify('Your message successfully sent.');
    return response.data;
  };
  const forgotPassword = async (email: string) => {
    console.log(email)
    const response = await axiosInterceptorsWithoutToken.post(
      `${apiURL}/users/forgotPassword`,
      email
    );
    toastSuccessNotify(`Email sent to ${email} successfully!`);
    return response.data;
  };

  const resetPassword = async (data: PasswordResetData) => {
    const { password, passwordConfirm, resetToken } = data;
    const response = await axiosInterceptorsWithoutToken.patch(
      `${apiURL}/users/resetPassword/${resetToken}`,
      {
        password,
        passwordConfirm,
      }
    );
    toastSuccessNotify(`Your password successfully re-set.`);
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
