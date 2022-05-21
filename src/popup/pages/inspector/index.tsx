import { Icon } from '@iconify/react';
import { ActionIcon, Group, Loader, Stack, Text } from '@mantine/core';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { useService } from '~/popup/bootstrap';

import { useDocumentStatusBarStyles, useInspectorStyles } from './styles';
import { useRafInterval, useUpdate } from 'ahooks';
import dayjs from 'dayjs/esm';
import relativeTime from 'dayjs/esm/plugin/relativeTime';
import {
  extractTokens, InspectorToken,
  InspectResult,
} from '~/popup/pages/inspector/token-extractor';
import { concat, sumBy } from 'lodash-es';

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

  const nodeList = figmaFileManager.selectedNodes.map(it =>
    extractTokens(it, figmaFileManager.docHelper!));

  if (sumBy(nodeList, 'totalTokens') === 0) {
    return (
      <Group position="center" px={16}>
        <Text>No token found in selected nodes</Text>
      </Group>
    );
  }
  return (
    <Stack mb={16}>
      <NodeTokensList nodeList={nodeList} />
    </Stack>
  );
});

const NodeTokensList = observer(({ nodeList }: { nodeList: InspectResult[] }) => {
  const { classes, theme } = useInspectorStyles();
  return (
    <Stack className={classnames(classes.tokenList, 'fti-node-list')}
           px={theme.spacing.md}>
      {nodeList.map((result) =>
        <NodeTokensPreview key={result.node.id} result={result} />)}
    </Stack>
  );
});

const NodeTokensPreview = ({ result }: { result: InspectResult }) => {
  const { tokens, styles, totalTokens, node } = result;
  if (totalTokens === 0) {
    return null;
  }
  return (
    <Stack spacing={4} className="fti-node">
      <Text size="xs" className="fti-node-name"
            title={node.name}>{node.name}</Text>
      {concat(tokens, styles).map(({ name, value, source }) =>
        <DesignTokenPreview
          value={value as any}
          name={name}
          source={source}
          key={name + source} />)}
    </Stack>
  );
};

const DesignTokenPreview =
  ({
     name,
     value,
     source,
   }: InspectorToken) => {
    return (
      <Stack spacing={0} title={source}>
        <Group position="left" spacing="xs" className="fti-prop-name" noWrap>
          <Icon icon={source === 'figma-token' ? 'clarity:plugin-line' : 'ph:figma-logo'} />
          <Text size="xs">{name}</Text>
        </Group>
        <Text size="xs" className="fti-token-name">{value}</Text>
      </Stack>
    );
  };
