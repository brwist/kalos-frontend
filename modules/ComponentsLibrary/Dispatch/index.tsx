import React, { useReducer, useCallback, useEffect } from 'react';
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
  JobTypeClientService,
} from '../../../helpers';
import { DateRange } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { debounce } from 'lodash';
import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export interface Props {
  userID: number;
}

const initialFormData: FormData = {
  departmentIds: [],
  jobTypes: [],
};

const initialState: State = {
  techs: [],
  dismissedTechs: [],
  calls: [],
  departmentIds: [],
  jobTypes: [1,2,3,9],
  departmentList: [],
  jobTypeList: [],
  formData: initialFormData,
  notIncludedJobTypes: [8,10],
};

export const DispatchDashboard: React.FC<Props> = function DispatchDashboard({
  userID,
}) {
  const [state, dispatchDashboard] = useReducer(reducer, initialState);

  const handleChange = useCallback( async (formData: FormData) => {
    if (state.departmentIds.length != formData.departmentIds.length || !state.departmentIds.every((val, index) => val === formData.departmentIds[index])) {
      const dateRange = new DateRange();
      dateRange.setStart('2012-01-01');
      dateRange.setEnd(format(new Date(), 'yyyy-MM-dd'));
      const newDispatchTechs = new DispatchableTech();
      newDispatchTechs.setDateRange(dateRange);
      newDispatchTechs.setDepartmentList(formData.departmentIds.toString());
      const techs = await DispatchClientService.GetDispatchableTechnicians(newDispatchTechs);
      dispatchDashboard({
        type: 'updateDepartmentIds',
        data: {
          techs: techs.getResultsList(),
          departmentIds: formData.departmentIds,
        }
      });
    }
    if (state.jobTypes.length != formData.jobTypes.length || !state.jobTypes.every((val, index) => val === formData.jobTypes[index])) {
      const newDispatchCalls = new DispatchCall();
      newDispatchCalls.setJobTypeIdList(formData.jobTypes.toString());
      const calls = await DispatchClientService.GetDispatchCalls(newDispatchCalls);
      dispatchDashboard({
        type: 'updateJobTypes',
        data: {
          calls: calls.getResultsList(),
          jobTypes: formData.jobTypes,
        }
      });
    }
  }, [state.departmentIds, state.jobTypes]);

  const load = useCallback(async () => {
    const dispatchTech = new DispatchableTech();
    dispatchTech.setDepartmentList(state.departmentIds.toString());
    const dateRange = new DateRange();
    dateRange.setStart('2012-01-01');
    dateRange.setEnd(format(new Date(), 'yyyy-MM-dd'));
    dispatchTech.setDateRange(dateRange);
    const dispatchCall = new DispatchCall();
    dispatchCall.setJobTypeIdList(state.jobTypes.toString());
    const techs = await DispatchClientService.GetDispatchableTechnicians(dispatchTech);
    const calls = await DispatchClientService.GetDispatchCalls(dispatchCall);
    const departmentReq = new TimesheetDepartment();
    departmentReq.setIsActive(1);
    const departments = await TimesheetDepartmentClientService.BatchGet(departmentReq);
    const jobTypeReq = new JobType();
    const jobTypes = await JobTypeClientService.BatchGet(jobTypeReq);

    const displayedJobTypes = jobTypes.getResultsList().filter(jobType => !state.notIncludedJobTypes.includes(jobType.getId()));

    dispatchDashboard({
      type: 'setInitialRender',
      data: {
        techs: techs.getResultsList(),
        calls: calls.getResultsList(),
        departmentList: departments.getResultsList(),
        jobTypeList: displayedJobTypes,
      }
    })
  }, []);
  const SCHEMA_PRINT: Schema<FormData> = [
    [
      {
        name: 'departmentIds',
        label: 'Department(s)',
        options: state.departmentList.map(dl => ({
          label: dl.getDescription(),
          value: dl.getId(),
        })),
        type: 'multiselect',
      },
      {
        name: 'jobTypes',
        label: 'Job Type(s)',
        options: state.jobTypeList.map(jtl => ({
          label: jtl.getName(),
          value: jtl.getId(),
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
        onChange={debounce(handleChange, 1000)}
      />
      <DragDropContext onDragEnd = {() => {

      }}
      >
        <Droppable droppableId="droppable-1" type="TECH">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <DispatchTechs
                userID={userID}
                techs={state.techs}
              />             
              <DispatchCalls
                userID={userID}
                calls={state.calls}
              />

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </PageWrapper>
  );
};
