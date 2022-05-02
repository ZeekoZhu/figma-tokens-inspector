import loglevel from 'loglevel';

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

content.setLevel('debug');
bridge.setLevel('debug');
popup.setLevel('debug');
