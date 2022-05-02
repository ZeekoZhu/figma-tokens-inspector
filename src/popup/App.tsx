import { Container, MantineProvider, Tabs } from '@mantine/core';
import { useAppStyles } from './App.style';
import { SettingsPage } from './pages/settings/settings-page';

function App() {
  const { classes } = useAppStyles();
  return (
    <MantineProvider>
      <Container className={classes.root}>
        <Tabs grow>
          <Tabs.Tab label="Inspect"></Tabs.Tab>
          <Tabs.Tab label="Settings">
            <SettingsPage/>
          </Tabs.Tab>
        </Tabs>
      </Container>
    </MantineProvider>
  )
}

export default App;
