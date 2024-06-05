import React from 'react';
import { RouteObject } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './../pages/HomePage';
import Departments from './../pages/sub-pages/Departments';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    children: [
      { path: 'dashboard', index: true },
      { path: 'appointments' },
      { path: 'doctors' },
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
