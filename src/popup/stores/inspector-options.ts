import { InspectorOptionsType } from '~/popup/stores/types';
import * as Yup from 'yup';
import { makeAutoObservable, reaction } from 'mobx';
import { optionStorage } from '~/popup/stores/option-storage';

const schema = Yup.object().shape({
  showStyles: Yup.boolean().default(true),
  mergeWithTokens: Yup.boolean().default(true),
});

export class InspectorOptionsStore {
  options: InspectorOptionsType = schema.getDefault();
  static default = schema.getDefault();
  static schema = schema;

  constructor() {
    makeAutoObservable(this);
    (async () => {
      const { figmaOptions } = await optionStorage.getAll();
      try {
        this.updateOptions(JSON.parse(figmaOptions));
      } catch (e) {
        // ignore error
      }
    })();
    reaction(() => this.options, () => {
      void optionStorage.set({ figmaOptions: JSON.stringify(this.options) });
    }, { fireImmediately: false });
  }

  updateOptions(options: InspectorOptionsType) {
    this.options = options;
  }
}
