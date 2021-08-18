import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import { StarRateTwoTone } from '@material-ui/icons';

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
  | { type: 'updateTotalPerDiemProcessed'; data: PerDiemSum }
  | { type: 'updateTotalTripsProcessed'; data: TripSum }
  | {
      type: 'updateTotalTripsPerDiemProcessed';
      tripData: TripSum;
      perDiemData: PerDiemSum;
    };
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
    case 'updateTotalPerDiemProcessed': {
      if (action.data.totalLodging == 0 && action.data.totalMeals === 0) {
        const temp = state.totalPerDiemProcessed;
        temp.totalLodging += state.totalPerDiem.totalLodging;
        temp.totalMeals += state.totalPerDiem.totalMeals;
        return {
          ...state,
          totalPerDiemProcessed: temp,
        };
      } else {
        return {
          ...state,
          totalPerDiemProcessed: action.data,
        };
      }
    }
    case 'updateTotalTripsProcessed': {
      const temp = state.totalTripsProcessed;
      temp.totalDistance += action.data.totalDistance;
      return {
        ...state,
        totalTripsProcessed: temp,
      };
    }
    case 'updateTotalSpiffsProcessed': {
      const temp = state.totalSpiffsProcessed + action.value;
      return {
        ...state,
        totalSpiffsProcessed: temp,
      };
    }
    case 'updateTotalTripsPerDiemProcessed': {
      const tempTrip = state.totalTripsProcessed;
      const tempPerDiem = state.totalPerDiemProcessed;
      tempTrip.totalDistance += action.tripData.totalDistance;
      tempPerDiem.totalLodging += action.perDiemData.totalLodging;
      tempPerDiem.totalMeals += action.perDiemData.totalMeals;
      const newCurrentPerDiems = state.totalPerDiem;
      const newCurrentTrips = state.tripsTotal;
      newCurrentTrips.totalDistance -= action.tripData.totalDistance;
      newCurrentTrips.processed = true;
      newCurrentPerDiems.totalLodging -= action.perDiemData.totalLodging;
      newCurrentPerDiems.totalMeals -= action.perDiemData.totalMeals;
      newCurrentPerDiems.processed = 1;

      return {
        ...state,
        totalTripsProcessed: tempTrip,
        totalPerDiemProcessed: tempPerDiem,
        totalPerDiems: newCurrentPerDiems,
        totalTrips: newCurrentTrips,
      };
    }
    default:
      return state;
  }
};
