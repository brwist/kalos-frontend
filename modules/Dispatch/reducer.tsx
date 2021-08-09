import { User } from '@kalos-core/kalos-rpc/User';

export interface State {
  techs: User[];
  dismissedTechs: number[];
  calls: Event[];
  callsRemaining: number;
  jobTypes: string[];
  subTypes: string[];
  selectedCall: number;
  selectedTech: number;
  workload: number;
}

export type Action = { type: 'setSelectedCall'; data: number };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setSelectedCall':
      return {
        ...state,
        selectedCall: action.data,
      };
    default:
      return state;
  }
};
