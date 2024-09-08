// setupTests.ts
import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';
import { toContainRole } from './src/_testUtils/mocks/helper';
import {  expect } from '@jest/globals'; //afterAll, afterEach, beforeAll,
import {
  TextEncoder as NodeTextEncoder,
  TextDecoder as NodeTextDecoder,
} from 'util';

global.TextEncoder = NodeTextEncoder as unknown as typeof TextEncoder;
global.TextDecoder = NodeTextDecoder as unknown as typeof TextDecoder;

// import { server } from './../frontend/src/mocks/server';
// // Start the MSW server before all tests
// beforeAll(() => server.listen());
// // Reset any request handlers that are added during the tests
// afterEach(() => server.resetHandlers());

// // Stop the server after all tests are done
// afterAll(() => server.close());

// import { worker } from './../frontend/src/mocks/browser';
// beforeAll(() => worker.start());
// afterEach(() => worker.resetHandlers());
// afterAll(() => worker.stop());

// Mock `import.meta.env`
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_BASE_URL: 'http://localhost:3000/api/v1/',
    },
  },
});

expect.extend({ toContainRole });
