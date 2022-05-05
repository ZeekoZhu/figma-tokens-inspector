import { Client, Document } from 'figma-js';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { createContext } from 'react';

export class FigmaFileManager {
  token?: string;
  fileId?: string;
  document?: Document;
  loading = false;

  constructor() {
    makeAutoObservable(this);
    reaction(() => [this.token, this.fileId], async () => {
      await this.loadFile();
    });
  }

  setToken(token: string) {
    this.token = token;
  }

  setFileId(fileId: string) {
    this.fileId = fileId;
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
      const result = await client.file(this.fileId!);
      runInAction(() => {
        this.document = result.data.document;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const FigmaFileContext = createContext(null as any as FigmaFileManager);
