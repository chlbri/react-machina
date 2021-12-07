import {renderHook, act} from '@testing-library/react-hooks/native';
import {useStore} from './__setupTests';

describe('Name of the group', () => {
  const useStoreTest = () => useStore;
  it('gets the default state', () => {
    const {
      result: {
        current: {getState},
      },
    } = renderHook(useStoreTest);
    const store = getState();
    const context = store.context;
    expect(context.elapsed).toBe(0);
    expect(context.canWalk).toBe(false);
  });
  it('returns green state', () => {
    const {
      result: {
        current: {getState},
      },
    } = renderHook(useStoreTest);
    const store = getState();
    const send = store.send;
    const context = store.context;
    act(() => {
      send('TIMER');
    });
    expect(context.elapsed).toBe(1);
  });
});
