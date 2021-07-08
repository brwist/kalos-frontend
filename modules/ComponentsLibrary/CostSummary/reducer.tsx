import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import { Spiffs } from '../ServiceCall/components/Spiffs';

export type PerDiemSum = {
  totalMeals: number;
  totalLodging: number;
  totalMileage: number;
  processed: number;
};

export type TripSum = {
  totalDistance: number;
  processed: boolean;
};
export type State = {
  spiffs: Task[] | undefined;
  totalPerDiem: PerDiemSum;
  tripsTotal: TripSum;
  totalSpiffsProcessed: number;
  totalPerDiemProcessed: PerDiemSum;
  totalTripsProcessed: TripSum;
};

export type Action =
  | { type: 'updateSpiff'; data: Task }
  | { type: 'updateSpiffs'; data: Task[] }
  | { type: 'updateTotalSpiffsProcessed'; value: number }
  | { type: 'updateTripsTotal'; data: TripSum }
  | { type: 'updatePerDiemTotal'; data: PerDiemSum }
  | { type: 'updatePerDiemTotalProcessed'; data: PerDiemSum }
  | { type: 'updateTripsTotalProcessed'; data: TripSum };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'updateSpiff': {
      const data = action.data;
      const spiffs = state.spiffs;
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
    case 'updateTripsTotal': {
      return {
        ...state,
        tripsTotal: action.data,
      };
    }
    case 'updatePerDiemTotal': {
      return {
        ...state,
        totalPerDiem: action.data,
      };
    }
    case 'updatePerDiemTotalProcessed': {
      return {
        ...state,
        totalPerDiemProcessed: action.data,
      };
    }
    case 'updateTripsTotalProcessed': {
      console.log(action.data);
      return {
        ...state,
        totalTripsProcessed: action.data,
      };
    }
    case 'updateTotalSpiffsProcessed': {
      const temp = state.totalSpiffsProcessed + action.value;
      return {
        ...state,
        totalSpiffsProcessed: temp,
      };
    }
    default:
      return state;
  }
};
