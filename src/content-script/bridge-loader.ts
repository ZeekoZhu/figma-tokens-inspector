import { content as log } from '../logger';

export const loadBridge = () => {
  const script = document.createElement('script');
  const scriptUrl = chrome.runtime.getURL('/figma-bridge.js');
  log.debug('Loading bridge', script, scriptUrl);
  script.src = scriptUrl;
  document.head.appendChild(script);
}
