import { makeAutoObservable, reaction } from 'mobx';
import React from 'react';
import * as Yup from 'yup';
import { optionStorage } from './option-storage';
import { GitHubOptionsType } from './types';

export const schema = Yup.object().shape({
  githubPat: Yup.string().required().default(''),
  repoOwner: Yup.string().required().default(''),
  repoName: Yup.string().required().default(''),
  filePath: Yup.string().required().default(''),
  branch: Yup.string().default('master'),
});

export class GitHubOptionsStore {
  static schema = schema;
  static default = schema.getDefault();
  options: GitHubOptionsType = GitHubOptionsStore.default;

  get isValid() {
    return GitHubOptionsStore.schema.isValidSync(this.options);
  }

  updateOptions = (options: GitHubOptionsType) => {
    this.options = options;
  }

  constructor() {
    makeAutoObservable(this);
    (async () => {
      const { githubOptions } = await optionStorage.getAll();
      try {
        this.updateOptions(JSON.parse(githubOptions));
      } catch (e) {
        // ignore error
      }
    })();
    reaction(() => this.options, () => {
      void optionStorage.set({ githubOptions: JSON.stringify(this.options) });
    }, { fireImmediately: false });
  }
}

