import { createStyles } from '@mantine/core';

export const useAppStyles = createStyles(() => ({
  root: {
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
    '.mantine-Paper-root': {
      width: '300px',
      minHeight: '500px',
    },
  },
}));
