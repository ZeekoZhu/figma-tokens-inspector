import { Accordion } from '@mantine/core';
import { GitHubProviderSettings } from './github-provider-settings';
import { TokenSetSelector } from './token-set-selector';

export const SettingsPage = () => {
  return (
    <Accordion iconPosition="right">
      <Accordion.Item label="Setup GitHub Provider">
        <GitHubProviderSettings/>
      </Accordion.Item>
      <Accordion.Item label="Select Token Set">
        <TokenSetSelector />
      </Accordion.Item>
    </Accordion>
  )
};
