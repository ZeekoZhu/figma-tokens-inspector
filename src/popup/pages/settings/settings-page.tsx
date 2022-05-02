import { Accordion } from '@mantine/core';
import { GitHubProviderSettings } from './github-provider-settings';

export const SettingsPage = () => {
  return (
    <Accordion iconPosition="right">
      <Accordion.Item label="Setup GitHub Provider">
        <GitHubProviderSettings/>
      </Accordion.Item>
      <Accordion.Item label="Select Token Set">
      </Accordion.Item>
    </Accordion>
  )
};
