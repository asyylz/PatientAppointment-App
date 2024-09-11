import useHttp from "../../hooks/useHttp/useHttp";

const deleteAppointmentMock = jest.fn();
// we have response conditon in Dashboard component to be able to empty the states
deleteAppointmentMock.mockResolvedValue({
  status: 204, // Simulate a successful deletion response with status 204
});

const updateAppointmentMock = jest.fn();
// we have response conditon in Dashboard component to be able to empty the states
updateAppointmentMock.mockResolvedValue({
  status: 'success',
});
const createAppointmentMock = jest.fn();
createAppointmentMock.mockResolvedValue({
  status: 'success',
});

const submitContactFormMock = jest.fn();
submitContactFormMock.mockResolvedValue({
  status: 'success',
});
const getDoctorWithAvailabilitiesMock = jest.fn();
getDoctorWithAvailabilitiesMock.mockResolvedValue({
  status: 'success',
});

(useHttp as jest.Mock).mockReturnValue({
  deleteAppointment: deleteAppointmentMock,
  updateAppointment: updateAppointmentMock,
  createAppointment: createAppointmentMock,
  getDoctorWithAvailabilities: getDoctorWithAvailabilitiesMock,
  submitContactForm: submitContactFormMock,
});

export {
  deleteAppointmentMock,
  updateAppointmentMock,
  createAppointmentMock,
  submitContactFormMock,
  getDoctorWithAvailabilitiesMock,
};
