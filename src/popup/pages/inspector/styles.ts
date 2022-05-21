import { createStyles } from '@mantine/core';

export const useInspectorStyles = createStyles((theme) => ({
  tokenList: {
    overflowX: 'hidden',
    overflowY: 'auto',
    maxHeight: '400px',
    '.fti-node': {
      '&:not(:last-child)': {
        paddingBottom: theme.spacing.md,
        borderBottom: `1px solid ${theme.colors.gray[1]}`,
      },
    },
    '.fti-node-name': {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    '.fti-prop-name': {
      width: '100px',
      fontFamily: theme.fontFamilyMonospace,
      color: theme.colors.gray[5],
      fontSize: theme.fontSizes.xs,
    },
    '.fti-token-name': {
      fontFamily: theme.fontFamilyMonospace,
      color: theme.colors.gray[9],
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
}));

export const useDocumentStatusBarStyles = createStyles((theme) => ({
  label: {
    color: theme.colors.gray[5],
  },
}));
