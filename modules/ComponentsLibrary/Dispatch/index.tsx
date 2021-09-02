import React, { useReducer, useCallback, useEffect } from 'react';
import { DispatchTechs } from './dispatchTechnicians';
import { DispatchCalls } from './dispatchCalls';
import { DismissedTechs } from './dismissedTechnicians';
import { DispatchMap } from './dispatchMap';
import { State, reducer } from './reducer';
import { FormData } from './reducer';
import {
  DispatchClientService,
  ActivityLogClientService,
  ServicesRenderedClientService,
  TimesheetDepartmentClientService,
  JobTypeClientService,
  EventAssignmentClientService,
  EventClientService,
  slackNotify,
} from '../../../helpers';
import { DateRange } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { EventAssignment } from '@kalos-core/kalos-rpc/EventAssignment';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { PageWrapper } from '../../PageWrapper/main';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { addDays, format } from 'date-fns';
import { debounce } from 'lodash';
import { DragDropContext } from 'react-beautiful-dnd';
import { Confirm } from '../Confirm';
import { Modal } from '../Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Button  from '@material-ui/core/Button';
import { Alert } from '../Alert';
import UndoRounded from '@material-ui/icons/UndoRounded';


export interface Props {
  userID: number;
}

const initialFormData: FormData = {
  dateStart: format(new Date(), 'yyyy-MM-dd'),
  dateEnd: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
  departmentIds: [],
  jobTypes: [],
};

const initialState: State = {
  techs: [],
  dismissedTechs: [],
  calls: [],
  departmentIds: initialFormData.departmentIds,
  jobTypes: initialFormData.jobTypes,
  departmentList: [],
  jobTypeList: [],
  callStartDate: initialFormData.dateStart,
  callEndDate: initialFormData.dateEnd,
  formData: initialFormData,
  notIncludedJobTypes: [],
  openModal: false,
  modalKey: '',
  selectedTech: new DispatchableTech(),
  selectedCall: new DispatchCall(),
  center: {lat: 28.565989, lng: -81.733872},
  zoom: 11,
};

