import classnames from 'classnames';
import { useTitleBarStyle } from './title-bar.style';
import { ActionIcon, Group, Text } from '@mantine/core';
import { Icon } from '@iconify/react';
import { useBooleanToggle } from '@mantine/hooks';

export interface TitleBarProps {
  onToggleMinimize?: (value: boolean) => void;
}

export const TitleBar = forwardRef<HTMLDivElement, TitleBarProps>((props,
                                                                   ref) => {
  const { classes } = useTitleBarStyle();
  const [ minimized, toggle ] = useBooleanToggle(false);
  useEffect(() => {
    props.onToggleMinimize?.(minimized);
  }, [ minimized ]);
  return (
    <Group ref={ref}
           position="apart"
           pl={16}
           pr={4}
           className={classnames(classes.root, 'drag-handle', { minimized })}>
      <Text size="xs" className="title-text" color="dark">Token Inspector</Text>
      {minimized ? (
        <ActionIcon onClick={() => toggle()}>
          <Icon icon="tabler:arrows-minimize" />
        </ActionIcon>
      ) : (
        <ActionIcon onClick={() => toggle()}>
          <Icon icon="tabler:arrows-maximize" />
        </ActionIcon>
      )}
    </Group>
  );
});
