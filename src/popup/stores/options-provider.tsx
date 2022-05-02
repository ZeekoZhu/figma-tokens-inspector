import React, { PropsWithChildren } from 'react';
import { FigmaOptionsStore } from './figma-options';
import { GitHubOptionsStore } from './github-options';

const githubOptionsStore = new GitHubOptionsStore();
const figmaOptionsStore = new FigmaOptionsStore();

export const OptionsContext = React.createContext<{ githubOptions: GitHubOptionsStore, figmaOptions: FigmaOptionsStore }>(null as any);

export const useOptions = () => {
  return React.useContext(OptionsContext);
};
export const OptionsProvider = ({ children }: PropsWithChildren<{}>) => {
  return <OptionsContext.Provider value={{
    githubOptions: githubOptionsStore,
    figmaOptions: figmaOptionsStore
  }}>
    {children}
  </OptionsContext.Provider>;
};

