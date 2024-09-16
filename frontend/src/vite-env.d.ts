/// <reference types="vite/client" />
interface ImportMetaEnv {
  env: {
    VITE_PUBLIC_URL: string;
    VITE_NODE_ENV: string;
    VITE_BASE_URL: string;
  };
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
