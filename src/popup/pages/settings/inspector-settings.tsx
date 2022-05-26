import { useService } from '~/popup/bootstrap';
import { useForm, yupResolver } from '@mantine/form';
import { InspectorOptionsStore } from '~/popup/stores/inspector-options';
import { Checkbox } from '@mantine/core';
import {
  OptionsButtonGroup,
} from '~/popup/pages/settings/options-button-group';

const checkboxStyle = { label: { cursor: 'pointer' } };
export const InspectorSettings = () => {
  const inspectorOptions = useService('inspectorOptions');
  const form = useForm({
    schema: yupResolver(InspectorOptionsStore.schema),
    initialValues: inspectorOptions.options,
  });

  return (<form onSubmit={form.onSubmit(values => {
    inspectorOptions.updateOptions(values);
  })}>
    <Checkbox sx={checkboxStyle}
              label="Show Figma styles" {...form.getInputProps(
      'showStyles', { type: 'checkbox' })} />
    <Checkbox mt="sm"
              sx={checkboxStyle}
              disabled={!form.values.showStyles}
              label="Hide styles when design token exits"
              {...form.getInputProps('mergeWithTokens',
                { type: 'checkbox' })} />
    <OptionsButtonGroup form={form} storeValue={inspectorOptions.options} />
  </form>);
};
