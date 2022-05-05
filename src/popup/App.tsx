import { Container, MantineProvider, Tabs } from '@mantine/core';
import { useEffect } from 'react';
import { ContentScript } from '../events';
import { popup } from '../logger';
import { useAppStyles } from './App.style';
import { InspectorPage } from './pages/inspector';
import { SettingsPage } from './pages/settings/settings-page';
import { OptionsProvider } from './stores';
import {
  connectContentScript,
  ContentScriptMsgHandler
} from './stores/extension-bridge';

const useContentScriptMsg = (handler: ContentScriptMsgHandler) => {
  useEffect(() => {
    return connectContentScript({ onMessage: handler });
  }, [handler]);
};

function App() {
  const { classes } = useAppStyles();
  useContentScriptMsg((msg) => {
    popup.log('[InspectorPage] receive update', msg);
    switch (msg.type) {
      case ContentScript.FILE_OPENED:
        popup.debug('file opened', msg.payload);
        return;
      case ContentScript.NODE_SELECTED:
        popup.debug('node selected', msg.payload);
        return;
    }
  });
  return (
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
  );
}

export default App;
