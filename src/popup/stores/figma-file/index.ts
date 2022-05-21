import * as Figma from 'figma-js';
import {
  action,
  makeAutoObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx';

import { popup } from '~/logger';
import { IFigmaClient } from '../../services';
import { get } from 'lodash-es';

class DocumentHelper {
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

export class FigmaFileManager {
  authToken?: string;
  fileId?: string;
  loading = false;
  selectedNodeIdList: string[] = [];
  docHelper?: DocumentHelper;
  lastUpdateTime?: number;

  get noToken() {
    return !this.authToken;
  }

  get isReady() {
    return this.docHelper != null;
  }

  constructor(private figmaClient: IFigmaClient) {
    makeAutoObservable(this, {
      setToken: action,
      docHelper: observable.ref,
    });
    reaction(() => [ this.authToken, this.fileId ], async () => {
      await this.loadFile();
    });
  }

  get selectedNodes() {
    if (!this.docHelper) {
      return [];
    }
    return this.selectedNodeIdList.map(id => this.docHelper!.getNodeById(id)!)
      .filter(node => !!node);
  }

  setToken(token: string) {
    this.authToken = token;
  }

  setFileId(fileId: string) {
    popup.debug(`setFileId: ${fileId}`);
    this.fileId = fileId;
    this.docHelper = undefined;
  }

  selectNodes(nodeIdList: string[]) {
    popup.debug('selectNodes', nodeIdList);
    this.selectedNodeIdList = nodeIdList;
  }

  async loadFile() {
    if (!this.authToken || !this.fileId) {
      return;
    }
    try {
      runInAction(() => {
        this.loading = true;
      });
      const result = await this.figmaClient.getFile(this.fileId,
        this.authToken);
      runInAction(() => {
        this.lastUpdateTime = result.cacheTime;
        popup.debug('Plugin data', result);
        this.docHelper = new DocumentHelper(result.file);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async reload() {
    if (!this.fileId) {
      return;
    }
    await this.figmaClient.cleanCache();
    await this.loadFile();
  }
}

