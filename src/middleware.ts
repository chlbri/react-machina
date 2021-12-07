import omit from 'object.omit';
import { Event, interpret } from 'xstate';
import { OMIT_KEYS } from './constants';
import {
  AnyMachine,
  GetEvent,
  StateCreatorM,
  StateM,
  Store,
} from './types';

export default function zstate<M extends AnyMachine>(
  machine: M,
  initial?: StateM<M>,
): StateCreatorM<M> {
  return set => {
    const _service = interpret(machine)
      .onTransition(state => {
        const initialStateChanged =
          state.changed === undefined &&
          Object.keys(state.children).length;

        if (state.changed || initialStateChanged) {
          set({
            context: state.context,
            value: state.value,
            state,
            matches: state.matches,
            can: (event: GetEvent<M>['type']) =>
              state.nextEvents.includes(event),
          });
        }
      })
      .start(initial);

    // #region Out
    const state = _service.state;
    const matches = state.matches;
    const send = _service.send;
    const onChange = _service.onChange;
    const onEvent = _service.onEvent;
    const onSend = _service.onSend;
    const onDone = _service.onDone;
    const off = _service.off;
    const nextState = _service.nextState;
    const onTransition = _service.onTransition;
    const context = _service.initialState.context;
    const value = _service.initialState.value;
    const can = (event: Event<GetEvent<M>>) =>
      _service.initialState.nextEvents.includes(event);
    const service = omit(_service, [...OMIT_KEYS.array]);
    // #endregion

    return {
      state,
      send,
      service,
      onChange,
      onEvent,
      onSend,
      onDone,
      off,
      nextState,
      onTransition,
      context,
      value,
      matches,
      can,
    } as Store<M>;
  };
}
