import { Group, Loader, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { popup } from '../../../logger';

import { FigmaFileContext } from '../../stores';

export const InspectorPage = observer(() => {
  const figmaFileManager = useContext(FigmaFileContext);
  if (figmaFileManager.loading) {
    return (
      <Group position="center">
        <Loader/>
        <Text>Loading...</Text>
      </Group>
    );
  }
  return (
    <Stack>
      <Text size="md">File Id: {figmaFileManager.fileId}</Text>
      <NodeTokensList/>
    </Stack>
  );
});

const NodeTokensList = observer(() => {
  const figmaFileManager = useContext(FigmaFileContext);
  const nodes = figmaFileManager.selectedNodes;
  popup.debug('nodes', nodes);
  return (
    <Stack>
      {nodes.map((node) =>
        <Text>{JSON.stringify(node.sharedPluginData?.tokens, null, 2)}</Text>)}
    </Stack>
  );
});
