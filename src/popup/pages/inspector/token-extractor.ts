import * as Figma from 'figma-js';
import { entries } from 'lodash-es';

const TOKEN_BLOCK_LIST = new Set([ 'version', 'hash' ]);

const trimQuotes = (str: string) => str.replace(/^['"]|['"]$/g, '');

function getFigmaTokens(node: Figma.Node) {
  return entries(node.sharedPluginData?.tokens)
    .filter(([ key, value ]) => value != null && !TOKEN_BLOCK_LIST.has(key))
    .map(([ key, value ]) => ({ key, value: trimQuotes(value as string) }));
}

export const extractTokens = (node: Figma.Node) => {
  return [
    ...getFigmaTokens(node),
  ];
};
