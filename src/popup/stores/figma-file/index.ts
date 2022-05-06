import * as Figma from 'figma-js';
import { Client } from 'figma-js';
import { makeAutoObservable, observable, reaction, runInAction } from 'mobx';
import { popup } from '../../../logger';

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


  constructor() {
    makeAutoObservable(this, {
      document: observable.ref
    });
    reaction(() => [this.token, this.fileId], async () => {
      await this.loadFile();
    });
  }

  get selectedNodes() {
    if(!this.docHelper) {
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
    const client = Client({
      personalAccessToken: this.token,
    });
    try {
      runInAction(() => {
        this.loading = true;
      });
      const result = await client.file(this.fileId!, {
        plugin_data: 'shared'
      });
      runInAction(() => {
        this.document = result.data.document;
        popup.debug('Plugin data', result.data);
        this.docHelper = new DocumentHelper(result.data.document);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

