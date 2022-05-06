import { Button, Group, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { isEqual } from 'lodash-es';
import { useService } from '../../bootstrap';
import { FigmaOptionsStore} from '../../stores';

export const FigmaSettings = () => {
  const figmaOptions  = useService('figmaOptions');
  const form = useForm({
    schema: yupResolver(FigmaOptionsStore.schema),
    initialValues: figmaOptions.options,
  });

  const isUntouched = isEqual(form.values, figmaOptions.options);

  return (
    <form onSubmit={form.onSubmit(values => {
      figmaOptions.updateOptions(values);
    })}>
      <TextInput label="Figma Personal Access Token"
                 mt="sm" {...form.getInputProps('pat')} />
      <Group position="right" mt="xs">
        <Button disabled={isUntouched} type="button" variant="default"
                onClick={() => form.reset()}>Reset</Button>
        <Button disabled={isUntouched} type="submit">Save</Button>
      </Group>
    </form>
  );
};
