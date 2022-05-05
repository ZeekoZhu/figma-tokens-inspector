import { combineLatest, shareReplay, Subject } from 'rxjs';
import { ContentScript, FigmaBridge, Popup } from '../events';
import { content as log } from '../logger';
import { sendExtensionMsg } from '../popup/stores/extension-bridge';
import { loadBridge } from './bridge-loader';

log.debug('Content script loaded');

const $fileId = new Subject<string>();
const $popupOpen = new Subject<void>();
const $nodeSelected = new Subject<string[]>();
const startInspect$ = combineLatest([$fileId, $popupOpen]).pipe(
  shareReplay(1),
);

chrome.runtime.onConnect.addListener(port => {
  const sendMsg = sendExtensionMsg(port);
  startInspect$.subscribe(([fileId]) => {
    sendMsg({ type: ContentScript.FILE_OPENED, payload: { fileId } });
  });
  $nodeSelected.subscribe(nodes => {
    sendMsg({
      type: ContentScript.NODE_SELECTED,
      payload: { nodeIdList: nodes }
    });
  });
  port.onMessage.addListener(msg => {
    log.debug('Received message from extension:', msg);
    if (msg.type === Popup.POPUP_OPENED) {
      $popupOpen.next();
    }
  });
});


loadBridge();

window.addEventListener('message', (event) => {
  if (event.data.type === FigmaBridge.INITIALIZED) {
    log.debug('Figma bridge initialized');
    const fileId = document.location.pathname.split('/')[2];
    $fileId.next(fileId);
  }
  if (event.data.type === FigmaBridge.NODE_SELCTED) {
    log.debug('Node selected', event.data.payload);
    $nodeSelected.next(event.data.payload);
  }
});


export {};
