import { FigmaBridge } from './events';
import { bridge as log } from './logger';

log.debug('bridge init');

function notifyNodeSelected(nodeIdList: string[]) {
  window.postMessage({
    type: 'figma-bridge:node-selected',
    payload: nodeIdList,
  }, '*');
}

// @ts-ignore
const figma = () => window['figma'];

function waitForFigma() {
  if (figma()) {
    window.postMessage({
      type: FigmaBridge.INITIALIZED,
    });
    // setup figma event listener
    figma().on('selectionchange', () => {
      const selection = figma().currentPage.selection;
      const nodeIdList = selection.map((it: { id: string; }) => it.id);
      notifyNodeSelected(nodeIdList);
    });
  } else {
    setTimeout(waitForFigma, 100);
  }
}

waitForFigma();
