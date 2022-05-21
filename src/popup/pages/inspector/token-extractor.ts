import * as Figma from 'figma-js';
import { entries } from 'lodash-es';
import { popup } from '~/logger';

import { DocumentHelper } from '~/popup/stores';

const TOKEN_BLOCK_LIST = new Set([ 'version', 'hash' ]);

const trimQuotes = (str: string) => str.replace(/^['"]|['"]$/g, '');

export interface InspectorToken {
  name: string;
  value: string;
  source: 'figma-token' | 'figma-style';
}

export interface InspectResult {
  node: Figma.Node;
  tokens: InspectorToken[];
  styles: InspectorToken[];
  totalTokens: number;
}

function getFigmaTokens(node: Figma.Node) {
  return entries(node.sharedPluginData?.tokens)
    .filter(([ key, value ]) => value != null && !TOKEN_BLOCK_LIST.has(key))
    .map(([ key, value ]) => ({
      name: key,
      value: trimQuotes(value as string),
      source: 'figma-token',
    } as InspectorToken));
}

function getFigmaStyles(
  node: Figma.Node,
  getStyleName: (id: string) => string | undefined) {
  popup.log('getFigmaStyles', node.id);
  if ('styles' in node) {
    return entries(node.styles)
      .map(([ key, value ]) => ({
        name: key,
        value: getStyleName(value) || `unknown style: ${key}`,
        source: 'figma-style',
      } as InspectorToken));
  }
  return [];
}

export const extractTokens =
  (node: Figma.Node,
   docHelper: DocumentHelper): InspectResult => {
    const tokens = getFigmaTokens(node);
    const styles = getFigmaStyles(node, (id) => docHelper.getStyleById(id)?.name);
    return {
      node,
      tokens: tokens,
      styles: styles,
      totalTokens: tokens.length + styles.length,
    };
  };
