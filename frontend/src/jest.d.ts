import 'jest';

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainRole(role: string, quantity?: number): R;
    }
  }
}
