import { LogLevelDesc } from 'loglevel';

const env = {
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'debug' as LogLevelDesc,
};

export default env;
