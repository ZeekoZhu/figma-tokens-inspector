import * as Figma from 'figma-js';
import { makeAutoObservable, observable, reaction, runInAction } from 'mobx';
import { popup } from '~/logger';
import { FigmaClient } from '../../services';

class DocumentHelper {
  nodeIdMap = new Map<string, Figma.Node>();

  buildNodeIdMap(node: Figma.Node) {
    this.nodeIdMap.set(node.id, node);
    if ('children' in node) {
      for (let child of node.children) {
        this.buildNodeIdMap(child);
      }
    }
  }

  constructor(public doc: Figma.Document) {
    this.buildNodeIdMap(doc);
  }

  getNodeById(id: string) {
    return this.nodeIdMap.get(id);
  }
}


export class FigmaFileManager {
  token?: string;
  fileId?: string;
  document?: Figma.Document;
  loading = false;
  selectedNodeIdList: string[] = [];
  docHelper?: DocumentHelper;


  constructor(private figmaClient: FigmaClient) {
    makeAutoObservable(this, {
      document: observable.ref
    });
    reaction(() => [this.token, this.fileId], async () => {
      await this.loadFile();
    });
  }

  get selectedNodes() {
    if (!this.docHelper) {
      return [];
    }
    return this.selectedNodeIdList.map(id => this.docHelper!.getNodeById(id)!).filter(node => !!node);
  }

  setToken(token: string) {
    this.token = token;
  }

  setFileId(fileId: string) {
    this.fileId = fileId;
    this.document = undefined;
    this.docHelper = undefined;
  }

  selectNodes(nodeIdList: string[]) {
    this.selectedNodeIdList = nodeIdList;
  }

  async loadFile() {
    if (!this.token || !this.fileId) {
      return;
    }
    try {
      runInAction(() => {
        this.loading = true;
      });
      const result = await this.figmaClient.getFile(this.fileId, this.token);
      runInAction(() => {
        this.document = result;
        popup.debug('Plugin data', result);
        this.docHelper = new DocumentHelper(result);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

