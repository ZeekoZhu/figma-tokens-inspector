// @ts-ignore magic
import figmaBridge from '~/figma-bridge?script&module';
import { FigmaBridge } from '~/events';
import { content as log } from '~/logger';
import { Observable } from 'rxjs';

export const loadBridge =
  ({
     onInit,
     onNodeSelected,
   }: { onInit: () => void, onNodeSelected: (nodeIdList: string[]) => void }) => {
    log.info('Loading bridge');
    const script = document.createElement('script');
    script.src = browser.runtime.getURL(figmaBridge);
    script.type = 'module';
    script.async = true;
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
    document.head.appendChild(script);
    log.debug('Bridge script loaded', script.parentElement);

    return function () {
      log.debug('Unloading figma bridge');
      window.removeEventListener('message', listener);
      script.remove();
    };
  };

export type FigmaBridgeEvent = {
  type: typeof FigmaBridge.INITIALIZED,
} | { type: typeof FigmaBridge.NODE_SELECTED, payload: string[] };
export type FigmaBridgeObservable = Observable<FigmaBridgeEvent>;

export const observeFigmaBridge = (): FigmaBridgeObservable => {
  return new Observable(observer => {
    return loadBridge({
      onInit() {
        observer.next({ type: FigmaBridge.INITIALIZED });
      },
      onNodeSelected(nodeIdList) {
        observer.next({ type: FigmaBridge.NODE_SELECTED, payload: nodeIdList });
      },
    });
  });
};
