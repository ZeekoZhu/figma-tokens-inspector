import { ContentScript, Popup } from '../../events';
import { popup } from '../../logger';
import Port = chrome.runtime.Port;

export type ContentScriptMsgTypes = {
  type: typeof ContentScript.FILE_OPENED;
  payload: { fileId: string };
} | {
  type: typeof ContentScript.NODE_SELECTED;
  payload: { nodeIdList: string[] };
}

export const getCurrentTab = (): Promise<chrome.tabs.Tab> => {
  return new Promise<chrome.tabs.Tab>(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      popup.debug('Current tab:', tabs);
      resolve(tabs[0]);
    });
  });
};
const tab = await getCurrentTab();
const port = chrome.tabs.connect(tab.id!, { name: 'FROM_POPUP' });

export type ContentScriptMsgHandler = (msg: ContentScriptMsgTypes) => void;
export const connectContentScript = ({ onMessage }: { onMessage: ContentScriptMsgHandler }) => {
  port.postMessage({ type: Popup.POPUP_OPENED });
  port.onMessage.addListener(onMessage);
  return () => port.onMessage.removeListener(onMessage);
};

export const sendExtensionMsg = (port: Port) => (msg: ContentScriptMsgTypes) => {
  port.postMessage(msg);
};
