import { assign, createMachine } from 'xstate/lib';
import create from 'zustand';
import zstate from './middleware';

// const remoteMachine = createMachine({
//   id: 'remote',
//   initial: 'offline',
//   states: {
//     offline: {
//       on: {
//         WAKE: 'online',
//       },
//     },
//     online: {
//       on: {
//         WAKE: 'offline',
//       },
//     },
//   },
// });

export const context = {
  elapsed: 0,
  canWalk: false,
};

export type LightEvent = { type: 'TIMER' };

export const lightMachine = createMachine<typeof context, LightEvent>(
  {
    initial: 'idle',
    context,
    states: {
      idle: {
        on: {
          TIMER: 'green',
        },
      },
      green: {
        entry: 'inc',
        on: {
          TIMER: 'yellow',
        },
      },
      yellow: {
        entry: 'inc',
        on: {
          TIMER: 'red',
        },
      },
      red: {
        entry: 'setCanWalk',
        initial: 'walk',
        states: {
          walk: {
            entry: 'inc',
            on: {
              TIMER: {
                target: 'stop',
                cond: 'searchValid',
              },
            },
          },

          stop: {
            entry: 'inc',
            id: 'red_stop',
          },
        },
        on: {
          TIMER: {
            target: 'green',
            in: '#red_stop',
            actions: 'setCannotWalk',
          },
        },
      },
    },
  },
  {
    guards: {
      searchValid: ({ canWalk }) => canWalk,
    },
    actions: {
      setCanWalk: assign({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        canWalk: _ => true,
      }),
      setCannotWalk: assign({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        canWalk: _ => false,
      }),
      inc: assign({
        elapsed: ({ elapsed }) => {
          return elapsed + 1;
        },
      }),
    },
  },
);

export const useStore = create(zstate(lightMachine));
