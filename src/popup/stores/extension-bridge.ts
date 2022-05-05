import { shareReplay, Subject } from 'rxjs';
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

export const createConnector = async () => {

  const tab = await getCurrentTab();
  popup.debug('connect to tab:', tab);
  const port = chrome.tabs.connect(tab.id!, { name: 'FROM_POPUP' });
  const $msg = new Subject<ContentScriptMsgTypes>();
  port.onMessage.addListener(msg => {
    $msg.next(msg);
  });
  const msg$ = $msg.pipe(shareReplay(1));
  const connectContentScript = ({ onMessage }: { onMessage: ContentScriptMsgHandler }) => {
    port.postMessage({ type: Popup.POPUP_OPENED });
    const sub = msg$.subscribe(onMessage);
    return () => sub.unsubscribe();
  };
  return { connectContentScript, port };
};

export type ContentScriptMsgHandler = (msg: ContentScriptMsgTypes) => void;

export const sendExtensionMsg = (port: Port) => (msg: ContentScriptMsgTypes) => {
  port.postMessage(msg);
};
