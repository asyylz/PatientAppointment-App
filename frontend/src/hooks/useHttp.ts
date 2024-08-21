import { toastSuccessNotify } from '../helper/ToastNotify';
import {
  axiosInterceptorsWithoutToken,
  axiosInterceptorsWithToken,
} from './axiosInterceptors';

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
    console.log(response.data);
    return response.data;
  };

  const deleteAppointment = async (id: ObjectId | undefined) => {
    console.log(id);
    console.log('asiye');
    const response = await axiosInterceptorsWithToken.delete(
      `http://localhost:3000/api/v1/appointments/${id}`
    );
    console.log(response);
    toastSuccessNotify('Your appointment successfully deleted.');
    return response;
  };

  const updateUserPassWord = async (
    updatedUserData: UpdatedUserPasswordData
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

  const submitContactForm = async (data: ContactFormData) => {
    const response = await axiosInterceptorsWithoutToken.post(
      'http://localhost:3000/api/v1/contact',
      data
    );
    toastSuccessNotify('Your message successfully sent');
    return response.data;
  };
  const forgotPassword = async (email: string) => {
    const response = await axiosInterceptorsWithoutToken.post(
      'http://localhost:3000/api/v1/users/forgotPassword',
      email
    );
    toastSuccessNotify(`Email sent to ${email} successfully!`);
    console.log(response.data);
    return response.data;
  };

  const updatePassword = async (data: UpdatedUserPasswordData) => {
    const { oldPassword, newPassword, confirmNewPassword } = data;
    const response = await axiosInterceptorsWithToken.patch(
      'http://localhost:3000/api/v1/users/updateMyPassword',
      { oldPassword, newPassword, confirmNewPassword }
    );
    toastSuccessNotify(`Your password successfully updated`);
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
    toastSuccessNotify(`Your password successfully re-set`);
    console.log(response.data);
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
    submitContactForm,
    forgotPassword,
    updatePassword,
    resetPassword,
  };
};

export default useHttp;
