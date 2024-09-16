// src/handler.ts
import { http, HttpResponse, delay } from 'msw';
import appointmentsForDoctor from '../../public/test_data/appointmentsForDoctor.json';

// We use msw to intercept the network request during the test,
// and return the response 'John Smith' after 150ms
// when receiving a get request to the `/api/user` endpoint
export const handlers = [
  http.get(
    `http://localhost:3000/api/v1/appointments/doctors/mockDoctor`,
    async () => {
      console.log('from handlers'); // until here it concoles
      await delay(350);
      console.log('asiye');
      return HttpResponse.json({
        data: {
          // This is what axiosInterceptorsWithToken expects
          appointmentsForDoctor: appointmentsForDoctor,
        },
      });
    }
  ),
];
