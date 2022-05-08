import {
  MantineProvider,
  Paper,
  Tabs,
} from '@mantine/core';
import classnames from 'classnames';
import Draggable from 'react-draggable';
import { useAppStyles } from './App.style';
import { InspectorPage } from './pages/inspector';
import { SettingsPage } from './pages/settings/settings-page';
import { WheelEventHandler } from 'react';

function App() {
  const { classes } = useAppStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const handleWheel = useCallback<WheelEventHandler>((event) => {
    event.stopPropagation();
  }, []);
  return (
    <MantineProvider>
      <Draggable handle=".drag-handle" bounds="body" nodeRef={containerRef}>
        <div ref={containerRef} className={classes.root} onWheel={handleWheel}>
          <Paper shadow="md">
            <TitleBar />
            <Tabs grow>
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

const TitleBar = forwardRef<HTMLDivElement>(({}, ref) => {
  const { classes } = useAppStyles();
  return (
    <div ref={ref} className={classnames(classes.titleBar, 'drag-handle')}></div>
  );
});

export default App;
