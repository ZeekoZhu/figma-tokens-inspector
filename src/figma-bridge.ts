import { bridge as log } from './logger';

log.debug('bridge init');

function notifyNodeSelected(nodeIdList: string[]) {
  window.postMessage({
    type: 'figma-bridge:node-selected',
    payload: nodeIdList,
  }, '*');
}

document.addEventListener('click', () => {
  notifyNodeSelected([]);
});