export const DispatchDashboard: React.FC<Props> = function DispatchDashboard({
  userID,
}) {
  const [state, dispatchDashboard] = useReducer(reducer, initialState);

  const getTechnicians = useCallback( async () => {
    console.log('techs');
    const tech = new DispatchableTech();
    const dr = new DateRange();
    dr.setStart('2012-01-01');
    dr.setEnd(format(new Date(), 'yyyy-MM-dd'));
    tech.setDateRange(dr);
    tech.setDepartmentList(state.departmentIds.toString());
    try {      
      const techs = await DispatchClientService.GetDispatchableTechnicians(tech);
      const availableTechs = techs.getResultsList().filter(tech => tech.getActivity() != 'Dismissed');
      const dismissedTechs = techs.getResultsList().filter(tech => tech.getActivity() === 'Dismissed');
      return {available: availableTechs, dismissed: dismissedTechs};
    } catch (err) {
      console.error(
        `An error occurred while getting Dispatch Techs: ${err}`
      );
      return {available: [], dismissed: []};
    }
  }, [state.departmentIds]);

  const getCalls = useCallback( async () => {
    console.log('calls');
    const call = new DispatchCall();
    call.setDateRangeList(['>=', state.callStartDate, '<=', state.callEndDate]);
    call.setDateTargetList(['date_started', 'date_ended']);
    call.setJobTypeIdList(state.jobTypes.toString());
    try {
      const calls = await DispatchClientService.GetDispatchCalls(call);
      return {calls: calls.getResultsList()};
    } catch (err) {
      console.error(
        `An error occurred while getting Dispatch Calls: ${err}`
      );
      return {calls: []};
    }
  }, [state.jobTypes, state.callStartDate, state.callEndDate]);

  const getDepartments = async() => {
    const departmentReq = new TimesheetDepartment();
    departmentReq.setIsActive(1);
    try {
      const departments = await TimesheetDepartmentClientService.BatchGet(departmentReq);
      return {departments: departments.getResultsList()};
    } catch (err) {
      console.error(
        `An error occurred while getting Departments: ${err}`
      );
      return {departments: []};
    }
  }

  const getJobTypes = async() => {
    const jobTypeReq = new JobType();
    const jobTypes = await JobTypeClientService.BatchGet(jobTypeReq);
    try {
      const displayedJobTypes = jobTypes.getResultsList().filter(jobType => !state.notIncludedJobTypes.includes(jobType.getId()));
      return {jobTypes: displayedJobTypes};
    } catch (err) {
      console.error(
        `An error occurred while getting Job Types: ${err}`
      );
      return {jobTypes: []};
    }
  }

  const setTechnicians = useCallback( async() => {
    console.log('test tech');
    const techs = await getTechnicians();
      dispatchDashboard({
        type: 'setTechs',
        data: {
          availableTechs: techs.available,
          dismissedTechs: techs.dismissed
        }
      });
  }, [getTechnicians]);

  const setCalls = useCallback( async() => {
    console.log('test call')
    const calls = await getCalls();
    dispatchDashboard({
      type: 'setCalls',
      data: calls.calls
    });
  }, [getCalls])

  useEffect(() => {
    setTechnicians();
  }, [setTechnicians]);

  useEffect(() => {
    setCalls();
  }, [setCalls])

  const handleChange = async (formData: FormData) => {
    const callDateStart = formData.dateStart.replace('00:00', '');
    const callDateEnd = formData.dateEnd.replace('00:00', '');
    console.log({stateStart: state.callStartDate, formStart: callDateStart});
    console.log({stateEnd: state.callStartDate, formEnd: callDateEnd});
    if (state.departmentIds.length != formData.departmentIds.length || !state.departmentIds.every((val, index) => val === formData.departmentIds[index])) {
      dispatchDashboard({
        type: 'updateTechParameters',
        data: {
          departmentIds: formData.departmentIds
        }
      });
    }
    if (state.jobTypes.length != formData.jobTypes.length 
    || !state.jobTypes.every((val, index) => val === formData.jobTypes[index])
    || state.callStartDate != callDateStart
    || state.callEndDate != callDateEnd) {
      console.log('here');
      dispatchDashboard({
        type: 'updateCallParameters',
        data: {
          jobTypes: formData.jobTypes,
          callDateStarted: callDateStart,
          callDateEnded: callDateEnd
        }
      });
    }
  }

  const handleUndismissButtonClick = () => {
    dispatchDashboard({ 
      type: 'setModal',
      data: {
        openModal: true,
        modalKey: 'Undismiss',
        selectedTech: new DispatchableTech(),
        selectedCall: new DispatchCall()
      }
    })
  }

  const handleDismissTech =  async () => {
    const actLog = new ActivityLog();
    actLog.setUserId(userID);
    actLog.setPropertyId(19139);
    actLog.setActivityName(`Sent user ${state.selectedTech.getUserId()} home for the day.`);
    actLog.setActivityDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    const service = new ServicesRendered();
    service.setTechnicianUserId(state.selectedTech.getUserId());
    service.setName('Dismissed Technician');
    service.setStatus('Dismissed');
    service.setEventId(124362);
    service.setDatetime(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    service.setTimeStarted(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    try{
      await ActivityLogClientService.Create(actLog);
      await ServicesRenderedClientService.Create(service);
    } catch (err) {
      console.error(
        `An error occurred while creating the Activity Log and Service Rendered for the dismissal: ${err}`
      );
    }
    resetModal();
    setTechnicians();
  };

  const handleUndismissTech = async (tech : DispatchableTech) => {
    const actLog = new ActivityLog();
    actLog.setUserId(userID);
    actLog.setPropertyId(19139);
    actLog.setActivityName(`Recalling user ${tech.getUserId()}`);
    actLog.setActivityDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    const service = new ServicesRendered();
    service.setTechnicianUserId(tech.getUserId());
    service.setName('Technician Recalled');
    service.setStatus('Standby');
    service.setEventId(124362);
    service.setDatetime(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    service.setTimeStarted(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));

    try{
      await ActivityLogClientService.Create(actLog);
      await ServicesRenderedClientService.Create(service);
    } catch (err) {
      console.error(
        `An error occured while create the Activity Log and Service Rendered for the Un-Dismissal: ${err}`
      );
    }
    resetModal();
    setTechnicians();
  }

  const handleAssignTech = async () => {
    const assignment = new EventAssignment();
    const event = new Event();
    assignment.setEventId(state.selectedCall.getId());

    event.setId(state.selectedCall.getId());
    const ids = (state.selectedCall.getLogTechnicianAssigned() != '0' && state.selectedCall.getLogTechnicianAssigned() != '') 
              ? `${state.selectedCall.getLogTechnicianAssigned()},${state.selectedTech.getUserId()}`
              : `${state.selectedTech.getUserId()}`;

    const idArray = ids.split(',');

    event.setLogTechnicianAssigned(ids);

    try {
      const assignedEvents = await EventAssignmentClientService.BatchGet(assignment);
      const results = assignedEvents.getResultsList();
      for (let event in results) {
        assignment.setId(results[event].getId());
        EventAssignmentClientService.Delete(assignment);
      }


      for (let id in idArray) {
        assignment.setUserId(Number(idArray[id]));
        await EventAssignmentClientService.Create(assignment);
      }

      await EventClientService.Update(event);
    } catch (err) {
      console.error(
        `An error occurred while updating the Event Assignment and Event: ${err}`
      );
    }
    resetModal();
    setCalls();
  }

  const handleMapRecenter = async (center: {lat: number, lng: number}, zoom: number, address?: string) => {
    let newCenter = center;
    if (center.lat === 0 && center.lng === 0) {
      if (address) {
        const geocode = new google.maps.Geocoder();
        const results = await geocode.geocode({address});
        newCenter = {lat: results.results[0].geometry.location.lat(), lng: results.results[0].geometry.location.lng()}
      } else {
        alert("No Valid Latitude, Longitude, or Address found");
      }
    }
    if (newCenter.lat != 0 || newCenter.lng != 0) {
      dispatchDashboard({type: 'setCenter', data: {
        center: newCenter,
        zoom: zoom
      }});
    }
  }

  const handleMapClick = (tech: DispatchableTech, call: DispatchCall) => {
    dispatchDashboard({ type: 'setModal', data: {
      openModal: true,
      modalKey: 'mapInfo',
      selectedTech: tech,
      selectedCall: call
    }})
  }

  const setDropDownValues = async () => {
    const departmentReq = await getDepartments();
    const jobTypeReq = await getJobTypes();
    dispatchDashboard({
      type: 'setInitialDropdowns',
      data: {
        departmentList: departmentReq.departments,
        jobTypeList: jobTypeReq.jobTypes,
      }
    })
  }

  const SCHEMA_PRINT: Schema<FormData> = [
    [
      {
        name: 'dateStart',
        label: 'Calls Start Date',
        type: 'mui-date',
      },
      {
        name: 'dateEnd',
        label: 'Call End Date',
        type: 'mui-date',
      },
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

  const resetModal = () => {
    dispatchDashboard({ 
      type: 'setModal',
      data: {
        openModal: false,
        modalKey: '',
        selectedTech: new DispatchableTech(),
        selectedCall: new DispatchCall()
      }
    })
  }

  useEffect(() => {
    setDropDownValues();
    console.log('dropdowns rerendered');
  }, []);

  console.log("rerendered");

  return (
    <PageWrapper userID={userID}>
      <Grid>
        <Grid item xs={12}>
          <SectionBar title="Dispatch" styles={{backgroundColor: "#711313", color: "white"}} />
        </Grid>
        <Grid item xs={12} style={{width:'95%', margin:'auto'}}>
          <PlainForm
            schema={SCHEMA_PRINT}
            data={initialFormData}
            onChange={debounce(handleChange, 1000)}
          />
        </Grid>

        <Grid item xs={12} style={{width:'95%', margin:'auto'}}>
          <hr style={{borderTop: "3px solid black"}}></hr>
        </Grid>

        <Grid item xs={12} style={{width:'95%', margin:'auto'}}>

          <DragDropContext onDragEnd={async (callback) => {

            const tech = state.techs.find(i => i.getUserId() === Number(callback.draggableId));
            let call = new DispatchCall();
            let modalKey = 'Dismiss';
            if (callback.destination && callback.destination.droppableId != 'dismissTech') {
              call = state.calls.find(i => i.getId() === Number(callback.destination!.droppableId))!;
              modalKey = 'Assign';
            }
            if (callback.destination){
              dispatchDashboard({ 
                type: 'setModal',
                data: {
                  openModal: true,
                  modalKey: modalKey,
                  selectedTech: tech!,
                  selectedCall: call!, 
                }
              });
            }
          }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <div style={{alignItems:'center', margin:'auto', textAlign:'center', display:state.dismissedTechs.length ? '' : 'none'}}>
                  <Button style={{backgroundColor:'green', color:'white', width:'60%', padding:'10px', textAlign:'center'}} onClick={handleUndismissButtonClick}>
                    <UndoRounded></UndoRounded>
                    Undismiss Technician
                  </Button>
                </div>
                <DispatchTechs
                  userID={userID}
                  techs={state.techs}
                  dismissedTechs={state.dismissedTechs}
                  handleMapRecenter={handleMapRecenter}
                />             
              </Grid>
              <Grid item xs={6}>
                <DispatchMap
                  userID={userID}
                  center={state.center}
                  zoom={state.zoom}
                  techs={state.techs}
                  calls={state.calls}
                  handleMapClick={handleMapClick}
                />
              </Grid>
              
              <Grid item xs={12}>
                <hr style={{borderTop: "3px solid black"}}></hr>
              </Grid>
              
              <Grid item xs={12} style={{paddingTop: "10px"}}>
                <DispatchCalls
                  userID={userID}
                  calls={state.calls}
                  handleMapRecenter={handleMapRecenter}
                  />
              </Grid>

            </Grid>
          </DragDropContext>
        </Grid>
      </Grid>

      <Modal
        open={state.openModal}
        onClose={resetModal}
      >
        {state.modalKey === 'Undismiss' && (
            <Alert
              open={true}
              onClose={resetModal}
              title="Undismiss Tech"
              label="Cancel"
              maxWidth={(window.innerWidth * .40)}
              >
              <DismissedTechs
                userID={userID}
                dismissedTechs={state.dismissedTechs}
                handleUndismissTech={handleUndismissTech}
              />
            </Alert>
        )}
        {state.modalKey === 'Dismiss' &&
          (
            <Confirm
              key="ConfirmDismiss"
              title="Dismiss Tech"
              open={true}
              onClose={resetModal}
              onConfirm={handleDismissTech}
              maxWidth={(window.innerWidth * .40)}
              submitLabel="Dismiss"
              cancelLabel="Cancel Dismissal"
              >
              <h3>Send {state.selectedTech!.getTechname()} Home for the Day?</h3>
            </Confirm>
          )
        }
        {state.modalKey === 'Assign' && (
            <Confirm
              key="ConfirmAssign"
              title="Assign Tech"
              open={true}
              onClose={resetModal}
              onConfirm={handleAssignTech}
              maxWidth={(window.innerWidth * .60)}
              submitLabel="Assign Tech to Call"
              cancelLabel="Cancel Assignment"
            >
              <div style={{display: 'flex', width: "98%"}}>

                <div style={{width:"50%", paddingRight:"10px"}}>
                  
                  <div style={{textAlign: "center"}}>
                    <h2>Selected Technician</h2>
                  </div>
                    
                  <TableContainer>
                    <Table>
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{width:"45%", textAlign:"left", fontWeight:"bold", fontSize:"15px"}}>Name:</TableCell>
                          <TableCell style={{width:"55%", textAlign:"center"}}>{state.selectedTech.getTechname()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{fontWeight:"bold", fontSize:"15px"}}>Current Location:</TableCell>
                          <TableCell style={{textAlign:"center"}}>{state.selectedTech.getPropertyCity()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

                <div style={{width:"50%", paddingLeft:"10px"}}>

                  <div style={{textAlign: "center"}}>
                    <h2>Selected Call</h2>
                  </div>

                  <TableContainer>
                    <Table>
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Location:</TableCell>
                          <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getPropertyCity()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Customer:</TableCell>
                          <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getCustName()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{fontWeight:"bold", fontSize:"15px"}}>Type:</TableCell>
                          <TableCell style={{textAlign:"center"}}>{`${state.selectedCall.getJobType()}/${state.selectedCall.getJobSubtype()}`}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{fontWeight:"bold", fontSize:"15px"}}>Description:</TableCell>
                          <TableCell>{state.selectedCall.getDescription().length >= 200 ? state.selectedCall.getDescription().slice(0,150).concat(" ...") : state.selectedCall.getDescription()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{fontWeight:"bold", fontSize:"15px"}}>Assigned:</TableCell>
                          <TableCell style={{textAlign:"center"}}>{state.selectedCall.getAssigned() != '0' ? state.selectedCall.getAssigned() : 'Unassigned'}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>

            </Confirm>
          )
        }
        {state.modalKey === 'mapInfo' && state.selectedCall.getId() > 0 && (
          <Alert
          open={true}
          onClose={resetModal}
          title="Dispatch Call Info"
          label="Close"
          maxWidth={(window.innerWidth * .50)}
          >
            <TableContainer>
              <Table>
                <TableHead></TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell style={{fontWeight:'bold', fontSize:'16px', width:'30%'}}>Customer:</TableCell>
                    <TableCell style={{textAlign:'center', width:'70%'}}>{state.selectedCall.getCustName()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{fontWeight:'bold', fontSize:'16px'}}>Location:</TableCell>
                    <TableCell style={{textAlign:'center'}}>{state.selectedCall.getPropertyCity()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{fontWeight:'bold', fontSize:'16px'}}>Type:</TableCell>
                    <TableCell style={{textAlign:'center'}}>{`${state.selectedCall.getJobType()}/${state.selectedCall.getJobSubtype()}`}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{fontWeight:'bold', fontSize:'16px'}}>Service Needed:</TableCell>
                    <TableCell style={{textAlign:'center'}}>{state.selectedCall.getDescription().length >= 200 ? state.selectedCall.getDescription().slice(0,150).concat(" ...") : state.selectedCall.getDescription()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{fontWeight:'bold', fontSize:'16px'}}>Service Call Notes:</TableCell>
                    <TableCell style={{textAlign:'center'}}>{state.selectedCall.getLogNotes()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{fontWeight:'bold', fontSize:'16px'}}>Assigned:</TableCell>
                    <TableCell style={{textAlign:'center'}}>{state.selectedCall.getAssigned() != '0' && state.selectedCall.getAssigned() != '' ? state.selectedCall.getAssigned() : 'Unassigned'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Alert>
        )}
      </Modal>
    </PageWrapper>
  );
};
