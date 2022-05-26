import * as Figma from 'figma-js';
import { entries, every } from 'lodash-es';
import { popup } from '~/logger';

import { DocumentHelper, InspectorOptionsType } from '~/popup/stores';

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

const STYLE_TO_TOKEN_NAME = {
  fill: 'fill',
  fills: 'fill',
  stroke: 'stroke',
  text: 'typography',
  effect: 'boxShadow',
  strokes: 'border'
} as Record<string, string>;

function getStyleTokens(
  node: Figma.Node,
  docHelper: DocumentHelper,
  tokens: InspectorToken[],
  {
    showStyles,
    mergeWithTokens,
  }: InspectorOptionsType) {
  let styles: InspectorToken[] = [];
  if (showStyles) {
    styles = getFigmaStyles(node, (id) => docHelper.getStyleById(id)?.name);
  }
  if (mergeWithTokens) {
    styles = styles.filter(s => {
      const tokenName = STYLE_TO_TOKEN_NAME[s.name];
      popup.log('getStyleTokens', s.name, tokenName);
      return !tokenName || every(tokens, t => t.name !== tokenName);
    });
  }
  return styles;
}

export const extractTokens =
  (node: Figma.Node,
   docHelper: DocumentHelper,
   inspectorOptions: InspectorOptionsType): InspectResult => {
    const tokens = getFigmaTokens(node);
    const styles = getStyleTokens(
      node,
      docHelper,
      tokens,
      inspectorOptions);
    return {
      node,
      tokens: tokens,
      styles: styles,
      totalTokens: tokens.length + styles.length,
    };
  };
