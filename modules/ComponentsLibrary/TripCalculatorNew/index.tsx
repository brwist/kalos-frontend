/* 

  Description: allow the entering of two addresses and get the trip information

  Design Specification / Document: None Specified
  
*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';
import { PlaceAutocompleteAddressForm } from '../PlaceAutocompleteAddressForm';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { Devlog } from '../../../@kalos-core/kalos-rpc/Devlog';
import { Trip } from '../../../@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { Button } from '../../ComponentsLibrary/Button';
import {
  DevlogClientService,
  EventClientService,
  MapClientService,
  PerDiemClientService,
  UserClientService,
} from '../../../helpers';
import { User } from '../../../@kalos-core/kalos-rpc/User';
import { Event } from '../../../@kalos-core/kalos-rpc/Event';
import { format } from 'date-fns';
import { Form, Schema } from '../Form';
import { Alert } from '../Alert';
import { Field } from '../../ComponentsLibrary/Field';
import CircularProgress from '@material-ui/core/CircularProgress';

import { InfoTable } from '../InfoTable';
import { drop, parseInt } from 'lodash';
import { Data } from '@react-google-maps/api';

// add any prop types here
interface props {
  loggedUserId: number;
  role: string | undefined;
  onClose: () => void;
}

type TripInfo = {
  startAddress: string;
  endAddress: number;
};
type Job = {
  eventId: number;
};
type Home = {
  userId: number;
};
type Options = {
  dropdown1: 'Employee' | 'Job' | 'Custom';
  dropdown2: 'Employee' | 'Job' | 'Custom';
  date: string;
  roundTrip: boolean;
  jobNumber: number;
};
export const TripCalculatorNew: FC<props> = ({
  loggedUserId,
  onClose,
  role,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined,
    loadingData: false,
    origin: '',
    dropDownValue1: 'Employee',
    dropDownValue2: 'Job',
    departmentNumber: 0,
    optionalFormData: {
      roundTrip: false,
      jobNumber: 0,
      date: new Date().toISOString(),
    },
    formValue1: '',
    formValue2: '',
    destination: '',
    homeAddress: '',
    tripError: undefined,
    pendingTrip: undefined,
    distanceResults: { distance: undefined, duration: undefined },
  });
  const dropdownOptions = [
    { label: 'Employee', value: 'Employee' },
    { label: 'Job', value: 'Job' },
    { label: 'Custom', value: 'Custom' },
  ];

  const cleanup = useCallback(() => {}, []);
  const createTrip = async () => {
    if (state.pendingTrip != undefined) {
      const ok = confirm('Are you sure you want to Create this Trip?');
      if (ok) {
        await PerDiemClientService.CreateTrip(state.pendingTrip);
        if (state.optionalFormData.roundTrip) {
          const roundTrip = state.pendingTrip;
          const origin = roundTrip.getOriginAddress();
          const dest = roundTrip.getDestinationAddress();
          roundTrip.setOriginAddress(dest);
          roundTrip.setDestinationAddress(origin);
          await PerDiemClientService.CreateTrip(roundTrip);
        }
        onClose();
      }
    }
  };
  const handleError = useCallback(
    async (errorToSet: string) => {
      try {
        let errorLog = new Devlog();
        errorLog.setUserId(loggedUserId);
        errorLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        errorLog.setIsError(1);
        errorLog.setDescription(
          `An error occurred in TripCalculator: ${errorToSet}`,
        );
        await DevlogClientService.Create(errorLog);
        dispatch({ type: ACTIONS.SET_ERROR, data: errorToSet });
      } catch (err) {
        console.error(`An error occurred while saving a devlog: ${err}`);
      }
    },
    [loggedUserId],
  );

  const getEventAddress = async (eventId: number) => {
    const req = new Event();
    req.setId(eventId);

    const result = await EventClientService.Get(req);
    const property = result.getProperty();
    const address = `${property?.getAddress()},${property?.getCity()},${property?.getState()},${property?.getZip()}`;
    return address;
  };
  const getEmployeeAddress = async (userId: number) => {
    const req = new User();
    req.setId(userId);
    const result = await UserClientService.Get(req);
    const address = `${result?.getAddress()},${result?.getCity()},${result?.getState()},${result?.getZip()}`;
    dispatch({ type: ACTIONS.SET_HOME_ADDRESS, data: address });
    dispatch({
      type: ACTIONS.SET_DEPARTMENT,
      data: result.getEmployeeDepartmentId(),
    });
  };
  const resetForm = () => {
    dispatch({ type: ACTIONS.SET_PENDING_TRIP, data: undefined });
    dispatch({ type: ACTIONS.SET_FORM_VALUE_1, data: '' });
    dispatch({
      type: ACTIONS.SET_OPTIONAL_FORM_DATA,
      data: { roundTrip: false, date: new Date().toString(), jobNumber: 0 },
    });

    dispatch({ type: ACTIONS.SET_FORM_VALUE_2, data: '' });
    dispatch({ type: ACTIONS.SET_DROPDOWN_VALUE_1, data: 'Employee' });
    dispatch({
      type: ACTIONS.SET_DISTANCE_RESULTS,
      data: { distance: undefined, duration: undefined },
    });

    dispatch({ type: ACTIONS.SET_DROPDOWN_VALUE_2, data: 'Job' });
    dispatch({ type: ACTIONS.SET_DESTINATION, data: '' });
    dispatch({ type: ACTIONS.SET_ORIGIN, data: '' });
  };
  const returnFormBasedOnSelection = (
    option: 'Employee' | 'Job' | 'Custom',
    dropdown: 1 | 2,
  ) => {
    console.log('returnFormBasedOnSelection');
    const SCHEMA_GOOGLE_MAP_INPUT_FORM: Schema<AddressPair.AsObject> = [
      [
        {
          label: 'Address',
          type: 'text',
          name: 'FullAddressOrigin',
        },
      ],
      [
        {
          label: 'Street Address',
          name: 'StreetAddressOrigin',
          type: 'text',
        },
        {
          label: 'City',
          name: 'CityOrigin',
          type: 'text',
        },
        {
          label: 'State',
          name: 'StateOrigin',
          type: 'text',
        },
      ],
      [
        {
          label: 'Country',
          name: 'CountryOrigin',
          type: 'text',
        },
        {
          label: 'Zip Code',
          name: 'ZipCodeOrigin',
          type: 'text',
        },
      ],
    ];
    const setCalculationData = (data: string | number) => {
      if (dropdown == 1) {
        dispatch({ type: ACTIONS.SET_FORM_VALUE_1, data: data });
      }
      if (dropdown == 2) {
        dispatch({ type: ACTIONS.SET_FORM_VALUE_2, data: data });
      }
    };
    if (option == 'Custom') {
      return (
        <PlaceAutocompleteAddressForm
          perDiemRowIds={[]}
          onSaveLabel={'Confirm'}
          title="Enter Address"
          onClose={console.log}
          noModal={true}
          onSave={data => setCalculationData(data.FullAddressOrigin)}
          addressFields={1}
          schema={SCHEMA_GOOGLE_MAP_INPUT_FORM}
        />
      );
    }
    if (option === 'Employee') {
      return <div>{state.homeAddress}</div>;
    }
    if (option === 'Job') {
      return (
        <Field
          type="eventId"
          name="eventId"
          key={`JobField${dropdown}`}
          value={0}
          onChange={data => setCalculationData(data)}
        />
      );
    }
  };

  const optionsSchema: Schema<Options> = [
    [
      {
        options: dropdownOptions,
        name: 'dropdown1',
        disabled: state.loadingData == true || role == undefined ? true : false,
        onChange: () => {
          dispatch({
            type: ACTIONS.SET_DISTANCE_RESULTS,
            data: { distance: undefined, duration: undefined },
          });
          dispatch({ type: ACTIONS.SET_FORM_VALUE_1, data: '' });
          dispatch({ type: ACTIONS.SET_PENDING_TRIP, data: undefined });
        },
      },
      {
        options: dropdownOptions,
        name: 'dropdown2',
        disabled: state.loadingData == true || role == undefined ? true : false,
        onChange: () => {
          dispatch({
            type: ACTIONS.SET_DISTANCE_RESULTS,
            data: { distance: undefined, duration: undefined },
          });
          dispatch({ type: ACTIONS.SET_FORM_VALUE_2, data: '' });
          dispatch({ type: ACTIONS.SET_PENDING_TRIP, data: undefined });
        },
      },
    ],
    [
      {
        name: 'date',
        label: 'Date Of Trip',
        type: 'mui-datetime',
      },
      {
        name: 'roundTrip',
        label: 'Round Trip?',
        type: 'checkbox',
      },
    ],

    [
      {
        headline: true,
        label:
          'Job Associated with Trip (Ignore if you have selected Job from one of the Dropdowns)',
      },
    ],
    [
      {
        name: 'jobNumber',
        headline: true,
        label: 'Job Associated with this Trip',
        type: 'eventId',
      },
    ],
    [
      {
        content: (
          <div key={`Form1 ${state.dropDownValue1}`}>
            <b>Origin</b>
            {returnFormBasedOnSelection(state.dropDownValue1, 1)}
          </div>
        ),
      },
      {
        content: (
          <div key={`Form2 ${state.dropDownValue2}`}>
            <b>Destination</b>

            {returnFormBasedOnSelection(state.dropDownValue2, 2)}
          </div>
        ),
      },
    ],
  ];

  const getTripData = async () => {
    const eventReq = new Event();
    let origin = '';
    let destination = '';
    let homeTravel = false;
    let jobNumber = 0;
    if (state.dropDownValue1 == 'Employee') {
      dispatch({ type: ACTIONS.SET_ORIGIN, data: state.homeAddress });
      origin = state.homeAddress;
      homeTravel = true;
    }
    if (state.dropDownValue2 == 'Employee') {
      dispatch({ type: ACTIONS.SET_DESTINATION, data: state.homeAddress });
      destination = state.homeAddress;
      homeTravel = true;
    }
    if (state.dropDownValue1 == 'Job' && typeof state.formValue1 == 'number') {
      origin = await getEventAddress(state.formValue1);
      dispatch({ type: ACTIONS.SET_ORIGIN, data: origin });
      jobNumber = state.formValue1;
    }
    if (state.dropDownValue2 == 'Job' && typeof state.formValue2 == 'number') {
      destination = await getEventAddress(state.formValue2);
      dispatch({ type: ACTIONS.SET_DESTINATION, data: destination });
      jobNumber = state.formValue2;
    }
    if (
      state.dropDownValue1 == 'Custom' &&
      typeof state.formValue1 == 'string'
    ) {
      dispatch({ type: ACTIONS.SET_ORIGIN, data: state.formValue1 });
      origin = state.formValue1;
    }
    if (
      state.dropDownValue2 == 'Custom' &&
      typeof state.formValue2 == 'string'
    ) {
      dispatch({ type: ACTIONS.SET_DESTINATION, data: state.formValue2 });
      destination = state.formValue2;
    }
    dispatch({ type: ACTIONS.SET_LOADING_DATA, data: true });

    try {
      const results = await MapClientService.getTripDistance(
        origin,
        destination,
      );

      dispatch({ type: ACTIONS.SET_DISTANCE_RESULTS, data: results });
      const trip = new Trip();
      trip.setDestinationAddress(destination);
      trip.setOriginAddress(origin);
      const distance = parseFloat(results.distance.toFixed(2));
      trip.setDepartmentId(state.departmentNumber);
      trip.setDate(state.optionalFormData.date);
      trip.setHomeTravel(homeTravel);
      trip.setJobNumber(jobNumber);
      trip.setDistanceInMiles(distance);

      trip.setUserId(loggedUserId);
      if (state.optionalFormData.jobNumber != 0) {
        trip.setJobNumber(state.optionalFormData.jobNumber);
      }

      dispatch({ type: ACTIONS.SET_PENDING_TRIP, data: trip });
    } catch (e) {
      console.log('there was an issue getting the Trip Info');
      dispatch({
        type: ACTIONS.SET_TRIP_ERROR,
        data: `There was an error fetching the data. 
        It could be an error with one of the addresses \r\n
  `,
      });
    }

    dispatch({ type: ACTIONS.SET_LOADING_DATA, data: false });
  };

  const hours = Math.floor(state.distanceResults.duration! / 3600);
  const minutes = (state.distanceResults.duration! / 60).toFixed(0);

  const remainingMinutes = state.distanceResults.duration! / 60 - hours * 60;

  const minutesAfterHomeAdjustment = (
    state.distanceResults.duration! / 60 -
    30
  ).toFixed();
  const hoursAfterHomeAdjustment = Math.floor(
    (state.distanceResults.duration! / 60 - 30) / 60,
  );
  const remainingMinutesAfterAdjustment =
    parseInt(minutesAfterHomeAdjustment) - hoursAfterHomeAdjustment * 60;
  const minutesAfterDoubleHomeAdjustment = (
    (state.distanceResults.duration! * 2) / 60 -
    60
  ).toFixed();
  const hoursAfterDoubleHomeAdjustment = Math.floor(
    ((state.distanceResults.duration! * 2) / 60 - 60) / 60,
  );
  const remainingMinutesAfterDoubleHomeAdjustment =
    parseInt(minutesAfterDoubleHomeAdjustment) -
    hoursAfterDoubleHomeAdjustment * 60;

  const load = useCallback(async () => {
    await getEmployeeAddress(loggedUserId);

    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [loggedUserId]);

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  return (
    <div key="Calculator">
      {state.loadingData && (
        <CircularProgress
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            zIndex: 5,
            marginLeft: -20,
            marginTop: -20,
            width: 50,
            height: 50,
          }}
        />
      )}
      <Form<Options>
        schema={optionsSchema}
        key="TripCalculatorForm"
        title="Create Trip"
        data={{
          dropdown1: state.dropDownValue1,
          dropdown2: state.dropDownValue2,
          date: state.optionalFormData.date,
          roundTrip: state.optionalFormData.roundTrip,
          jobNumber: state.optionalFormData.jobNumber,
        }}
        onChange={data => {
          dispatch({
            type: ACTIONS.SET_DROPDOWN_VALUE_1,
            data: data.dropdown1,
          });
          dispatch({
            type: ACTIONS.SET_DROPDOWN_VALUE_2,
            data: data.dropdown2,
          });
          dispatch({
            type: ACTIONS.SET_OPTIONAL_FORM_DATA,
            data: {
              roundTrip: data.roundTrip,
              jobNumber: data.jobNumber,
              date: data.date,
            },
          });
        }}
        onSave={getTripData}
        submitLabel={'Calculate'}
        submitDisabled={state.formValue1 == '' && state.formValue2 == ''}
        onClose={() => onClose()}
      ></Form>

      {state.distanceResults.distance != undefined &&
        state.distanceResults.duration != undefined && (
          <div>
            {state.pendingTrip &&
              state.pendingTrip.getOriginAddress() != '' &&
              state.pendingTrip.getDestinationAddress() != '' && (
                <Button label={'Create Trip'} onClick={createTrip}></Button>
              )}
            <InfoTable
              styles={{ width: '300' }}
              key="resultsTable"
              columns={[
                { name: 'Origin Address' },
                { name: 'Destination Address' },
                { name: 'Distance' },
                { name: 'Average Travel Time' },
                {
                  name: 'Travel Time, Subtracting 30 minutes for Home Travel',
                },
                {
                  name: 'Round Trip Time, Subtracting 60 minutes for Home Travel',
                },
              ]}
              data={[
                [
                  { value: state.origin },
                  { value: state.destination },
                  {
                    value: `${state.distanceResults.distance.toFixed(2)} miles`,
                  },
                  {
                    value: `${hours} hours ${remainingMinutes.toFixed(
                      0,
                    )} minutes `,
                  },
                  {
                    value: `${
                      state.distanceResults.duration / 60 - 30 > 0
                        ? `${hoursAfterHomeAdjustment} hours ${remainingMinutesAfterAdjustment.toFixed(
                            0,
                          )} minutes `
                        : 0
                    } minutes`,
                  },
                  {
                    value: `${
                      state.distanceResults.duration / 60 - 30 > 0
                        ? `${hoursAfterDoubleHomeAdjustment} hours ${remainingMinutesAfterDoubleHomeAdjustment.toFixed(
                            0,
                          )} minutes `
                        : 0
                    } minutes`,
                  },
                ],
              ]}
            />
          </div>
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
