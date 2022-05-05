import React from 'react';
import { FigmaOptionsStore } from './figma-options';
import { GitHubOptionsStore } from './github-options';

export const OptionsContext = React.createContext<{ githubOptions: GitHubOptionsStore, figmaOptions: FigmaOptionsStore }>(null as any);

export const useOptions = () => {
  return React.useContext(OptionsContext);
};
