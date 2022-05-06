import { Button, Group, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { isEqual } from 'lodash-es';
import { useService } from '../../bootstrap';

import { GitHubOptionsStore } from '../../stores';

export const GitHubProviderSettings = () => {
  const githubOptions = useService('githubOptions');
  const form = useForm({
    schema: yupResolver(GitHubOptionsStore.schema),
    initialValues: githubOptions.options,
  });
  const isUntouched = isEqual(form.values, githubOptions.options);
  return (
    <form onSubmit={form.onSubmit(values => {
      githubOptions.updateOptions(values);
    })}>
      <TextInput label="GitHub Personal Access Token"
                 mt="sm" {...form.getInputProps('githubPat')}/>
      <TextInput label="Repo Owner"
                 mt="sm" {...form.getInputProps('repoOwner')}/>
      <TextInput label="Repo Name" mt="sm"{...form.getInputProps('repoName')}/>
      <TextInput label="File Path" mt="sm"{...form.getInputProps('filePath')}/>
      <TextInput label="Branch" mt="sm"{...form.getInputProps('branch')} />
      <Group position="right" mt="xs">
        <Button disabled={isUntouched} type="button" variant="default"
                onClick={() => form.reset()}>Reset</Button>
        <Button disabled={isUntouched} type="submit">Save</Button>
      </Group>
    </form>
  );
};
