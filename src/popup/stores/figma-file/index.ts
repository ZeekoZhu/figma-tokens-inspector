import { Client, Document } from 'figma-js';
import { makeAutoObservable, runInAction } from 'mobx';


export class FigmaFileManager {
  token?: string;
  document?: Document;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadFile(id: string) {
    const client = Client({
      personalAccessToken: this.token,
    });
    try {
      runInAction(() => {
        this.loading = true;
      });
      const result = await client.file(id);
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
