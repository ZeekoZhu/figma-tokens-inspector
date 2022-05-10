import { createStyles } from '@mantine/core';

export const useTitleBarStyle = createStyles((theme) => ({
  root: {
    cursor: 'move',
    height: '32px',
    borderBottom: `1px solid ${theme.colors.gray[2]}`,
    '.title-text': {
      fontWeight: 'bold',
    },
    '&.minimized': {
      borderBottom: 'none',
    }
  },
}));
