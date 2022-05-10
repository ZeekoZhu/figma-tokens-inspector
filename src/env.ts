import { LogLevelDesc } from 'loglevel';

const env = {
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'debug' as LogLevelDesc,
  tokenPreview: import.meta.env.VITE_FEATURE_TOKEN_PREVIEW || false,
  isDev: import.meta.env.DEV || false,
};

export default env;
