import { Icon } from '@iconify/react';
import { ActionIcon, Group, Loader, Stack, Text } from '@mantine/core';
import classnames from 'classnames';
import * as Figma from 'figma-js';
import { observer } from 'mobx-react-lite';

import { popup } from '~/logger';
import { useService } from '~/popup/bootstrap';

import { useDocumentStatusBarStyles, useInspectorStyles } from './styles';
import { useRafInterval, useUpdate } from 'ahooks';
import dayjs from 'dayjs/esm';
import relativeTime from 'dayjs/esm/plugin/relativeTime';
import { extractTokens } from '~/popup/pages/inspector/token-extractor';

dayjs.extend(relativeTime);

export const InspectorPage = observer(() => {
  const figmaFileManager = useService('figmaFileManager');
  if (figmaFileManager.fileId == null) {
    return (
      <Group position="center" px={16}>
        <Text>Waiting for Figma ready...</Text>
      </Group>
    );
  }
  if (figmaFileManager.loading && !figmaFileManager.isReady) {
    return (
      <Group position="center" px={16}>
        <Loader />
        <Text>Loading current file...</Text>
      </Group>
    );
  }
  return <Stack>
    <DocumentStatusBar />
    <DocumentInspector />
  </Stack>;
});

const DocumentStatusBar = observer(() => {
  const figmaFileManager = useService('figmaFileManager');
  const { classes } = useDocumentStatusBarStyles();
  const update = useUpdate();
  useRafInterval(() => {
    update();
  }, 1000 * 60);
  const lastUpdate = figmaFileManager.lastUpdateTime
    ? `Tokens fetched at ${dayjs(figmaFileManager.lastUpdateTime).fromNow()}`
    : 'Click the button right to fetch tokens';
  if (!figmaFileManager.isReady) {
    return null;
  }
  return (<Group position="apart" px={16}>
    <Text className={classes.label} size="xs">{lastUpdate}</Text>
    {figmaFileManager.loading ?
      <Loader size="xs" /> :
      <ActionIcon size="xs" onClick={() => figmaFileManager.reload()}>
        <Icon fontSize={12} icon="tabler:cloud-download" />
      </ActionIcon>}
  </Group>);
});

const DocumentInspector = observer(() => {
  const figmaFileManager = useService('figmaFileManager');

  if (figmaFileManager.noToken) {
    return (
      <Group position="center" px={16}>
        <Text>Please click "Settings" tab to setup Figma Access Token</Text>
      </Group>
    );
  }

  if (figmaFileManager.selectedNodeIdList.length === 0) {
    return (
      <Group position="center" px={16}>
        <Text>Select node in Figma canvas to inspect Design Token</Text>
      </Group>
    );
  }
  if (figmaFileManager.selectedNodes.flatMap(extractTokens).length === 0) {
    return (
      <Group position="center" px={16}>
        <Text>No token found in selected nodes</Text>
      </Group>
    );
  }
  return (
    <Stack mb={16}>
      <NodeTokensList />
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
        <NodeTokensPreview key={node.id} {...node} />)}
    </Stack>
  );
});

const NodeTokensPreview = (node: Figma.Node) => {
  const tokens = extractTokens(node);
  if (tokens.length === 0) {
    return null;
  }
  return (
    <Stack spacing={4} className="fti-node">
      <Text size="xs" className="fti-node-name"
            title={node.name}>{node.name}</Text>
      {tokens.map(({ key, value }) =>
        <DesignTokenPreview value={value as any} nodeProp={key} key={key} />)}
    </Stack>
  );
};

const DesignTokenPreview =
  ({
     nodeProp,
     value,
   }: { nodeProp: string, value: string }) => {
    return (
      <Stack spacing={0}>
        <Text size="xs" className="fti-prop-name">{nodeProp}</Text>
        <Text size="xs" className="fti-token-name">{value}</Text>
      </Stack>
    );
  };
