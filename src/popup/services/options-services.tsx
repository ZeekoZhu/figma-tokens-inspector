import { makeAutoObservable, reaction } from 'mobx';
import React, { PropsWithChildren } from 'react';
import OptionsSync from 'webext-options-sync';

type GitHubOptionsType = { repoOwner: string; repoName: string; filePath: string; githubPat: string; branch: string };
const DEFAULT_GITHUB: GitHubOptionsType = {
  githubPat: '',
  repoOwner: '',
  repoName: '',
  filePath: '',
  branch: '',
};
const optionStorage = new OptionsSync(
  {
    defaults: {
      githubOptions: JSON.stringify(DEFAULT_GITHUB)
    },
    storageType: 'local',
  }
);

class GitHubOptionsStore {
  options: GitHubOptionsType = DEFAULT_GITHUB;
  updateOptions = (options: GitHubOptionsType) => {
    this.options = options;
  }

  constructor() {
    makeAutoObservable(this);
    reaction(() => this.options, () => {
      optionStorage.set({ githubOptions: JSON.stringify(this.options) });
    }, { fireImmediately: false });
  }
}

export const OptionsContext = React.createContext<{ githubOptions: GitHubOptionsStore }>(null as any);

export const useOptions = () => {
  return React.useContext(OptionsContext);
};

const githubOptionsStore = new GitHubOptionsStore();
export const OptionsProvider = ({ children }: PropsWithChildren<{}>) => {
  return <OptionsContext.Provider value={{ githubOptions: githubOptionsStore }}>
    {children}
  </OptionsContext.Provider>;
};
