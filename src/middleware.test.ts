import { act, renderHook } from '@testing-library/react-hooks/native';
import { StateValue, Event } from 'xstate';
import { LightEvent, useStore } from './__setupTests';

describe('Test Context', () => {
  // #region Config
  const useStoreTest = () => useStore;
  const { result } = renderHook(useStoreTest);
  const store = () => result.current.getState();
  const send = store().send;
  const matches = <T extends StateValue>(value: T) =>
    store().matches(value);
  const can = (value: Event<LightEvent>) => store().can(value);
  const value = () => store().value;
  const context = () => store().context;
  // #endregion

  it('gets the default state', () => {
    expect(context().elapsed).toBe(0);
    expect(value()).toBe('idle');
    expect(context().canWalk).toBe(false);
  });

  it('returns green state', () => {
    act(() => {
      send('TIMER');
    });

    expect(context().elapsed).toBe(1);
    expect(value()).toBe('green');
    expect(context().canWalk).toBe(false);
  });

  it('returns green state again', () => {
    expect(context().elapsed).toBe(1);
    expect(value()).toBe('green');
    expect(context().canWalk).toBe(false);
  });

  it('returns yellow state', () => {
    act(() => {
      send('TIMER');
    });

    expect(context().elapsed).toBe(2);
    expect(value()).toBe('yellow');
    expect(context().canWalk).toBe(false);
  });

  it('returns red.walk state', () => {
    act(() => {
      send('TIMER');
    });

    expect(matches('red.walk')).toBe(true);
    expect(context().elapsed).toBe(3);
    expect(context().canWalk).toBe(true);
  });

  it('returns red.stop state', () => {
    act(() => {
      send('TIMER');
    });

    expect(matches('red.stop')).toBe(true);
    expect(context().elapsed).toBe(4);
    expect(context().canWalk).toBe(true);
  });

  it('rinit to green', () => {
    act(() => {
      send('TIMER');
    });

    expect(matches('green')).toBe(true);
    expect(context().elapsed).toBe(5);
    expect(context().canWalk).toBe(false);
  });
});
