import { createStyles } from '@mantine/core';

export const useAppStyles = createStyles(() => ({
  root: {
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  minimized: {
    '.mantine-Paper-root': {
      width: '300px',
    },
    '.fti-content': {
      display: 'none',
    }
  },
  maximized: {
    '.mantine-Paper-root': {
      width: '300px',
      minHeight: '500px',
    },
  }
}));
