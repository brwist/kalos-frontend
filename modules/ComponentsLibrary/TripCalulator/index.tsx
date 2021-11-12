/* 

  Description: allow the entering of two addresses and get the trip information

  Design Specification / Document: None Specified
  
*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';
import { PlaceAutocompleteAddressForm } from '../PlaceAutocompleteAddressForm';
import { Devlog } from '@kalos-core/kalos-rpc/Devlog';
import {
  DevlogClientService,
  EventClientService,
  MapClientService,
  UserClientService,
} from '../../../helpers';
import { User } from '@kalos-core/kalos-rpc/User';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { format } from 'date-fns';
import { Form, Schema } from '../Form';
import { Alert } from '../Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import { InfoTable } from '../InfoTable';

// add any prop types here
interface props {
  loggedUserId: number;
  onClose: () => void;
}

export type TripInfo = {
  // Could be a way to spread these onto the type or something, these are from Trip.AsObject
  employeeId: number;
  jobId: number;
};
export const TripCalulator: FC<props> = ({ loggedUserId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined,
    loadingData: false,
    origin: '',
    destination: '',
    tripError: undefined,
    jobNumber: 0,
    employeeId: 0,
    distanceResults: { distance: undefined, duration: undefined },
  });

  const load = useCallback(() => {
    // RPCs that are in here should be stubbed in the tests at least 9 times out of 10.
    // This ensures that the fake data gets "loaded" instantly and the tests can progress quickly and without RPC errors
    // For some examples, check out /test/modules/Teams or /test/modules/Payroll

    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, []);

  const cleanup = useCallback(() => {
    // TODO clean up your function calls here (called once the component is unmounted, prevents "Can't perform a React state update on an unmounted component" errors)
    // This is important for long-term performance of our components
  }, []);

  const handleError = useCallback(
    async (errorToSet: string) => {
      // This will send out an error devlog automatically when called
      // The idea is that this will be used for any errors which we should be able to look up for debugging

      try {
        let errorLog = new Devlog();
        errorLog.setUserId(loggedUserId);
        errorLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        errorLog.setIsError(1);
        errorLog.setDescription(
          `An error occurred in TripCalulator: ${errorToSet}`,
        );
        await DevlogClientService.Create(errorLog);
        dispatch({ type: ACTIONS.SET_ERROR, data: errorToSet });
      } catch (err) {
        console.error(`An error occurred while saving a devlog: ${err}`);
      }
    },
    [loggedUserId],
  );

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  const SCHEMA: Schema<TripInfo> = [
    [
      {
        label: 'Employee',
        type: 'technician',
        name: 'employeeId',
      },

      {
        label: 'Job Number',
        type: 'eventId',
        name: 'jobId',
      },
    ],
  ];
  const getTripData = async () => {
    const eventReq = new Event();
    dispatch({ type: ACTIONS.SET_LOADING_DATA, data: true });

    eventReq.setId(state.jobNumber);
    const eventResults = await EventClientService.Get(eventReq);
    const userReq = new User();
    userReq.setId(state.employeeId);
    let fullUserAddress = '';
    let fullPropertyAddress = '';
    const userResult = await UserClientService.Get(userReq);
    try {
      fullUserAddress =
        userResult.getAddress() +
        ',' +
        userResult.getCity() +
        ',' +
        userResult.getState() +
        ',' +
        userResult.getZip();
      fullUserAddress = fullUserAddress.replace(/(?:\r\n|\r|\n)/g, '');
      if (fullUserAddress == ',,,') {
        fullUserAddress = 'None';
      }
      const property = eventResults.getProperty();
      fullPropertyAddress = `${property!.getAddress()},${property!.getCity()},${property!.getState()},${property!.getZip()}`;
      fullPropertyAddress = fullPropertyAddress.replace(/(?:\r\n|\r|\n)/g, '');
      const results = await MapClientService.getTripDistance(
        fullUserAddress,
        fullPropertyAddress,
      );

      dispatch({ type: ACTIONS.SET_ORIGIN, data: fullUserAddress });
      dispatch({ type: ACTIONS.SET_DESTINATION, data: fullPropertyAddress });
      dispatch({ type: ACTIONS.SET_DISTANCE_RESULTS, data: results });
    } catch (e) {
      console.log('there was an issue getting the Trip Info');
      dispatch({
        type: ACTIONS.SET_TRIP_ERROR,
        data: `There was an error fetching the data. 
        It could be an error with one of the addresses \r\n
        Employee Address:${fullUserAddress} \r\n
        Property Address:${fullPropertyAddress}`,
      });
    }
    dispatch({ type: ACTIONS.SET_LOADING_DATA, data: false });
  };
  return (
    <div key="Calculator">
      {state.loadingData && (
        <div style={{ position: 'absolute', color: '#FFF' }}>
          <CircularProgress />
        </div>
      )}
      <Form<TripInfo>
        schema={SCHEMA}
        key="TripCalculatorForm"
        title="Calculate Trip Distance"
        onSave={() => getTripData()}
        submitLabel={'Calculate'}
        onClose={() => onClose()}
        submitDisabled={
          state.employeeId === 0 || state.jobNumber === 0 ? true : false
        }
        data={{ employeeId: state.employeeId, jobId: state.jobNumber }}
        onChange={e => {
          dispatch({ type: ACTIONS.SET_ORIGIN, data: '' });
          dispatch({ type: ACTIONS.SET_DESTINATION, data: '' });
          dispatch({
            type: ACTIONS.SET_DISTANCE_RESULTS,
            data: { distance: undefined, duration: undefined },
          });
          dispatch({ type: ACTIONS.SET_JOB_NUMBER, data: e.jobId });
          dispatch({ type: ACTIONS.SET_EMPLOYEE_ID, data: e.employeeId });
          dispatch({ type: ACTIONS.SET_TRIP_ERROR, data: undefined });
        }}
      />
      {state.distanceResults.distance != undefined &&
        state.distanceResults.duration != undefined && (
          <InfoTable
            styles={{ width: '300' }}
            key="resultsTable"
            columns={[
              { name: 'Employee Address' },
              { name: 'Job Address' },
              { name: 'Distance' },
              { name: ' Average Distance' },
            ]}
            data={[
              [
                { value: state.origin },
                { value: state.destination },
                { value: `${state.distanceResults.distance.toFixed(2)} miles` },
                {
                  value: `${(state.distanceResults.duration / 60).toFixed(
                    0,
                  )} minutes`,
                },
              ],
            ]}
          />
        )}
      {state.tripError != undefined && (
        <Alert
          onClose={() =>
            dispatch({ type: ACTIONS.SET_TRIP_ERROR, data: undefined })
          }
          open={state.tripError != undefined}
        >
          {state.tripError}
        </Alert>
      )}
    </div>
  );
};