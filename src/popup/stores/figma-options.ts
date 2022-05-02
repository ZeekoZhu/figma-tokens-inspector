import { makeAutoObservable, reaction } from 'mobx';
import * as Yup from 'yup';
import { optionStorage } from './option-storage';
import { FigmaOptionsType } from './types';

const schema = Yup.object().shape({
  pat: Yup.string().required().default(''),
});

export class FigmaOptionsStore {
  options: FigmaOptionsType = schema.getDefault();
  static schema = schema;
  static default = schema.getDefault();

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

  updateOptions(options: FigmaOptionsType) {
    this.options = options;
  }
}
