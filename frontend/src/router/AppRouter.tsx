import React from 'react';
import { RouteObject } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/Homepage/HomePage';
import Departments from '../pages/Departments/Departments';
import DoctorsPage from '../pages/DoctorsPage/DoctorsPage';
import Dashboard from '../pages/Dashboard/Dashboard';
import Appointments from '../pages/Appointments_Doctor/Appointments';
import DoctorDetailsPage from '../pages/DoctorDetailForBooking/DoctorDetailsPage';
import DoctorsLayout from '../layouts/DoctorsLayout';
import AuthPage from '../pages/AuthPage/AuthPage';
import PrivateRoute from './PrivateRoute';
import PrivateRouteForRoles from './PrivateRouteForRoles';
import MainLayout from '../layouts/MainLayout';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import ContactPage from '../pages/ContactPage/ContactPage';
import HomeLayout from '../layouts/HomeLayout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/auth', element: <AuthPage /> },
    ],
  },
  {
    path: '/user',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <PrivateRouteForRoles allowedRole="doctor">
            <Appointments />
          </PrivateRouteForRoles>
        ),
      },
      {
        element: <DoctorsLayout />,
        children: [
          {
            path: 'doctors',
            element: <DoctorsPage />,
            index: true,
          },
          {
            path: 'doctors/:doctorId',
            element: (
              <PrivateRoute>
                <DoctorDetailsPage />
              </PrivateRoute>
            ),
          },
        ],
      },
      { path: 'departments', element: <Departments /> },
      {
        path: 'profilesettings',
        element: (
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  { path: 'resetPassword/:resetToken', element: <ResetPassword /> },
];

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
