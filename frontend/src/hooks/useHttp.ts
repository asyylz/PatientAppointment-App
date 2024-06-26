import useAxios from './useAxios';

const useHttp = () => {
  const axiosWithToken = useAxios();

  const createAppointment = async (data: Appointment) => {
    console.log(data)
    try {
      await axiosWithToken.post(
        'http://localhost:3000/api/v1/appointments',
        data
      );
    } catch (error) {
      console.error('Error creating appointment', error);
    }
  };

  return { createAppointment };
};

export default useHttp;
