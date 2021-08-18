import React, { useReducer, useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '../../PageWrapper/main';
import { State, reducer } from './reducer';
import { DispatchTechs } from './dispatchTechnicians';
import { DispatchCalls } from './dispatchCalls';
import { FormData } from './reducer';
// import {} from './dispatchMap';
import {
  DispatchClientService,
  TimeoffRequestClientService,
  ServicesRenderedClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { InfoTable } from '../InfoTable';
import { DateRange } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { DepartmentPicker } from '../Pickers';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';

export interface Props {
  userID: number;
}

// export type FilterData = {
//   departmentIds : number[];
//   jobTypes : number[];
// };
const initialFormData: FormData = {
  departmentIds: [],
};
const initialState: State = {
  techs: [],
  dismissedTechs: [],
  calls: [],
  departmentIds: [0],
  jobTypes: [0],
  departmentList: [],
  formData: initialFormData,
};

export const DispatchDashboard: React.FC<Props> = function DispatchDashboard({
  userID,
}) {
  const [state, dispatchDashboard] = useReducer(reducer, initialState);

  const handleSetFilter = (data: number) => {
    if (state.departmentIds.length == 1 && state.departmentIds[0] == 0) {
      dispatchDashboard({ type: 'setDepartmentIds', data: [data] });
    } else {
      let currentDepartmentIds = state.departmentIds;
      currentDepartmentIds.push(data);
      dispatchDashboard({
        type: 'setDepartmentIds',
        data: currentDepartmentIds,
      });
    }
  };

  const fetchTechs = async function () {
    const dateRange = new DateRange();
    dateRange.setStart('2012-01-01');
    dateRange.setEnd(format(new Date(), 'yyyy-MM-dd'));
    const result = await DispatchClientService.GetDispatchableTechnicians();
    console.log(result);
    dispatchDashboard({ type: 'setTechs', data: result.getResultsList() });
  };

  const fetchCalls = async function () {
    const result = await DispatchClientService.GetDispatchCalls();
    dispatchDashboard({ type: 'setCalls', data: result.getResultsList() });
  };
  const handleChange = useCallback((formData: FormData) => {
    dispatchDashboard({
      type: 'setFormData',
      data: formData,
    });
  }, []);

  const load = useCallback(async () => {
    await fetchTechs();
    await fetchCalls();
    const departmentReq = new TimesheetDepartment();
    departmentReq.setIsActive(1);
    const departments = await TimesheetDepartmentClientService.BatchGet(
      departmentReq,
    );
    dispatchDashboard({
      type: 'setDepartmentList',
      data: departments.getResultsList(),
    });
  }, []);
  const SCHEMA_PRINT: Schema<FormData> = [
    [
      {
        name: 'departmentIds',
        label: 'Department(s)',
        options: state.departmentList.map(el => ({
          label: el.getDescription(),
          value: el.getId(),
        })),
        type: 'multiselect',
      },
    ],
  ];

  useEffect(() => {
    load();
  }, [load]);
  console.log(state.formData);
  return (
    <PageWrapper userID={userID}>
      <SectionBar title="Dispatch" />
      <PlainForm
        schema={SCHEMA_PRINT}
        data={initialFormData}
        onChange={handleChange}
      />
      <DispatchTechs
        userID={userID}
        techs={state.techs}
        departmentIDs={state.departmentIds}
      />
      <DispatchCalls
        userID={userID}
        calls={state.calls}
        jobTypes={state.jobTypes}
      />
    </PageWrapper>
  );
};
