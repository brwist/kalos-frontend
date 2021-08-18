import React, { useReducer, useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '../../PageWrapper/main';
import { State, reducer } from './reducer';
import { DispatchTechs } from './dispatchTechnicians';
import { DispatchCalls } from './dispatchCalls';
// import {} from './dispatchMap';
import { 
  DispatchClientService,
  TimeoffRequestClientService,
  ServicesRenderedClientService,
} from '../../../helpers';
import { InfoTable } from '../InfoTable';
import { DateRange } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { DepartmentPicker } from '../Pickers';

export interface Props {
  userID: number;
}

// export type FilterData = {
//   departmentIds : number[];
//   jobTypes : number[];
// };

const initialState : State = {
  techs : [],
  dismissedTechs : [],
  calls : [],
  departmentIds : [0],
  jobTypes : [0],
}

export const DispatchDashboard: React.FC<Props> = function DispatchDashboard({ userID }) {
  const [state, dispatchDashboard] = useReducer(reducer, initialState);

  const handleSetFilter = (data : number) => {
    if (state.departmentIds.length == 1 && state.departmentIds[0] == 0) {
      dispatchDashboard({ type: 'setDepartmentIds', data: [data]});
    } else {
      let currentDepartmentIds = state.departmentIds;
      currentDepartmentIds.push(data);
      dispatchDashboard({ type: 'setDepartmentIds', data: currentDepartmentIds})
    }
  }

  const fetchTechs = async function() {
    const dateRange = new DateRange();
    dateRange.setStart("2012-01-01");
    dateRange.setEnd(format(new Date(), "yyyy-MM-dd"));
    const result = await DispatchClientService.GetDispatchableTechnicians(dateRange);
    console.log(result);
    dispatchDashboard({ type : 'setTechs', data : result.getResultsList()});
  }

  const fetchCalls = async function() {
    const result = await DispatchClientService.GetDispatchCalls();
    dispatchDashboard({ type: 'setCalls', data : result.getResultsList()});
  }

  const load = useCallback( async () => {
    await fetchTechs();
    await fetchCalls();
  },[]);

  useEffect(() => {
    load();
  }, [load]);
  
    return (
      <PageWrapper userID={userID}> 
        <SectionBar title="Dispatch" />
        <DepartmentPicker
          // @ts-ignore
          selected={state.departmentIds}
          renderItem={i => (
            <option
              value={i.getId()}
              key={`${i.getId()}-department-select`}
            >
              {i.getDescription()} - {i.getValue()}
            </option>
          )}
          multiple
          // @ts-ignore
          onSelect={(departmentID : React.ChangeEvent<{ value : Array }>) => {
            handleSetFilter(departmentID.target.value[1]);
            // if (departmentID.target.value) {
              // dispatchDashboard({ type: 'setDepartmentId', data: departmentID);
            // }
          }}
          withinForm
        />
        <DispatchTechs userID={userID} techs={state.techs} departmentIDs={state.departmentIds}/>
        <DispatchCalls userID={userID} calls={state.calls} jobTypes={state.jobTypes}/>
      </PageWrapper>
    )
  
}