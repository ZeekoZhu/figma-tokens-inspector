import classnames from 'classnames';
import { useTitleBarStyle } from './title-bar.style';
import { Group, Text } from '@mantine/core';

export const TitleBar = forwardRef<HTMLDivElement>(({}, ref) => {
  const { classes } = useTitleBarStyle();
  return (
    <Group ref={ref} position="apart" px={16} className={classnames(classes.root, 'drag-handle')}>
      <Text size="xs" className="title-text" color="dark">Token Inspector</Text>
    </Group>
  );
});
