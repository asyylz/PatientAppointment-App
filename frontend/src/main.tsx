// src/main.tsx
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import store, { persistor } from './store/index';
import { PersistGate } from 'redux-persist/integration/react';
//import { worker } from './mocks/browser';
//import { server } from './mocks/server';

//server.listen();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

// async function enableMocking() {
//   if (process.env.NODE_ENV !== 'development') {
//     return;
//   }

//   await worker.start();
// }
// // Enable mocking for development mode
// enableMocking();

// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import App from './App.tsx';
// import './index.css';
// import store, { persistor } from './store/index.ts';

// import { PersistGate } from 'redux-persist/integration/react';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <Provider store={store}>
//     <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>
// );
