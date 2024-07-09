import React from 'react';
import { RouteObject } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './../pages/HomePage';
import Departments from './../pages/sub-pages/Departments';
import DoctorsPage from '../pages/sub-pages/DoctorsPage';
import Dashboard from '../pages/sub-pages/Dashboard';
import Payments from '../pages/sub-pages/Payments';
import Appointments from '../pages/sub-pages/Appointments';
import DoctorDetailsPage from './../pages/sub-pages/DoctorDetailsPage';
import DoctorsLayout from '../pages/layouts/DoctorsLayout';
import AuthPage from '../pages/AuthPage';
import PrivateRoute from './PrivateRoute';
import PrivateRouteForRoles from './PrivateRouteForRoles';
import MainLayout from '../pages/layouts/MainLayout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/user',
    element: <MainLayout />,
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
          { path: 'doctors', element: <DoctorsPage />, index: true },
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
      { path: 'payments', element: <Payments /> },
      { path: 'settings' },
    ],
  },

  {
    path: '/auth',
    element: <AuthPage />,
  },
];

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
