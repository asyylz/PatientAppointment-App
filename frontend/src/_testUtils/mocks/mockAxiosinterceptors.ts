import { axiosInterceptorsWithToken } from './../../services/axiosInterceptors'
/* ---------------- Mock axiosInterceptor --------------- */
jest.mock('./../../hooks/axiosInterceptors', () => ({
  axiosInterceptorsWithToken: {
    delete: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

// Mock delete
const deleteMock = axiosInterceptorsWithToken.delete as jest.Mock;
deleteMock.mockResolvedValue({
  data: { success: true }, // Simulate a successful delete response
});

// Mock update
const updateMock = axiosInterceptorsWithToken.patch as jest.Mock;
updateMock.mockResolvedValue({
  status: 'success',
  data: {
    appointment: {
      _id: '66bb4c6a7f78041ac61a875c',
      doctorId: '665f0f2959c971659af920e5',
      patientId: '6673662fbd42a966b75dec92',
      appointmentDateAndTime: '2024-08-16T16:00:00.000Z',
      reason: 'ccccc',
      diagnose: null,
      status: null,
      referral: false,
      __v: 0,
    },
  },
});

// Mock get
const getMock = axiosInterceptorsWithToken.get as jest.Mock;
getMock.mockImplementationOnce(() => new Promise(() => {}));
getMock.mockResolvedValue({
  data: {
    status: 'succeeded',
    error: null,
    data: {
      total: 1,
      upcomingAppointments: 1,
      appointmentsForPatient: [
        {
          _id: '66b0a0c31d2124f7d8aaa65b',
          doctorId: {
            _id: '665f0f2959c971659af920ca',
            firstName: 'Bowen',
            lastName: 'Chan',
            departmentId: '6660fbd12e3c00fe18cfceef',
          },
          patientId: '6673662fbd42a966b75dec92',
          appointmentDateAndTime: '2024-08-16T11:00:00.000Z',
          reason: 'test3',
          diagnose: null,
          status: null,
          referral: false,
        },
      ],
    },
  },
});
