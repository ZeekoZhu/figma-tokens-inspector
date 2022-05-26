import { TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useService } from '../../bootstrap';
import { FigmaOptionsStore } from '../../stores';
import {
  OptionsButtonGroup,
} from '~/popup/pages/settings/options-button-group';

export const FigmaSettings = () => {
  const figmaOptions = useService('figmaOptions');
  const form = useForm({
    schema: yupResolver(FigmaOptionsStore.schema),
    initialValues: figmaOptions.options,
  });

  return (
    <form onSubmit={form.onSubmit(values => {
      figmaOptions.updateOptions(values);
    })}>
      <TextInput label="Figma Personal Access Token"
                 {...form.getInputProps('pat')} />
      <OptionsButtonGroup form={form} storeValue={figmaOptions.options} />
    </form>
  );
};
