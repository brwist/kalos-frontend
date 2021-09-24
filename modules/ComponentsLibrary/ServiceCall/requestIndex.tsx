import React, { FC, useEffect, useReducer, useCallback, useRef } from 'react';
import { Event } from '@kalos-core/kalos-rpc/Event';
import {
  EventClientService,
  JobTypeClientService,
  JobSubtypeClientService,
  JobTypeSubtypeClientService,
} from '../../../helpers';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { JobSubtype } from '@kalos-core/kalos-rpc/JobSubtype';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';
import { Request } from './components/Request';
import { OPTION_BLANK } from '../../../constants';
import { Option } from '../Field';
import { SectionBar } from '../SectionBar';


export interface Props {
  userID: number;
  propertyId: number;
  serviceCallId: number;
  loggedUserId: number;
  onClose?: () => void;
  onSave?: () => void;
}

interface State {
  entry : Event;
  loading : boolean;
  loaded : boolean;
  saving : boolean;
  serviceCallID : number;
  jobTypes : JobType[];
  jobSubtypes : JobSubtype[];
  jobTypeSubtypes : JobTypeSubtype[];
  propertyEvents : Event[];
  pendingSave : boolean;
  requestValid : boolean;
  requestFields : string[];
}

type Action = 
  | {type: 'setServiceCallId'; data: number}
  | {type: 'setData'; data: {
    entry: Event,
    propertyEvents: Event[],
    jobTypes: JobType[],
    jobSubtypes: JobSubtype[],
    jobTypeSubtypes: JobTypeSubtype[],
    loaded: boolean,
    loading: boolean,
  }}
  | {type: 'setChangeEntry'; data: {
    entry: Event,
    pendingSave: boolean,
  }}
  | {type: 'setHandleSave'; data: {
    pendingSave: boolean,
    requestValid: boolean,
  }}
  | {type: 'setLoading'; data: boolean}
  | {type: 'setLoadedLoading'; data: {
    loaded: boolean,
    loading: boolean,
  }}
  | {type: 'setSaveServiceCall'; data: {
    saving: boolean,
    loading: boolean,
    pendingSave: boolean,
  }}
  | {type: 'setRequestValid'; data: boolean}
  | {type: 'setRequestFields'; data: string[]}
  | {type: 'setPendingSave'; data: boolean};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setServiceCallId' :
      return {
        ...state,
        serviceCallID: action.data,
      };
    case 'setData' : 
      return {
        ...state,
        entry: action.data.entry,
        propertyEvents: action.data.propertyEvents,
        jobTypes: action.data.jobTypes,
        jobSubtypes: action.data.jobSubtypes,
        jobTypeSubtypes: action.data.jobTypeSubtypes,
        loaded: action.data.loaded,
        loading: action.data.loading,
      };
    case 'setChangeEntry' :
      return {
        ...state,
        entry: action.data.entry,
        pendingSave: action.data.pendingSave,
      };
    case 'setHandleSave' :
      return {
        ...state,
        pendingSave: action.data.pendingSave,
        requestValid: action.data.requestValid,
      };
    case 'setLoading' :
      return {
        ...state,
        loading: action.data,
      };
    case 'setLoadedLoading' :
      return {
        ...state,
        loaded: action.data.loaded,
        loading: action.data.loading,
      };
    case 'setSaveServiceCall' :
      return {
        ...state,
        saving: action.data.saving,
        loading: action.data.loading,
        pendingSave: action.data.pendingSave,
      };
    case 'setRequestValid' :
      return {
        ...state,
        requestValid: action.data,
      };
    case 'setRequestFields' :
      return {
        ...state,
        requestFields: action.data,
      };
    case 'setPendingSave' :
      return {
        ...state,
        pendingSave: action.data,
      }
    default:
      return state;
  }
}

const initialState : State = {
  entry : new Event(),
  loading : true,
  loaded : false,
  saving : false,
  serviceCallID : 0,
  jobTypes : [],
  jobSubtypes : [],
  jobTypeSubtypes : [],
  propertyEvents : [],
  pendingSave : false,
  requestValid : false,
  requestFields : [],
}

