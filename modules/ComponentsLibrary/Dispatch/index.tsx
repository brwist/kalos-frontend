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
  SlackClientService,
  ApiKeyClientService,
  UserClientService,
} from '../../../helpers';
import { DateRange } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { EventAssignment } from '@kalos-core/kalos-rpc/EventAssignment';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { ApiKey } from '@kalos-core/kalos-rpc/ApiKey';
import { User } from '@kalos-core/kalos-rpc/User';
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
import { CostSummary } from '../CostSummary';


export interface Props {
  loggedUserId: number;
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
  defaultDepartmentIds: [],
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
  isLoading: false,
  googleApiKey: '',
};

export const DispatchDashboard: React.FC<Props> = function DispatchDashboard({
  loggedUserId,
}) {
  const [state, dispatchDashboard] = useReducer(reducer, initialState);

  const getTechnicians = useCallback( async () => {
    const tech = new DispatchableTech();
    const dr = new DateRange();
    dr.setStart('2012-01-01');
    dr.setEnd(format(new Date(), 'yyyy-MM-dd'));
    tech.setDateRange(dr);
    if (state.departmentIds.length) {
      tech.setDepartmentList(state.departmentIds.toString());
    } else {
      tech.setDepartmentList(state.defaultDepartmentIds.toString());
    }
    try {      
      const techs = await DispatchClientService.GetDispatchableTechnicians(tech);
      const availableTechs = techs.getResultsList().filter(tech => tech.getActivity() != 'Dismissed');
      const dismissedTechs = techs.getResultsList().filter(tech => tech.getActivity() === 'Dismissed');
      console.log('Dispatch Tech Success');
      return {available: availableTechs, dismissed: dismissedTechs};
    } catch (err) {
      console.error(
        `An error occurred while getting Dispatch Techs: ${err}`
      );
      return {available: [], dismissed: []};
    }
  }, [state.departmentIds, state.defaultDepartmentIds]);

  const getCalls = useCallback( async () => {
    const call = new DispatchCall();
    call.setDateRangeList(['>=', state.callStartDate, '<=', state.callEndDate]);
    call.setDateTargetList(['date_started', 'date_ended']);
    call.setJobTypeIdList(state.jobTypes.toString());
    try {
      const calls = await DispatchClientService.GetDispatchCalls(call);
      console.log('Dispatch Call Success');
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
    const user = new User();
    user.setId(loggedUserId);
    departmentReq.setIsActive(1);
    try {
      const departments = await TimesheetDepartmentClientService.BatchGet(departmentReq);
      const userData = await UserClientService.Get(user);
      const userDepartments = userData.getPermissionGroupsList().filter(user => user.getType() === 'department').reduce((aggr, item) => [...aggr, +JSON.parse(item.getFilterData()).value], [] as number[],);
      let displayedDepartments = departments.getResultsList().filter(dep => userDepartments.includes(dep.getId()));
      if (!displayedDepartments.length) {
        displayedDepartments = departments.getResultsList().filter(dep => dep.getId() === userData.getEmployeeDepartmentId()); 
      }
      console.log('Department Success');
      return {departments: displayedDepartments, defaultValues: displayedDepartments.map(dep => dep.getId())};
    } catch (err) {
      console.error(
        `An error occurred while getting Departments: ${err}`
      );
      return {departments: [], defaultValues: []};
    }
  }

  const getJobTypes = async() => {
    const jobTypeReq = new JobType();
    try {
      const jobTypes = await JobTypeClientService.BatchGet(jobTypeReq);
      const displayedJobTypes = jobTypes.getResultsList().filter(jobType => !state.notIncludedJobTypes.includes(jobType.getId()));
      console.log('Job Type Success');
      return {jobTypes: displayedJobTypes};
    } catch (err) {
      console.error(
        `An error occurred while getting Job Types: ${err}`
      );
      return {jobTypes: []};
    }
  }

  const getGoogleApiKey = async() => {
    const newKey = new ApiKey();
    newKey.setTextId('google_maps');
    try {
      const googleKey = await ApiKeyClientService.Get(newKey);
      console.log('API Key success');
      return {googleKey: googleKey.getApiKey()};
    } catch (err) {
      console.error(
        `An error occurred while getting Google API Key: ${err}`
      );
      return {googleKey: ''};
    }
  }

  const setTechnicians = useCallback( async() => {
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
    const calls = await getCalls();
    dispatchDashboard({
      type: 'setCalls',
      data: calls.calls
    });
  }, [getCalls])

  useEffect(() => {
    if (state.defaultDepartmentIds.length) {
      setTechnicians();
      console.log('Technicians Set');
    }
    console.log('Tech Use Effect');
  }, [setTechnicians, state.defaultDepartmentIds]);

  useEffect(() => {
    setCalls();
    console.log('Call Use Effect');
  }, [setCalls])

  const handleChange = async (formData: FormData) => {
    setLoading(true);
    const callDateStart = formData.dateStart.replace('00:00', '');
    const callDateEnd = formData.dateEnd.replace('00:00', '');
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
        selectedCall: new DispatchCall(),
        isLoading: false
      }
    })
  }

  const handleDismissTech =  async () => {
    setLoading(true);
    const actLog = new ActivityLog();
    actLog.setUserId(loggedUserId);
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
      SlackClientService.DirectMessageUser(state.selectedTech.getUserId(), `Go Home, ${state.selectedTech.getTechname()}`);
    } catch (err) {
      console.error(
        `An error occurred while creating the Activity Log and Service Rendered for the dismissal: ${err}`
      );
    }
    resetModal();
    setTechnicians();
  };

  const handleUndismissTech = async (tech : DispatchableTech) => {
    setLoading(true);
    const actLog = new ActivityLog();
    actLog.setUserId(loggedUserId);
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
      SlackClientService.DirectMessageUser(tech.getUserId(), `False Alarm, ${tech.getTechname()}!  I need you back on the schedule!`);
    } catch (err) {
      console.error(
        `An error occured while create the Activity Log and Service Rendered for the Un-Dismissal: ${err}`
      );
    }
    setTechnicians();
    setLoading(false);
  }

  const handleAssignTech = async () => {
    setLoading(true);
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
      SlackClientService.Dispatch(state.selectedCall.getId(), state.selectedTech.getUserId(), loggedUserId);
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
        try {
          const results = await geocode.geocode({address});
          newCenter = {lat: results.results[0].geometry.location.lat(), lng: results.results[0].geometry.location.lng()};
        } catch (err) {
          console.error(
            `An error occurred while geocoding: ${err}`
          );
          newCenter = {lat: 0, lng: 0};
        }
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
      selectedCall: call,
      isLoading: false,
    }})
  }

  const setDropDownValues = async () => {
    const departmentReq = await getDepartments();
    const jobTypeReq = await getJobTypes();
    const googleApiKey = await getGoogleApiKey();
    dispatchDashboard({
      type: 'setInitialDropdowns',
      data: {
        departmentList: departmentReq.departments,
        defaultDepartmentIds: departmentReq.defaultValues,
        jobTypeList: jobTypeReq.jobTypes,
        googleApiKey: googleApiKey.googleKey,
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
          key: dl.getId() + dl.getDescription(),
          label: dl.getDescription(),
          value: dl.getId(),
        })),
        type: 'multiselect',
        invisible: state.departmentList.length <= 1 ? true : undefined,
      },
      {
        name: 'jobTypes',
        label: 'Job Type(s)',
        options: state.jobTypeList.map(jtl => ({
          key: jtl.getId() + jtl.getName(),
          label: jtl.getName(),
          value: jtl.getId(),
        })),
        type: 'multiselect',
        invisible: state.jobTypeList.length <= 1 ? true : undefined,
      },
    ],
  ];

  const setLoading = (loading : boolean) => {
    dispatchDashboard({ type: 'setLoading', data: loading});
  }

  const resetModal = () => {
    dispatchDashboard({ 
      type: 'setModal',
      data: {
        openModal: false,
        modalKey: '',
        selectedTech: new DispatchableTech(),
        selectedCall: new DispatchCall(),
        isLoading: false
      }
    });
  }

  useEffect(() => {
    setDropDownValues();
    console.log('drop down use effect');
  }, []);

  return (
    <PageWrapper userID={loggedUserId}>
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
                  isLoading: false,
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
                {state.techs.length > 0 && (
                  <DispatchTechs
                    userID={loggedUserId}
                    techs={state.techs}
                    dismissedTechs={state.dismissedTechs}
                    handleMapRecenter={handleMapRecenter}
                  />   
                )}          
              </Grid>
              <Grid item xs={6}>
                {state.googleApiKey != '' && (
                  <DispatchMap
                    userID={loggedUserId}
                    center={state.center}
                    zoom={state.zoom}
                    apiKey={state.googleApiKey}
                    techs={state.techs}
                    calls={state.calls}
                    handleMapClick={handleMapClick}
                  />
                )}
              </Grid>
              
              <Grid item xs={12}>
                <hr style={{borderTop: "3px solid black"}}></hr>
              </Grid>
              
              <Grid item xs={12} style={{paddingTop: "10px"}}>
                {state.calls.length > 0 && (
                  <DispatchCalls
                    userID={loggedUserId}
                    calls={state.calls}
                    handleMapRecenter={handleMapRecenter}
                  />
                )}
                {state.calls.length === 0 && (
                  <Table>
                    <TableHead></TableHead>
                    <TableBody>
                      <TableRow>
                        {/* Temporarily using hardcoded for variable for Estimated End */}
                        <TableCell
                          align="right"
                          style={{ fontWeight: 'bolder', fontSize: '16px' }}
                          width="50%"
                        >
                          Service Calls Remaining: {state.calls.length}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ fontWeight: 'bolder', fontSize: '16px' }}
                          width="50%"
                        >
                          Estimated End of Day: {format(new Date(), 'H:mm a')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
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
              label={state.isLoading ? "Saving..." : "Cancel"}
              disabled={state.isLoading}
              maxWidth={(window.innerWidth * .40)}
              >
              <DismissedTechs
                userID={loggedUserId}
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
              submitLabel={state.isLoading ? "Saving..." : "Dismiss"}
              cancelLabel="Cancel Dismissal"
              disabled={state.isLoading}
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
              submitLabel={state.isLoading ? "Saving..." : "Assign Tech to Call"}
              cancelLabel="Cancel Assignment"
              disabled={state.isLoading}
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
