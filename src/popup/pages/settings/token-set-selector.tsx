import { Icon } from '@iconify/react';
import { ActionIcon, Group, Text } from '@mantine/core';

export const TokenSetSelector = () => {
  return (
    <Group position="apart">
      <Text size="sm">Last Update: 3 hours ago</Text>
      <ActionIcon variant="default" title="Download Tokens" size="sm">
        <Icon icon="tabler:cloud-download" fontSize={12} />
      </ActionIcon>
    </Group>
  );
};
