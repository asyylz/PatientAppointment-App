import type { Config } from 'jest';

const config: Config = {
  //resetMocks: false,
  //coverageDirectory: '<rootDir>/src/_testUtils/coverage',
  //collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  // This will force JSDOM to use the node (or default) export condition, which is the correct behavior.

  // If you encounter other import-related issued after this change, they aren't related and have to be addressed separately. Adding this recommendation to the migration guide as well so everyone could follow
  testEnvironmentOptions: {
    customExportConditions: [''], // node
  },
  testPathIgnorePatterns: [
    'node_modules/',
    'dist/', // If you want to exclude the dist folder too
    'src/_testUtils/mocks/', // This excludes the files in the specified directory
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'], //['./jest.setup.js']
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}', // telling collect from these files
    // '!src/**/*.d.ts', // telling not to collect from these files with !
    // '!src/_**/*.*', // telling not to collect from these files with !
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'node_modules/ts-jest-mock-import-meta', // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
              options: {
                metaObjectReplacement: {
                  baseURL: 'http://localhost:3000/api/v1/',
                },
              },
            },
          ],
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
