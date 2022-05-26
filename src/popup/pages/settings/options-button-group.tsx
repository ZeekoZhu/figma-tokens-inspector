import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { isEqual } from 'lodash-es';
import { Button, Group } from '@mantine/core';

export function OptionsButtonGroup<T>
({
   form,
   storeValue,
 }: { form: UseFormReturnType<T>, storeValue: T }) {
  const isUntouched = isEqual(form.values, storeValue);
  return <Group position="right" mt="xs">
    <Button disabled={isUntouched} type="button" variant="default"
            onClick={() => form.reset()}>Reset</Button>
    <Button disabled={isUntouched} type="submit">Save</Button>
  </Group>;
}
