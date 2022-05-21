import * as Figma from 'figma-js';
import { entries } from 'lodash-es';

const TOKEN_BLOCK_LIST = new Set([ 'version', 'hash' ]);

const trimQuotes = (str: string) => str.replace(/^['"]|['"]$/g, '');

export interface InspectorToken {
  name: string;
  value: string;
  source: 'figma-token' | 'figma-style';
}

function getFigmaTokens(node: Figma.Node) {
  console.log('getFigmaTokens', node);
  return entries(node.sharedPluginData?.tokens)
    .filter(([ key, value ]) => value != null && !TOKEN_BLOCK_LIST.has(key))
    .map(([ key, value ]) => ({
      name: key,
      value: trimQuotes(value as string),
      source: 'figma-token',
    } as InspectorToken));
}

export const extractTokens = (node: Figma.Node) => {
  return [
    ...getFigmaTokens(node),
  ];
};
