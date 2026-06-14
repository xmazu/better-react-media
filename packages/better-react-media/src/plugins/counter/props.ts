import type { CounterSettings } from '../../types';

export type { CounterSettings };

export const defaultCounterProps = {
  container: {},
  separator: '/',
} as Required<NonNullable<CounterSettings>>;

export const resolveCounterProps = (counter?: CounterSettings) => ({
  ...defaultCounterProps,
  ...counter,
});
