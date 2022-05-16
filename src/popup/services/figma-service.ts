import * as Figma from 'figma-js';
import * as localforage from 'localforage';

export class InternalFigmaClient {
  async getFile(fileId: string, token: string): Promise<Figma.Document> {
    const client = Figma.Client({
      personalAccessToken: token,
    });
    const resp = await client.file(fileId, {
      plugin_data: 'shared',
    });
    return resp.data.document;
  }
}

export interface IFigmaClient {
  getFile(fileId: string, token: string): Promise<Figma.Document>;

  cleanCache(): Promise<void>;
}

export class FigmaClient implements IFigmaClient {
  impl: InternalFigmaClient = new InternalFigmaClient();

  async getFile(fileId: string, token: string): Promise<Figma.Document> {
    const result = await localforage.getItem(`fti:${token}:${fileId}`) as Figma.Document;
    if (result) {
      return result;
    }
    const file = await this.impl.getFile(fileId, token);
    await localforage.setItem(`fti:${token}:${fileId}`, file);
    return file;
  }

  async cleanCache() {
    const keys = await localforage.keys();
    const tasks = keys.filter(it => it.startsWith('fti:'))
      .map(it => localforage.removeItem(it));
    await Promise.all(tasks);
  }
}
