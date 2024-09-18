import 'jest';

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainRole(role: string, quantity?: number): R;
    }
  }
}

declare namespace NodeJS {
  interface Global {
    importMetaEnv: {
      VITE_BASE_URL: string;
      VITE_NODE_ENV: string;
      VITE_SERVER_URL: string;
    };
  }
}
declare let global: NodeJS.Global;

