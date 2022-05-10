/// <reference types="vite/client" />
import { LogLevelDesc } from 'loglevel';

interface ImportMetaEnv {
  readonly VITE_LOG_LEVEL: LogLevelDesc;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
