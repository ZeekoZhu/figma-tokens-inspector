import { Accordion } from '@mantine/core';
import { FigmaSettings } from './figma-settings';
import { GitHubProviderSettings } from './github-provider-settings';
import { TokenSetSelector } from './token-set-selector';
import env from '~/env';

export const SettingsPage = () => {
  return (
    <Accordion iconPosition="right">
      <Accordion.Item label="Connect to Figma">
        <FigmaSettings />
      </Accordion.Item>
      {env.tokenPreview && (
        <>
          <Accordion.Item label="Setup GitHub Provider">
            <GitHubProviderSettings />
          </Accordion.Item>
          <Accordion.Item label="Select Token Set">
            <TokenSetSelector />
          </Accordion.Item>
        </>
      )}
    </Accordion>
  );
};
