import { within } from '@testing-library/react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Store } from '@reduxjs/toolkit';
import React from 'react';

export const toContainRole = async (
  container: HTMLElement,
  role: string,
  quantity = 1
): Promise<{ pass: boolean; message: () => string }> => {
  const elements = await within(container).findAllByRole(role);


  if (elements.length === quantity) {
    return {
      pass: true,
      message: () => '', // return an empty string when the test passes
    };
  }

  return {
    pass: false,
    message: () =>
      `Expected to find ${quantity} ${role} elements. Found ${elements.length} instead.`,
  };
};

export const renderComponent = (
  component: React.ReactElement,
  store: Store,
  options?: RenderOptions
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>,
    options
  );
};

// export const toContainRole = (
//   container: HTMLElement,
//   role: string,
//   quantity = 1
// ): { pass: boolean; message: () => string } => {
//   const elements = within(container).getAllByRole(role);
// console.log(elements.length)
//   if (elements.length === quantity) {
//     return {
//       pass: true,
//       message: () => '', // return an empty string when the test passes
//     };
//   }

//   return {
//     pass: false,
//     message: () =>
//       `Expected to find ${quantity} ${role} elements. Found ${elements.length} instead.`,
//   };
// };
