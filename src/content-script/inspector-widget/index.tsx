import { autorun } from 'mobx';
import { StrictMode } from 'react';

import ReactDOM from 'react-dom/client';
import {
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { popup } from '~/logger';
import { Bootstrap, Services } from '~/popup/bootstrap';
import { FigmaClient, FigmaClientDev } from '~/popup/services';
import App from '~/popup/App';
import {
  FigmaFileManager,
  FigmaOptionsStore,
  GitHubOptionsStore,
} from '~/popup/stores';
import { ContentScriptMsgTypes } from '~/popup/stores/extension-bridge';
import env from '~/env';

export const initInspectorWidget =
  ({
     msg$,
     onBootstrap,
   }: { msg$: Observable<ContentScriptMsgTypes>, onBootstrap: () => void }) => {
    const services: Services = {
      githubOptions: new GitHubOptionsStore(),
      figmaFileManager: new FigmaFileManager(env.isDev ? new FigmaClientDev() : new FigmaClient()),
      figmaOptions: new FigmaOptionsStore(),
    };
    const handleBootstrap = () => {
      const unsub = new Subject<void>();
      msg$.pipe(
        map(it => 'fileId' in it.payload ? it.payload.fileId : null),
        distinctUntilChanged(),
        takeUntil(unsub),
      ).subscribe(fileId => {
        popup.debug('fileId', fileId);
        if (fileId) {
          services.figmaFileManager.setFileId(fileId);
        }
      });
      msg$.pipe(
        map(it => 'nodeIdList' in it.payload ? it.payload.nodeIdList : null),
        takeUntil(unsub),
      ).subscribe(nodeIdList => {
        if (nodeIdList) {
          services.figmaFileManager.selectNodes(nodeIdList);
        }
      });
      onBootstrap();
      const dispose = autorun(() => {
        services.figmaFileManager.setToken(services.figmaOptions.options.pat);
      });
      return () => {
        popup.debug('popup closed');
        dispose();
        unsub.next();
        unsub.complete();
      };
    };
    const inspectorWidget = document.createElement('div');
    inspectorWidget.id = 'inspector-widget';
    document.body.appendChild(inspectorWidget);
    const root = ReactDOM.createRoot(inspectorWidget);
    root.render(<StrictMode>
      <Bootstrap services={services} onBootstrap={handleBootstrap}>
        <App />
      </Bootstrap>
    </StrictMode>);
    return () => {
      root.unmount();
      inspectorWidget.remove();
    };
  };
