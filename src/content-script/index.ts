import {
  Observable,
  shareReplay,
  Unsubscribable,
} from 'rxjs';
import { ContentScript, FigmaBridge } from '../events';
import { content as log } from '../logger';
import { ContentScriptMsgTypes } from '~/popup/stores/extension-bridge';

import { observeFigmaBridge } from './bridge-loader';
import { initInspectorWidget } from './inspector-widget';
import { makeAutoObservable } from 'mobx';
import {
  observeFigmaFileChange,
} from '~/content-script/figma-page-utils';
import { watch} from '~/utils/mobx';

type FigmaInspectorState = {
  type: 'open';
  fileId: string;
} | {
  type: 'inspect';
  fileId: string;
  nodeIdList: string[];
} | {
  type: 'close';
};

class FigmaInspector {
  state: FigmaInspectorState = { type: 'close' };
  private disposables: Array<() => void> = [];
  popupOpened = false;

  dispose() {
    this.disposables.forEach(d => d());
  }

  addDisposable(disposable: () => void) {
    this.disposables.push(disposable);
  }

  addUnsubscribe(unsubscribe: Unsubscribable) {
    this.disposables.push(() => unsubscribe.unsubscribe());
  }

  constructor() {
    makeAutoObservable(this);
  }

  init() {
    this.observePage();
    this.addDisposable(watch(
      () => 'fileId' in this.state ? this.state.fileId : null,
      (prevTeardown, fileId) => {
        prevTeardown?.();
        if (!fileId) {
          return;
        }
        const sub = this.startFigmaBridge(fileId);
        const closePopup = this.createPopup();
        return () => {
          sub.unsubscribe();
          closePopup();
        };
      }));
  }

  private createPopup() {
    return initInspectorWidget({
      msg$: this.createPopupMsgStream$(),
      onBootstrap: () => {
        log.debug('popup bootstrap');
        this.togglePopup(true);
      },
    });
  }

  private startFigmaBridge(fileId: string) {
    return observeFigmaBridge().subscribe(event => {
      if (event.type === FigmaBridge.INITIALIZED) {
        this.inspectFile(fileId);
      }
      if (event.type === FigmaBridge.NODE_SELECTED) {
        this.inspectFile(fileId, event.payload);
      }
    });
  }

  private observePage() {
    this.addUnsubscribe(observeFigmaFileChange()
      .subscribe((fileId) => {
        if (fileId) {
          this.openFile(fileId);
        } else {
          this.closeFile();
        }
      }));
  }

  openFile(fileId: string) {
    this.state = { type: 'open', fileId };
  }

  closeFile() {
    this.togglePopup(false);
    this.state = { type: 'close' };
  }

  inspectFile(fileId: string, nodeIdList?: string[]) {
    if (this.state.type === 'close') {
      log.warn('inspector is closed, but inspectFile is called');
    }
    log.debug('inspectFile', fileId, nodeIdList);
    this.state = { type: 'inspect', fileId, nodeIdList: nodeIdList || [] };
  }

  togglePopup(state: boolean) {
    this.popupOpened = state;
  }

  createPopupMsgStream$() {
    return new Observable<ContentScriptMsgTypes>((observer) => {
      const sendMsg = (msg: ContentScriptMsgTypes) => {
        observer.next(msg);
      };

      const dispose1 = watch(() => 'fileId' in this.state ? this.state.fileId : null,
        (_t, fileId) => {
          if (!fileId) {
            return;
          }
          sendMsg({
            type: ContentScript.FILE_OPENED,
            payload: { fileId },
          });
        }, { fireImmediately: true });
      const dispose2 = watch(() => 'nodeIdList' in this.state ? this.state.nodeIdList : [],
        (_t, nodeIdList) => {
          log.debug('what the fuck', nodeIdList);
          sendMsg({
            type: ContentScript.NODE_SELECTED,
            payload: { nodeIdList },
          });
        });
      return () => {
        dispose1();
        dispose2();
      };
    }).pipe(
      shareReplay(1),
    );
  }
}

(() => {
  log.debug('Content script loaded');
  const inspector = new FigmaInspector();
  inspector.init();
})();

