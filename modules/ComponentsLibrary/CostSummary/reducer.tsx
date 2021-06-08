import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import { Spiffs } from '../ServiceCall/components/Spiffs';

export type State = {
  spiffs: Task[] | undefined;
};

export type Action =
  | { type: 'updateSpiff'; data: Task }
  | { type: 'updateSpiffs'; data: Task[] };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'updateSpiff': {
      const data = action.data;
      const spiffs = state.spiffs;
      console.log('doing action');
      for (let i = 0; i < spiffs!.length; i++) {
        if (spiffs![i].getId() == data.getId())
          spiffs![i].setPayrollProcessed(true);
      }
      return {
        ...state,
        spiffs: spiffs,
      };
    }
    case 'updateSpiffs': {
      const data = action.data;
      return {
        ...state,
        spiffs: data,
      };
    }
    default:
      return state;
  }
};
