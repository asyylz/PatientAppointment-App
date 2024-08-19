// setupTests.ts
import '@testing-library/jest-dom';
import { toContainRole } from './src/_testUtils/mocks/helper';
import { expect } from '@jest/globals';
// jest.setup.js
// global.importMetaEnv = {
//   VITE_BASE_URL: 'http://localhost:3000/api/v1/',
// };

// Mock `import.meta.env`
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_BASE_URL: 'http://localhost:3000/api/v1/',
    },
  },
});

expect.extend({ toContainRole });
