import { Group, Loader, Stack, Text } from '@mantine/core';
import classnames from 'classnames';
import * as Figma from 'figma-js';
import { entries } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { popup } from '../../../logger';
import { useService } from '../../bootstrap';
import { useInspectorStyles } from './styles';

export const InspectorPage = observer(() => {
  const figmaFileManager = useService('figmaFileManager');
  if (figmaFileManager.loading) {
    return (
      <Group position="center" px={16}>
        <Loader/>
        <Text>Loading...</Text>
      </Group>
    );
  }
  return (
    <Stack mb={16}>
      <Text size="md">File Id: {figmaFileManager.fileId}</Text>
      <NodeTokensList/>
    </Stack>
  );
});

const NodeTokensList = observer(() => {
  const { classes, theme } = useInspectorStyles();
  const figmaFileManager = useService('figmaFileManager');
  const nodes = figmaFileManager.selectedNodes;
  popup.debug('nodes', nodes);
  return (
    <Stack className={classnames(classes.tokenList, 'fti-node-list')}
           px={theme.spacing.md}>
      {nodes.map((node) =>
        <NodeTokensPreview {...node} />)}
    </Stack>
  );
});

const NodeTokensPreview = (node: Figma.Node) => {
  const tokens = entries(node.sharedPluginData?.tokens).filter(([key, value]) => value !== undefined && key !== 'version');
  if (tokens.length === 0) {
    return null;
  }
  return (
    <Stack spacing={4} className="fti-node">
      <Text size="xs" className="fti-node-name"
            title={node.name}>{node.name}</Text>
      {tokens.map(([key, value]) =>
        <DesignTokenPreview value={value as any} nodeProp={key} key={key}/>)}
    </Stack>
  );
};

const DesignTokenPreview =
  ({
     nodeProp,
     value
   }: { nodeProp: string, value: string }) => {
    return (
      <Group spacing={8}>
        <Text size="sm" className="fti-prop-name">{nodeProp}:</Text>
        <Text size="sm" className="fti-token-name">{value}</Text>
      </Group>
    );
  };
