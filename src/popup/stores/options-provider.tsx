import React, { PropsWithChildren } from 'react';
import { GitHubOptionsStore } from './github-options';

const githubOptionsStore = new GitHubOptionsStore();

export const OptionsContext = React.createContext<{ githubOptions: GitHubOptionsStore }>(null as any);

export const useOptions = () => {
  return React.useContext(OptionsContext);
};
export const OptionsProvider = ({ children }: PropsWithChildren<{}>) => {
  return <OptionsContext.Provider value={{ githubOptions: githubOptionsStore }}>
    {children}
  </OptionsContext.Provider>;
};

