import * as axiosInterceptors from './../../services/axiosInterceptors';
import * as useHttp from './useHttp';
import * as toast from '../../helper/ToastNotify';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

jest.mock('./../../services/axiosInterceptors');
jest.mock('../../helper/ToastNotify');

const functionCaller = async (
  method: string,
  url: string,
  message?: string,
  data?: object
) => {
  const axiosMethods: Record<
    string,
    (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  > = {
    get: axiosInterceptors.axiosInterceptorsWithToken.get,
    post: axiosInterceptors.axiosInterceptorsWithToken.post,
    patch: axiosInterceptors.axiosInterceptorsWithToken.patch,
    delete: axiosInterceptors.axiosInterceptorsWithToken.delete,
  };

  expect(axiosMethods[method]).toHaveBeenCalled();

  data
    ? expect(axiosMethods[method]).toHaveBeenCalledWith(url, data)
    : expect(axiosMethods[method]).toHaveBeenCalledWith(url);

  message && expect(toast.toastSuccessNotify).toHaveBeenCalledWith(message);
  message && expect(toast.toastSuccessNotify).toHaveBeenCalledTimes(1);
};

describe('UseHttp Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('CreateAppointment', () => {
    it('1--Should call', async () => {
      const data: AppointmentForBooking = {
        doctorId: '665f0f2959c971659af920ca',
        patientId: '6673662fbd42a966b75dec92',
        appointmentDateAndTime: '2024-08-14T15:30:00.000Z',
        reason: 'test1',
      };
      axiosInterceptors.axiosInterceptorsWithToken.post = jest
        .fn()
        .mockResolvedValue({ data: { status: 'success' } });
      const { createAppointment } = useHttp.default();

      await createAppointment(data);

      functionCaller(
        'post',
        'http://localhost:3000/api/v1/appointments',
        'Your appointment successfully placed.',
        data
      );
    });
  });
  describe('UpdateAppointment', () => {
    it('1--Should call', async () => {
      const data = { reason: 'updated test1' };
      const id = '1234';

      axiosInterceptors.axiosInterceptorsWithToken.patch = jest
        .fn()
        .mockResolvedValue({ data: { status: 'success' } });

      const { updateAppointment } = useHttp.default();
      await updateAppointment({ reason: 'updated test1' }, id);

      functionCaller(
        'patch',
        `http://localhost:3000/api/v1/appointments/${id}`,
        'Your appointment successfully updated.',
        data
      );
    });
  });
  describe('DeleteAppointment', () => {
    it('1--Should call', async () => {
      const id = '1234';

      axiosInterceptors.axiosInterceptorsWithToken.delete = jest
        .fn()
        .mockResolvedValue({ data: { status: 'success' } });

      const { deleteAppointment } = useHttp.default();
      await deleteAppointment(id);

      functionCaller(
        'delete',
        `http://localhost:3000/api/v1/appointments/${id}`,
        'Your appointment successfully deleted.',
        undefined
      );
    });
  });
  describe('UpdatePassword', () => {
    it('1--Should call', async () => {
      const data = {
        oldPassword: 'mockedOldResponse',
        newPassword: 'mockedNewResponse',
        confirmNewPassword: 'mockedNewResponse',
      };

      axiosInterceptors.axiosInterceptorsWithToken.delete = jest
        .fn()
        .mockResolvedValue({ data: { status: 'success' } });

      const { updateUserPassword } = useHttp.default();
      await updateUserPassword(data);

      functionCaller(
        'patch',
        `http://localhost:3000/api/v1/users/updateMyPassword`,
        'Your password successfully updated.',
        data
      );
    });
  });
  describe('GetDoctorAppointments', () => {
    it('1--Should call', async () => {
      const id: string = '1234';
      axiosInterceptors.axiosInterceptorsWithToken.get = jest
        .fn()
        .mockResolvedValue({
          data: {
            status: 'success',
            data: {
              appointmentsForDoctor: [
                {
                  _id: '66bc6c89a0c6ea472a2fcccf',
                  doctorId: '665f0f2959c971659af920ca',
                  patientId: {
                    _id: '6673662fbd42a966b75dec92',
                    name: 'Asiye',
                    email: 'alice@test.com',
                    DOB: '1986-01-22T00:00:00.000Z',
                  },
                },
              ],
            },
          },
        });

      const { getDoctorAppointments } = useHttp.default();
      await getDoctorAppointments(id);

      functionCaller(
        'get',
        `http://localhost:3000/api/v1/appointments/doctors/${id}`,
        undefined,
        undefined
      );
    });
  });
  describe('GetDoctorWithAvailabilities', () => {
    it('1--Should call', async () => {
      const id: string = '665f0f2959c971659af920ca';
      axiosInterceptors.axiosInterceptorsWithToken.get = jest
        .fn()
        .mockResolvedValue({
          data: {
            status: 'success',
            data: {
              _id: '665f0f2959c971659af920ca',
              // other fields
              availabilities: [
                {
                  _id: '667bf784d46e8fead6249f74',
                  doctorId: '665f0f2959c971659af920ca',
                  day: 'Monday',
                  time: '09:00',
                  currentWeekAvailabilityInDateFormat:
                    '2024-08-19T09:00:00.000Z',
                },
              ],
              reviews: [],
            },
          },
        });

      const { getDoctorWithAvailabilities } = useHttp.default();
      await getDoctorWithAvailabilities(id);

      functionCaller(
        'get',
        `http://localhost:3000/api/v1/doctors/${id}`,
        undefined,
        undefined
      );
    });
  });
  describe('postReview', () => {
    it('1--Should call', async () => {
      const data = {
        doctorId: 'doctorId',
        userId: 'userId',
        // other fields
      } as ReviewData;

      axiosInterceptors.axiosInterceptorsWithToken.post = jest
        .fn()
        .mockResolvedValue({
          data: {
            status: 'success',
            data: {}, // posted data
          },
        });

      const { postReview } = useHttp.default();
      await postReview(data);

      functionCaller(
        'post',
        `http://localhost:3000/api/v1/reviews`,
        'Your review successfully posted.',
        data
      );
    });
  });
  describe('SubmitContactForm', () => {
    // since we use without token we didn't use here functionCall
    it('1--Should call', async () => {
      const data = {
        name: 'mockName',
        email: 'mock@email.com',
        message: 'mockMessage',
        subject: 'mockSubject',
      } as ContactFormData;
      const url = 'http://localhost:3000/api/v1/contact';
      axiosInterceptors.axiosInterceptorsWithoutToken.post = jest
        .fn()
        .mockResolvedValue({
          data: {
            status: 'success',
            data: {}, // posted data
          },
        });

      const { submitContactForm } = useHttp.default();
      await submitContactForm(data);
      expect(
        axiosInterceptors.axiosInterceptorsWithoutToken.post
      ).toHaveBeenCalled();
      expect(
        axiosInterceptors.axiosInterceptorsWithoutToken.post
      ).toHaveBeenCalledWith(url, data);

      expect(toast.toastSuccessNotify).toHaveBeenCalledWith(
        `Your message successfully sent.`
      );
      expect(toast.toastSuccessNotify).toHaveBeenCalledTimes(1);
    });
  });
  describe('ForgotPassword', () => {
    // since we use without token we didn't use here functionCall
    it('1--Should call', async () => {
      const email: string = 'mock@email.com';
      const url: string = 'http://localhost:3000/api/v1/users/forgotPassword';

      axiosInterceptors.axiosInterceptorsWithoutToken.post = jest
        .fn()
        .mockResolvedValue({
          data: {
            status: 'success',
            data: {}, // posted data
          },
        });

      const { forgotPassword } = useHttp.default();
      await forgotPassword(email);

      expect(
        axiosInterceptors.axiosInterceptorsWithoutToken.post
      ).toHaveBeenCalled();
      expect(
        axiosInterceptors.axiosInterceptorsWithoutToken.post
      ).toHaveBeenCalledWith(url, email);

      expect(toast.toastSuccessNotify).toHaveBeenCalledWith(
        `Email sent to ${email} successfully!`
      );
      expect(toast.toastSuccessNotify).toHaveBeenCalledTimes(1);
    });
  });
  describe('ResetPassword', () => {
    // since we use without token we didn't use here functionCall
    it('1--Should call', async () => {
      const resetToken: string = 'mockResetToken';
      const data = {
        password: 'newPassword',
        passwordConfirm: 'newPasswordConfirm',
        resetToken,
      } as PasswordResetData;
      const url: string = `http://localhost:3000/api/v1/users/resetPassword/${resetToken}`;

      axiosInterceptors.axiosInterceptorsWithoutToken.patch = jest
        .fn()
        .mockResolvedValue({
          data: {
            status: 'success',
            data: {}, // posted data
          },
        });

      const { resetPassword } = useHttp.default();
      await resetPassword(data);

      expect(
        axiosInterceptors.axiosInterceptorsWithoutToken.patch
      ).toHaveBeenCalled();
      expect(
        axiosInterceptors.axiosInterceptorsWithoutToken.patch
      ).toHaveBeenCalledWith(url, {
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });

      expect(toast.toastSuccessNotify).toHaveBeenCalledWith(
        'Your password successfully re-set.'
      );
      expect(toast.toastSuccessNotify).toHaveBeenCalledTimes(1);
    });
  });
});
