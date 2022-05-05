import { Container, MantineProvider, Tabs } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ContentScript } from '../events';
import { popup } from '../logger';
import { useAppStyles } from './App.style';
import { InspectorPage } from './pages/inspector';
import { SettingsPage } from './pages/settings/settings-page';
import { FigmaFileContext, OptionsProvider } from './stores';
import {
  createConnector,
  ContentScriptMsgHandler, ContentScriptMsgTypes
} from './stores/extension-bridge';
import { FigmaFileManager } from './stores';

const useContentScriptMsg = (handler: ContentScriptMsgHandler) => {
  const [connector, setConnector] = useState<Awaited<ReturnType<typeof createConnector>>>();
  useEffect(() => {
    (async () => {
      const newConnector = await createConnector();
      setConnector(prev => {
        prev?.port?.disconnect();
        return newConnector;
      });
    })();
  }, []);
  useEffect(() => {
    if (connector && handler) {
      return connector.connectContentScript({ onMessage: handler });
    }
  }, [handler, connector]);
};

const useSingleton = <T, >(factory: () => T) => {
  const ref = useRef<T>();
  if (!ref.current) {
    ref.current = factory();
  }
  return ref.current!;
};

function App() {
  const { classes } = useAppStyles();
  const figmaFileManager = useSingleton(() => new FigmaFileManager());
  const onMessage = useCallback((msg: ContentScriptMsgTypes) => {
    switch (msg.type) {
      case ContentScript.FILE_OPENED:
        popup.debug('file opened', msg.payload);
        figmaFileManager.fileId = msg.payload.fileId;
        return;
      case ContentScript.NODE_SELECTED:
        popup.debug('node selected', msg.payload);
        return;
    }
  }, []);
  useContentScriptMsg(onMessage);
  return (
    <FigmaFileContext.Provider value={figmaFileManager}>
      <OptionsProvider>
        <MantineProvider>
          <Container className={classes.root}>
            <Tabs grow>
              <Tabs.Tab label="Inspect">
                <InspectorPage/>
              </Tabs.Tab>
              <Tabs.Tab label="Settings">
                <SettingsPage/>
              </Tabs.Tab>
            </Tabs>
          </Container>
        </MantineProvider>
      </OptionsProvider>
    </FigmaFileContext.Provider>
  );
}

export default App;
