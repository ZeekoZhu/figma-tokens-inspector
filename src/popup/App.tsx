import { MantineProvider, Paper, Tabs } from '@mantine/core';
import Draggable from 'react-draggable';
import { useAppStyles } from './App.style';
import { InspectorPage } from './pages/inspector';
import { SettingsPage } from './pages/settings/settings-page';
import { WheelEventHandler } from 'react';
import { TitleBar } from '~/popup/components/title-bar';
import { useSetState, useViewportSize } from '@mantine/hooks';
import classnames from 'classnames';

function App() {
  const { classes } = useAppStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const handleWheel = useCallback<WheelEventHandler>((event) => {
    event.stopPropagation();
  }, []);
  const [ state, setState ] = useSetState({ minimized: false });
  const classNames = classnames(
    classes.root,
    {
      [classes.minimized]: state.minimized,
      [classes.maximized]: !state.minimized,
    },
  );
  const { width } = useViewportSize();
  return (
    <MantineProvider>
      <Draggable
        defaultPosition={{ x: width - 300, y: 48 }}
        handle=".drag-handle"
        bounds="body"
        nodeRef={containerRef}>
        <div ref={containerRef}
             className={classNames}
             onWheel={handleWheel}>
          <Paper shadow="md">
            <TitleBar onToggleMinimize={val => setState({ minimized: val })} />
            <Tabs grow className="fti-content">
              <Tabs.Tab label="Inspect">
                <InspectorPage />
              </Tabs.Tab>
              <Tabs.Tab label="Settings">
                <SettingsPage />
              </Tabs.Tab>
            </Tabs>
          </Paper>
        </div>
      </Draggable>
    </MantineProvider>
  );
}

export default App;
