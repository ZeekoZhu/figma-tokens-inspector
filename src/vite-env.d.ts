import { LogLevelDesc } from 'loglevel';

interface ImportMetaEnv {
  readonly VITE_LOG_LEVEL: LogLevelDesc;
  readonly VITE_FEATURE_TOKEN_PREVIEW: boolean;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
