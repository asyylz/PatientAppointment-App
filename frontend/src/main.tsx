import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';
//import { store, persistor } from './store/index';
import store from './store/index';
import { persistor } from './store/index.ts';

import { PersistGate } from 'redux-persist/integration/react';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
