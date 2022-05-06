import {
  MantineProvider,
  Paper,
  Tabs
} from '@mantine/core';
import classnames from 'classnames';
import Draggable from 'react-draggable';
import { useAppStyles } from './App.style';
import { InspectorPage } from './pages/inspector';
import { SettingsPage } from './pages/settings/settings-page';

function App() {
  const { classes } = useAppStyles();
  return (
    <MantineProvider>
      <Draggable handle=".drag-handle" bounds="body">
        <Paper className={classes.root} shadow="md">
          <TitleBar/>
          <Tabs grow>
            <Tabs.Tab label="Inspect">
              <InspectorPage/>
            </Tabs.Tab>
            <Tabs.Tab label="Settings">
              <SettingsPage/>
            </Tabs.Tab>
          </Tabs>
        </Paper>
      </Draggable>
    </MantineProvider>
  );
}

const TitleBar = () => {
  const { classes } = useAppStyles();
  return (
    <div className={classnames(classes.titleBar, 'drag-handle')}></div>
  );
};

export default App;
