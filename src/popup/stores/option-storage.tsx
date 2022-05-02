import OptionsSync from 'webext-options-sync';

export const optionStorage = new OptionsSync(
  {
    defaults: {
      githubOptions: '{}',
      figmaOptions: '{}',
    },
    storageType: 'local',
  }
);
