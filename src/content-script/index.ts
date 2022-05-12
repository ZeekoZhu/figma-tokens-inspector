import {
  combineLatest, shareReplay,
  Subject,
} from 'rxjs';
import { ContentScript, FigmaBridge } from '../events';
import { content as log } from '../logger';
import {
  ContentScriptMsgTypes,
} from '~/popup/stores/extension-bridge';

import { loadBridge } from './bridge-loader';
import { initInspectorWidget } from './inspector-widget';

function isInFigmaFile() {
  return !!window.location.href.match(/^https:\/\/figma\.com\/file/);
}

(() => {
  log.debug('Content script loaded');
  if (!isInFigmaFile()) {
    log.debug('Not in figma file');
    return;
  }
  const $fileId = new Subject<string>();
  const $popupOpen = new Subject<void>();
  const $nodeSelected = new Subject<string[]>();
  const startInspect$ = combineLatest([ $fileId, $popupOpen ]).pipe(
    shareReplay(1),
  );

  function setupPopupMessaging() {
    const $popupMsg = new Subject<ContentScriptMsgTypes>();
    const sendMsg = (msg: ContentScriptMsgTypes) => {
      $popupMsg.next(msg);
    };
    startInspect$.pipe(
    ).subscribe(([ fileId ]) => {
      log.debug('Inspecting file', fileId);
      sendMsg({ type: ContentScript.FILE_OPENED, payload: { fileId } });
    });
    $nodeSelected.pipe(
    ).subscribe(nodes => {
      sendMsg({
        type: ContentScript.NODE_SELECTED,
        payload: { nodeIdList: nodes },
      });
    });

    return $popupMsg.asObservable();
  }

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

  initInspectorWidget({
    msg$: setupPopupMessaging(), onBootstrap: () => {
      $popupOpen.next();
    },
  });

})();

