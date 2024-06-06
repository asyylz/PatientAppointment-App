import React from 'react';
import { RouteObject } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './../pages/HomePage';
import Departments from './../pages/sub-pages/Departments';
import Doctors from '../pages/sub-pages/Doctors';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    children: [
      { path: 'dashboard', index: true },
      { path: 'appointments' },
      { path: 'doctors', element: <Doctors /> },
      { path: 'departments', element: <Departments /> },
      { path: 'payments' },
      { path: 'settings' },
    ],
  },
];

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
