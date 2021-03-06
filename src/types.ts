import {
  EventObject,
  Interpreter,
  State,
  StateMachine,
  Typestate,
} from 'xstate';
import type { GetState, SetState, StateCreator, StoreApi } from 'zustand';
import { OMIT_KEYS } from './constants';

export type NOmit<T, K extends keyof T> = Omit<T, K>;

type Ipt<
  C,
  Sc,
  E extends EventObject,
  S extends Typestate<C>,
> = Interpreter<C, Sc, E, S>;

export type AnyMachine = StateMachine<any, any, any, any>;

type OmitKeys = typeof OMIT_KEYS.array[number];

export type Store<M> = M extends StateMachine<
  infer C,
  infer Sc,
  infer E,
  infer S
>
  ? {
      [OMIT_KEYS.object.state]: Ipt<C, Sc, E, S>['state'];
      [OMIT_KEYS.object.send]: Ipt<C, Sc, E, S>['send'];
      service: NOmit<Ipt<C, Sc, E, S>, OmitKeys>;
      [OMIT_KEYS.object.onChange]: Ipt<C, Sc, E, S>['onChange'];
      [OMIT_KEYS.object.onEvent]: Ipt<C, Sc, E, S>['onEvent'];
      [OMIT_KEYS.object.onSend]: Ipt<C, Sc, E, S>['onSend'];
      [OMIT_KEYS.object.onDone]: Ipt<C, Sc, E, S>['onDone'];
      [OMIT_KEYS.object.off]: Ipt<C, Sc, E, S>['off'];
      [OMIT_KEYS.object.nextState]: Ipt<C, Sc, E, S>['nextState'];
      [OMIT_KEYS.object.onTransition]: Ipt<C, Sc, E, S>['onTransition'];
      context: C;
      [OMIT_KEYS.object.value]: Ipt<C, Sc, E, S>['state']['value'];
      [OMIT_KEYS.object.matches]: Ipt<C, Sc, E, S>['state']['matches'];
      [OMIT_KEYS.object.can]: (event: E['type']) => boolean;
    }
  : never;

export type SetStoreM<M extends AnyMachine = AnyMachine> = SetState<
  Store<M>
>;

export type GetStoreM<M extends AnyMachine = AnyMachine> = GetState<
  Store<M>
>;

export type StoreApiM<M extends AnyMachine = AnyMachine> = StoreApi<
  Store<M>
>;

export type GetEvent<M> = M extends StateMachine<any, any, infer E, any>
  ? E
  : never;

export type StateCreatorM<M extends AnyMachine = AnyMachine> =
  StateCreator<Store<M>, SetStoreM<M>, GetStoreM<M>, StoreApiM<M>>;

export type StateM<M extends AnyMachine = AnyMachine> =
  M extends StateMachine<infer C, infer Sc, infer E, infer S>
    ? State<C, E, Sc, S>
    : never;
