// @ts-ignore magic
import figmaBridge from '~/figma-bridge?script&module';
import { FigmaBridge } from '~/events';
import { content as log } from '~/logger';
import { Observable } from 'rxjs';

export const loadBridgeScript = () => {
  log.info('Loading bridge');
  const script = document.createElement('script');
  script.src = browser.runtime.getURL(figmaBridge);
  script.type = 'module';
  script.async = true;
  document.head.appendChild(script);
};

export const connectToBridge =
  ({
     onInit,
     onNodeSelected,
   }: { onInit: () => void, onNodeSelected: (nodeIdList: string[]) => void }) => {
    window.postMessage({ type: FigmaBridge.INIT }, '*');
    const listener = (event: MessageEvent) => {
      if (event.data.type === FigmaBridge.INITIALIZED) {
        log.debug('Figma bridge initialized');
        onInit();
      }
      if (event.data.type === FigmaBridge.NODE_SELECTED) {
        log.debug('Node selected', event.data.payload);
        onNodeSelected(event.data.payload);
      }
    };
    window.addEventListener('message', listener);
    return function () {
      window.removeEventListener('message', listener);
    };
  };

export type FigmaBridgeEvent = {
  type: typeof FigmaBridge.INITIALIZED,
} | { type: typeof FigmaBridge.NODE_SELECTED, payload: string[] };
export type FigmaBridgeObservable = Observable<FigmaBridgeEvent>;

export const observeFigmaBridge = (): FigmaBridgeObservable => {
  return new Observable(observer => {
    return connectToBridge({
      onInit() {
        observer.next({ type: FigmaBridge.INITIALIZED });
      },
      onNodeSelected(nodeIdList) {
        observer.next({ type: FigmaBridge.NODE_SELECTED, payload: nodeIdList });
      },
    });
  });
};
