import { autorun } from 'mobx';
import { StrictMode } from 'react';

import ReactDOM from 'react-dom/client';
import { Observable } from 'rxjs';
import { ContentScript } from '../../events';
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
      const sub = msg$.subscribe(msg => {
        switch (msg.type) {
          case ContentScript.FILE_OPENED:
            popup.debug('file opened', msg.payload);
            services.figmaFileManager.setFileId(msg.payload.fileId);
            return;
          case ContentScript.NODE_SELECTED:
            popup.debug('node selected', msg.payload);
            services.figmaFileManager.selectNodes(msg.payload.nodeIdList);
            return;
        }
      });
      onBootstrap();
      const dispose = autorun(() => {
        services.figmaFileManager.setToken(services.figmaOptions.options.pat);
      });
      return () => {
        dispose();
        sub.unsubscribe();
      };
    };
    const inspectorWidget = document.createElement('div');
    inspectorWidget.id = 'inspector-widget';
    document.body.appendChild(inspectorWidget);
    ReactDOM.createRoot(inspectorWidget).render(<StrictMode>
      <Bootstrap services={services} onBootstrap={handleBootstrap}>
        <App />
      </Bootstrap>
    </StrictMode>);
  };
