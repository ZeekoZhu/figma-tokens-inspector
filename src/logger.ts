import loglevel from 'loglevel';
import env from '~/env';

const originFactory = loglevel.methodFactory;

loglevel.methodFactory = function (methodName, level, loggerName) {
  const rawMethod = originFactory(methodName, level, loggerName);
  return function (...args) {
    if (typeof loggerName === 'string') {
      rawMethod(`[${loggerName}]`, ...args);
      return;
    }
    rawMethod(...args);
  };
};

export const content = loglevel.getLogger('FTI.content');
export const bridge = loglevel.getLogger('FTI.bridge');
export const popup = loglevel.getLogger('FTI.popup');

content.setLevel(env.logLevel);
bridge.setLevel(env.logLevel);
popup.setLevel(env.logLevel);
