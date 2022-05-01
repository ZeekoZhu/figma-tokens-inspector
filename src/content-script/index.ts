import { content as log } from '../logger';
import { loadBridge } from './bridge-loader';

log.debug('Content script loaded');

loadBridge()
document.addEventListener('click', () => {
  log.debug('Click event');
})

export {};
