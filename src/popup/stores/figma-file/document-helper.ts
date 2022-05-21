import * as Figma from 'figma-js';
import { get } from 'lodash-es';

export class DocumentHelper {
  nodeIdMap = new Map<string, Figma.Node>();

  private buildNodeIdMap(node: Figma.Node) {
    this.nodeIdMap.set(node.id, node);
    if ('children' in node) {
      for (let child of node.children) {
        this.buildNodeIdMap(child);
      }
    }
  }

  constructor(public file: Figma.FileResponse) {
    this.buildNodeIdMap(file.document);
  }

  getNodeById(id: string) {
    return this.nodeIdMap.get(id);
  }

  getStyleById(id: string): Figma.Style | undefined {
    return get(this.file.styles, id);
  }
}
