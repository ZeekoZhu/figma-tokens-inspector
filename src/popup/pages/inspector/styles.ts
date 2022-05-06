import { createStyles } from '@mantine/core';

export const useInspectorStyles = createStyles((theme) => ({
  tokenList: {
    overflowX: 'hidden',
    overflowY: 'auto',
    '.fti-node-name': {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    '.fti-prop-name': {
      color: theme.colors.gray[5]
    },
    '.fti-token-name': {
      color: theme.colors.gray[9]
    }
  }
}));
