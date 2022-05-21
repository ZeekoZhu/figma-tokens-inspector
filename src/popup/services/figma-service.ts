import * as Figma from 'figma-js';
import * as localforage from 'localforage';

export class InternalFigmaClient {
  async getFile(fileId: string, token: string): Promise<Figma.FileResponse> {
    const client = Figma.Client({
      personalAccessToken: token,
    });
    const resp = await client.file(fileId, {
      plugin_data: 'shared',
    });
    return resp.data;
  }
}

const CacheVersion = '2';

export interface CachedDocument {
  fileId: string;
  file: Figma.FileResponse;
  cacheTime: number;
  version: typeof CacheVersion;
}

export interface IFigmaClient {
  getFile(fileId: string, token: string): Promise<CachedDocument>;

  cleanCache(): Promise<void>;
}

export class FigmaClient implements IFigmaClient {
  impl: InternalFigmaClient = new InternalFigmaClient();

  async getFile(fileId: string, token: string): Promise<CachedDocument> {
    const result = await localforage.getItem(`fti:${token}:${fileId}`) as CachedDocument;
    if (result && result.version === CacheVersion) {
      return result;
    }
    const file = await this.impl.getFile(fileId, token);
    const cached = {
      fileId,
      file,
      cacheTime: Date.now(),
      version: CacheVersion,
    } as const;
    await localforage.setItem(`fti:${token}:${fileId}`, cached);
    return cached;
  }

  async cleanCache() {
    const keys = await localforage.keys();
    const tasks = keys.filter(it => it.startsWith('fti:'))
      .map(it => localforage.removeItem(it));
    await Promise.all(tasks);
  }
}
