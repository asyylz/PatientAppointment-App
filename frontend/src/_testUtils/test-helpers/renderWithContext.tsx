import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../../store/index';
import type { AppStore, RootState } from '../../store/index';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  reducer?: any;
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const { preloadedState, reducer } = extendedRenderOptions;
  // Ensure that the store is being correctly initialized with preloadedState
  const store = setupStore(reducer, preloadedState);
  //console.log(store.getState()); // Verify the state of the store

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...extendedRenderOptions }),
  };
}
