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

function* getSelfAndChildren(node: any): Generator<any, any, any> {
  yield node;
  if (!node.children) {
    return;
  }
  for (const child of node.children) {
    yield* getSelfAndChildren(child);
  }
}

function waitForFigma() {
  if (figma()) {
    window.postMessage({
      type: FigmaBridge.INITIALIZED,
    });
    // setup figma event listener
    figma().on('selectionchange', () => {
      const selection = figma().currentPage.selection;
      log.debug('selectionchange', selection);
      const nodeList = selection.flatMap((node: any) => {
        return Array.from(getSelfAndChildren(node));
      });
      const nodeIdList = nodeList.map((it: { id: string; }) => it.id);
      notifyNodeSelected(nodeIdList);
    });
  } else {
    setTimeout(waitForFigma, 100);
  }
}

waitForFigma();
