import * as Figma from 'figma-js';
import * as localforage from 'localforage';

interface IFigmaService {
  getFile(fileId: string, token: string): Promise<Figma.Document>;
}

export class FigmaClient implements IFigmaService {
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

export class FigmaClientDev {
  impl: FigmaClient = new FigmaClient();

  async getFile(fileId: string, token: string): Promise<Figma.Document> {
    const result = await localforage.getItem(`fti:${token}:${fileId}`) as Figma.Document;
    if (result) {
      return result;
    }
    const file = await this.impl.getFile(fileId, token);
    await localforage.setItem(`fti:${token}:${fileId}`, file);
    return file;
  }
}