export const ServiceRequest: FC<Props> = props => {
  const {
    userID,
    propertyId,
    serviceCallId,
    loggedUserId,
    onClose,
    onSave,
  } = props;

  const [state, serviceCall] = useReducer(reducer, initialState);
  const requestRef = useRef(null);

  const jobTypeOptions: Option[] = state.jobTypes.map(id => ({
    label: id.getName(),
    value: id.getId(),
  }));

  const jobSubtypeOptions: Option[] = 
  [
    { label: OPTION_BLANK, value: 0 },
    ...state.jobTypeSubtypes
      .filter(jobTypeId => jobTypeId.getJobTypeId() === state.entry.getJobTypeId())
      .map(jobSubtypeId => ({
        value: jobSubtypeId.getJobSubtypeId(),
        label: 
          state.jobSubtypes
            .find(id => id.getId() === jobSubtypeId.getJobSubtypeId())
            ?.getName() || '',
      })),
  ];

  const handleChangeEntry = useCallback(
    (data: Event) => {
      serviceCall({type: 'setChangeEntry', data: {
        entry: data,
        pendingSave: false,
      }});
    },
    [],
  );

  const handleSetRequestValid = useCallback( (data) => {
    serviceCall({type: 'setRequestValid', data: data});
  },[]);

  const handleSetRequestfields = useCallback(
    fields => {
      serviceCall({type: 'setRequestFields', data: [...state.requestFields, ...fields]});
    },
    [state.requestFields],
  );

  const load = useCallback(async () => {
    serviceCall({type: 'setLoading', data: true});
    const req = new Event();
    req.setId(serviceCallId);
    try {
      const propertyEvents = await EventClientService.loadEventsByPropertyId(propertyId);
      const jobTypes = await JobTypeClientService.loadJobTypes();
      const jobSubtypes = await JobSubtypeClientService.loadJobSubtypes();
      const jobTypeSubtypes = await JobTypeSubtypeClientService.loadJobTypeSubtypes();
      const entry = await EventClientService.Get(req);
      serviceCall({type: 'setData', data: {
        entry: entry,
        propertyEvents: propertyEvents,
        jobTypes: jobTypes,
        jobSubtypes: jobSubtypes,
        jobTypeSubtypes: jobTypeSubtypes,
        loaded: true,
        loading: false,
      }});
    } catch (err) {
      console.error(err);
      serviceCall({type: 'setLoadedLoading', data: {
        loaded: true,
        loading: false,
      }});
    }

  }, [
    propertyId,
    serviceCallId
  ]);

  const handleSave = useCallback(async () => {
    serviceCall({type: `setPendingSave`, data: true});
  }, []);

  const saveServiceCall = useCallback(async () => {
    serviceCall({type: 'setSaveServiceCall', data: {
      saving: true,
      loading: true,
      pendingSave: false,
    }});
    const temp = state.entry;
    console.log('saving existing ID');
    try {
      await EventClientService.Update(temp);
      console.log('finished Update');
    } catch (err) {
      console.error(err);
    }
    serviceCall({type: 'setSaveServiceCall', data: {
      saving: false,
      loading: false,
      pendingSave: false,
    }})
    if (onSave) {
      onSave();
    }
  }, [
    state.entry,
    onSave,
  ]);

  useEffect(() => {
    if (!state.loaded) {
      load();
    }
    if (state.pendingSave && state.requestValid) {
      saveServiceCall();
    }
    if (state.pendingSave && requestRef.current) {
      //@ts-ignore
      requestRef.current.click();
    }
  }, [load, state.loaded, state.pendingSave, state.requestValid, saveServiceCall, requestRef])

  return (
    <SectionBar
      title="Service Call Data"
      actions={[
        {
          label: 'Save Service Call',
          onClick: handleSave,
          disabled: state.loading || state.saving,
        },
        {
          label: 'Cancel',
          url: [
            '/index.cfm?action=admin:properties.details',
            `property_id=${propertyId}`,
            `user_id=${userID}`,
          ].join('&'),
          disabled: state.loading || state.saving,
        },
      ]}
    >
      <Request
        key={state.loading.toString()}
        //@ts-ignore
        ref={requestRef}
        serviceItem={state.entry}
        propertyEvents={state.propertyEvents}
        loading={state.loading}
        jobTypeOptions={jobTypeOptions}
        jobSubtypeOptions={jobSubtypeOptions}
        jobTypeSubtypes={state.jobTypeSubtypes}
        onChange={handleChangeEntry}
        disabled={state.saving}
        onValid={handleSetRequestValid}
        onInitSchema={handleSetRequestfields}
      />
    </SectionBar>
  )

}