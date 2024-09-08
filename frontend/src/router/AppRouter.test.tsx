import { render, screen } from '@testing-library/react';
//import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
//import { Provider } from 'react-redux';
//import store from './../store/index';
//import App from '../App';
import { userEvent } from '@testing-library/user-event';
//import { BrowserRouter } from 'react-router-dom';
//import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ContactPage from '../pages/ContactPage';

// Helper component to log the current location
// const LocationDisplay = () => {
//     const location = useLocation();
//     console.log('Current location:', location.pathname);
//     return null;
//   };
test('1--Renders home page', async () => {
  render(
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );

  const user = userEvent.setup();
  // verify page content for default route
  expect(screen.getByText('THE LEADER IN CARING YOU...')).toBeInTheDocument();
  expect(screen.getByText('DISCOVER')).toBeInTheDocument();
  expect(screen.getByText('MEET OUR DOCTORS')).toBeInTheDocument();

  // verify page content for expected route after navigating
  const contactLink = screen.getByRole('link', { name: /contact/i });
  expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute(
    'href',
    '/contact'
  );
  //console.log(fireEvent.click(screen.getByRole('link', { name: /contact/i }))); //true
  //fireEvent.click(screen.getByRole('link', { name: /contact/i }));
  // Simulate navigation by clicking the "CONTACT" link
  await user.click(contactLink);

  //   const contactFormHeading = await screen.findByRole('heading', {
  //     name: /contact form/i,
  //   });
  //   expect(contactFormHeading).toBeInTheDocument();
});

//   it('2--Renders contact page', async () => {
//     render(
//       <Provider store={store}>
//         <App />
//       </Provider>
//     );

//     const contactLink = screen.getByText(/contact/i);
//     fireEvent.click(contactLink);
//     // Simulate clicking on the "CONTACT" link
//     //await userEvent.click(contactLink);

//     await waitFor(() => {
//       expect(screen.getByText('Submit')).toBeInTheDocument();
//     });
//     // Optionally, add more assertions for other elements on the contact page
//     //expect(screen.findByText('Submit')).toBeInTheDocument();
//     //expect(screen.getByText('Cancel')).toBeInTheDocument();
//   });

//   it('3--Redirects to auth page if user is not authenticated', () => {
//     render(
//       <Provider store={store}>
//         <MemoryRouter initialEntries={['/user/dashboard']}>
//           <App />
//         </MemoryRouter>
//       </Provider>
//     );

//     expect(screen.getByText('Login')).toBeInTheDocument();
//   });
//   it('4--Renders dashboard page for authenticated user', () => {
//     // Mock the authenticated state
//     const mockAuth = jest.spyOn(store, 'getState').mockReturnValue({
//       auth: { isAuthenticated: true },
//       user: { role: 'user' },
//     });

//     render(
//       <Provider store={store}>
//         <MemoryRouter initialEntries={['/user/dashboard']}>
//           <App />
//         </MemoryRouter>
//       </Provider>
//     );

//     expect(screen.getByText('Dashboard Content')).toBeInTheDocument();

//     mockAuth.mockRestore(); // Restore original functionality
//   });
