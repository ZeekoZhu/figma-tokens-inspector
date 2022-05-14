import { autorun, IAutorunOptions, IReactionPublic, reaction } from 'mobx';
import { IReactionOptions } from 'mobx/src/api/autorun';

type TeardownLogic = void | (() => void);
export const watchEffect =
  (effect: (prevTeardown?: TeardownLogic) => TeardownLogic,
   opts?: IAutorunOptions) => {
    let teardown: undefined | TeardownLogic;
    return autorun(() => {
      const result = effect(teardown);
      if (typeof result === 'function') {
        teardown = result;
      }
    }, opts);
  };

export const watch = <T, FireImmediately extends boolean = false>
(expression: (r: IReactionPublic) => T,
 effect: (
   prevTeardown: TeardownLogic,
   arg: T,
   prev: FireImmediately extends true ? T | undefined : T,
   r: IReactionPublic,
 ) => TeardownLogic,
 opts: IReactionOptions<T, FireImmediately> = {},
) => {
  let teardown: undefined | TeardownLogic;
  return reaction(expression, (arg, prev, r) => {
    const result = effect(teardown, arg, prev, r);
    if (typeof result === 'function') {
      teardown = result;
    }
  }, opts);
};
