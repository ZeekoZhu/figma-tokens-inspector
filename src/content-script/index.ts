import {
  combineLatest, shareReplay,
  Subject,
  takeUntil
} from 'rxjs';
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

startInspect$.subscribe();

function setupPopupMessaging(port: chrome.runtime.Port) {
  if (port.name !== 'FROM_POPUP') {
    return;
  }
  log.debug('Connected from popup', port);
  const sendMsg = sendExtensionMsg(port);
  const $unsub = new Subject<void>();
  startInspect$.pipe(
    takeUntil($unsub),
  ).subscribe(([fileId]) => {
    log.debug('Inspecting file', fileId);
    sendMsg({ type: ContentScript.FILE_OPENED, payload: { fileId } });
  });
  $nodeSelected.pipe(
    takeUntil($unsub),
  ).subscribe(nodes => {
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
  port.onDisconnect.addListener(() => {
    log.debug('Disconnected from popup');
    $unsub.next();
    $unsub.complete();
  });
}

chrome.runtime.onConnect.addListener(port => {
  setupPopupMessaging(port);
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
