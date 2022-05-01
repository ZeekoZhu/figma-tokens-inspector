import { FigmaBridge } from '../events';
import { content as log } from '../logger';
import { loadBridge } from './bridge-loader';

log.debug('Content script loaded');

loadBridge()

window.addEventListener('message', (event) => {
  if (event.data.type === FigmaBridge.INITIALIZED) {
    log.debug('Figma bridge initialized');
  }
  if (event.data.type === FigmaBridge.NODE_SELCTED) {
    log.debug('Node selected', event.data.payload);
  }
});

export {};
