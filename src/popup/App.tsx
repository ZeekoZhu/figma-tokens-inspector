import { Container, MantineProvider, Tabs } from '@mantine/core';
import { useAppStyles } from './App.style';
import { SettingsPage } from './pages/settings/settings-page';
import { OptionsProvider } from './stores';

function App() {
  const { classes } = useAppStyles();
  return (
    <OptionsProvider>
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
    </OptionsProvider>
  )
}

export default App;
