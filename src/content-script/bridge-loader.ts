export const loadBridge = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('/figma-bridge.js');
  document.head.appendChild(script);
}
