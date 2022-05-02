import { Container, MantineProvider, Tabs } from '@mantine/core';
import { useAppStyles } from './App.style';

function App() {
  const { classes } = useAppStyles();
  return (
    <MantineProvider>
      <Container className={classes.root}>
        <Tabs>
          <Tabs.Tab label="Inspect"></Tabs.Tab>
          <Tabs.Tab label="Settings"></Tabs.Tab>
        </Tabs>
      </Container>
    </MantineProvider>
  )
}

export default App;
