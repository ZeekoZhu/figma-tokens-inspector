import { Button, Group, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import * as Yup from 'yup';
import { popup as log } from '../../../logger';

const githubProviderInfoFormSchema = Yup.object().shape({
  githubPat: Yup.string().required(),
  repoOwner: Yup.string().required(),
  repoName: Yup.string().required(),
  filePath: Yup.string().required(),
  fileName: Yup.string().required(),
});
export const GitHubProviderSettings = () => {
  const form = useForm({
    schema: yupResolver(githubProviderInfoFormSchema),
    initialValues: {
      githubPat: '',
      repoOwner: '',
      repoName: '',
      filePath: '',
      branch: '',
    },
  });
  return (
    <form onSubmit={form.onSubmit(values => {
      log.debug('submit', values);
    })}>
      <TextInput label="GitHub Personal Access Token" mt="sm" {...form.getInputProps('githubPat')}/>
      <TextInput label="Repo Owner" mt="sm" {...form.getInputProps('repoOwner')}/>
      <TextInput label="Repo Name" mt="sm"{...form.getInputProps('repoName')}/>
      <TextInput label="File Path" mt="sm"{...form.getInputProps('filePath')}/>
      <TextInput label="Branch" mt="sm"{...form.getInputProps('branch')} />
      <Group position="right" mt="xs">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}