// @ts-ignore magic
import figmaBridge from '~/figma-bridge?script&module';

export const loadBridge = () => {
  const script = document.createElement('script');
  script.src = browser.runtime.getURL(figmaBridge);
  script.type = 'module';
  document.head.appendChild(script);
};
