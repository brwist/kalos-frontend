import React, { useReducer, useCallback, useEffect } from 'react';
import { FormData, FirstCallType, TechObj, CallObj, State, reducer } from './reducer';
import { ClassMeeting } from './classMeeting';
import { PageWrapper } from '../../PageWrapper/main';
import { SectionBar } from '../SectionBar';
import { Alert } from '../Alert';
import { Modal } from '../Modal';
import { Confirm } from '../Confirm';
import { Schema, PlainForm } from '../PlainForm';
import { DispatchTechs } from '../Dispatch/dispatchTechnicians';
import { DismissedTechs } from '../Dispatch/dismissedTechnicians';
import { DispatchCalls } from '../Dispatch/dispatchCalls';
import { DispatchMap } from '../Dispatch/dispatchMap';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  ApiKeyClientService,
  DispatchClientService,
  JobTypeClientService,
  UserClientService,
  FirstCallClientService,
  EventClientService,
  TimesheetDepartmentClientService,
  SlackClientService,
  TimeoffRequestClientService,
} from '../../../helpers';
import { DispatchableTech, DispatchCall} from '@kalos-core/kalos-rpc/Dispatch';
import { User } from '@kalos-core/kalos-rpc/User';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { ApiKey } from '@kalos-core/kalos-rpc/ApiKey';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { DateRange } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { FirstCall } from '@kalos-core/kalos-rpc/FirstCall';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';
import setSeconds from 'date-fns/esm/setSeconds';
import TableContainer from '@material-ui/core/TableContainer';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import RemoveCircleOutlineTwoTone from '@material-ui/icons/RemoveCircleOutlineTwoTone';
import CircleProgress from '@material-ui/core/CircularProgress';
import nextSunday from 'date-fns/esm/nextSunday';
import AddCircleOutlineTwoTone from '@material-ui/icons/AddCircleOutlineTwoTone';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { Loader } from '../../Loader/main';



export interface Props {
  loggedUserId: number;
  testUserId?: number;
  disableSlack?: boolean;
}

const initialFormData : FormData = {
  departmentIds: [],
  division: 0,
  jobTypes: [],
  availableTechs: [],
  meetingTime: format(addDays(setMinutes(setHours(new Date(), 7), 30), 1), 'yyyy-MM-dd HH:mm'),
  classTime: format(addDays(setMinutes(setHours(new Date(), 7), 30), 1), 'yyyy-MM-dd HH:mm'),
};

const initialFirstCall : FirstCallType = {
  calls: [],
  meeting: {
    isTomorrow: false,
    start: format(addDays(setMinutes(setHours(new Date(), 7), 30), 1), 'yyyy-MM-dd HH:mm'),
    list: []
  },
  class: {
    isTomorrow: false,
    start: format(addDays(setMinutes(setHours(new Date(), 7), 30), 1), 'yyyy-MM-dd HH:mm'),
    list: []
  },
  manualOff: [],
  scheduledOff: [],
  inUse: [],
  expires: format(addDays(setSeconds(setMinutes(setHours(new Date(), 0), 0), 0), 1), 'yyyy-MM-dd HH:mm:ss'),
  message: '',
  onCall: {
    coordinator: '',
    expires: '',
    tech: {
      secondsWorked: 0,
      name: '',
      userEmail: '',
      userPhone: '',
      userId: 0
    }
  }
}

const initialState : State = {
  techs: [],
  offTechs: [],
  scheduledOff: [],
  meetingTechs: [],
  classTechs: [],
  onCallTech: new DispatchableTech(),
  calls: [],
  assignedCalls: [],
  sectorList: [],
  jobTypeList: [],
  departmentList: [],
  formData: initialFormData,
  googleApiKey: '',
  openModal: false,
  modalKey: '',
  center: {lat: 28.565989, lng: -81.733872},
  zoom: 11,
  loaded: false,
  savedFirstCall: initialFirstCall,
  firstCallCalls: initialFirstCall.calls,
  firstCallMeeting: initialFirstCall.meeting,
  firstCallMessage: initialFirstCall.message,
  firstCallOnCall: initialFirstCall.onCall,
  firstCallExpires: initialFirstCall.expires,
  firstCallClass: initialFirstCall.class,
  firstCallInUse: initialFirstCall.inUse,
  firstCallManualOff: initialFirstCall.manualOff,
  firstCallScheduledOff: initialFirstCall.scheduledOff,
  selectedCall: new DispatchCall(),
  isProcessing: false,
  assigneeList: [],
  save: false,
  newFirstCall: false,
  saveTime: '',
  firstCallId: 0,
  errorMessage: '',
  saveCall: false,
  showAddTech: false,
  tempAssigneeList: '',
  refreshCalls: false,
};

export const FirstCallDashboard: React.FC<Props> = function FirstCallDashboard({
  loggedUserId,
  testUserId=0,
  disableSlack=false,
}) {
  const [state, updateFirstCallState] = useReducer(reducer, initialState);

  const handleModalToggle = (modalKey : string) => {
    updateFirstCallState({
      type: 'setModal',
      data: {
        openModal: !state.openModal,
        modalKey: modalKey,
      }
    });
  }
  const handleAddTechToggle = () => {
    updateFirstCallState({ type: 'setShowAddTech', data: !state.showAddTech });
  }
  const equals = (a : any, b : any) =>
    a.length === b.length &&
    a.every((v : any, i : number) => v === b[i]);

  const resetModal = () => {
    switch (state.modalKey) {
      case 'Class': {
        const techList : {id: number, name: string}[] = [];
        state.classTechs.map(tech => techList.push({id: tech.getUserId(), name: tech.getTechname()}));
        const data = {
          isTomorrow: state.classTechs ? true : false,
          start: state.formData.classTime,
          list: techList,
        };
        if (data.start !== state.firstCallClass.start || !equals(data.list,state.firstCallClass.list)) {
          updateFirstCallState({ type: 'setFirstCallClass', data: data});
        }
        break;
      }
      case 'Meeting': {
        const techList : {id: number, name: string}[] = [];
        state.meetingTechs.map(tech => techList.push({id: tech.getUserId(), name: tech.getTechname()}));
        const data = {
          isTomorrow: state.meetingTechs ? true : false,
          start: state.formData.meetingTime,
          list: techList,
        };
        if (data.start !== state.firstCallMeeting.start || !equals(data.list,state.firstCallMeeting.list)) {
          updateFirstCallState({ type: 'setFirstCallMeeting', data: data});
        }
        break;
      }
      case 'callInfo': {
        const assignedCalls = state.firstCallCalls;
        if (state.showAddTech) {
          handleAddTechToggle();
        }
        if (state.saveCall) {
          handleCallUpdate();
        }
        const firstCall = assignedCalls.filter(call => call.id === state.selectedCall.getId());
        let assignedTech : TechObj[] = [];
        const selectedCallTechs = state.techs.filter(tech => state.selectedCall.getLogTechnicianAssigned().split(',').includes(String(tech.getUserId())));
        selectedCallTechs.forEach(tech => assignedTech.push(
          {
            userId: tech.getUserId(),
            name: tech.getTechname(),
            userPhone: tech.getUserPhone(),
            userEmail: tech.getUserEmail(),
            secondsWorked: tech.getHoursWorked()
          }
        ));
        if (firstCall.length === 0) {
          if (assignedTech.length) {
            const newCall : CallObj = {
              id: state.selectedCall.getId(),
              assigned: assignedTech,
              description: state.selectedCall.getDescription(),
              jobType: state.selectedCall.getJobType(),
              subType: state.selectedCall.getJobSubtype(),
              start: state.selectedCall.getTimeStarted(),
              end: state.selectedCall.getTimeEnded(),
              propertyId: state.selectedCall.getPropertyId(),
              propertyAddress: state.selectedCall.getPropertyAddress(),
              propertyCity: state.selectedCall.getPropertyCity(),
              propertyState: state.selectedCall.getPropertyState(),
              custName: state.selectedCall.getCustName(),
              userBusinessName: state.selectedCall.getUserBusinessname(),
              userId: state.selectedCall.getUserId(),
              notes: state.selectedCall.getNotes(),
            }
            updateFirstCallState({ type: 'setFirstCallCalls', data: state.firstCallCalls.concat(newCall) });
          }
        } else if (firstCall[0].notes !== state.selectedCall.getNotes() || firstCall[0].assigned !== assignedTech) {
          if (assignedTech.length) {
            const updatedCall : CallObj = {
              id: firstCall[0].id,
              assigned: assignedTech,
              description: firstCall[0].description,
              jobType: firstCall[0].jobType,
              subType: firstCall[0].subType,
              start: firstCall[0].start,
              end: firstCall[0].end,
              propertyId: firstCall[0].propertyId,
              propertyAddress: firstCall[0].propertyAddress,
              propertyCity: firstCall[0].propertyCity,
              propertyState: firstCall[0].propertyState,
              custName: firstCall[0].custName,
              userBusinessName: firstCall[0].userBusinessName,
              userId: firstCall[0].userId,
              notes: state.selectedCall.getNotes(),
            }
            const fc = state.firstCallCalls;
            fc.splice(fc.findIndex(call => call.id === state.selectedCall.getId()),1);
            updateFirstCallState({ type: 'setFirstCallCalls', data: fc.concat(updatedCall).sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)) })
          } else {
            const fc = state.firstCallCalls;
            fc.splice(fc.findIndex(call => call.id === state.selectedCall.getId()),1);
            updateFirstCallState({ type: 'setFirstCallCalls', data: fc });
          }
        }
        break;
      }
    }
    updateFirstCallState({
      type: 'setModal',
      data: {
        openModal: !state.openModal,
        modalKey: '',
      }
    });
  }

  const handleFormDataUpdate = useCallback(async (data : any, timesOnly=false) => {
    let resetPage = false;
    let refreshCalls = false;
    const updateFormData : FormData = state.formData;
    if (data.classTime) {
      updateFormData.classTime = data.classTime;
    }
    if (data.meetingTime) {
      updateFormData.meetingTime = data.meetingTime;
    }
    if (data.departmentIds) {
      updateFormData.departmentIds = data.departmentIds;
    }
    if (data.jobTypes && data.division === state.formData.division) {
      updateFormData.jobTypes = data.jobTypes;
      refreshCalls = true;
    }
    if (data.division && data.division !== state.formData.division) {
      updateFormData.division = data.division;
      const departmentReq = new TimesheetDepartment();
      departmentReq.setSectorGroup(data.division);
      const departments = await TimesheetDepartmentClientService.BatchGet(departmentReq);
      updateFormData.departmentIds = departments.getResultsList().map(dep => dep.getId());
      if (state.loaded) {
        resetPage = true;
      }
    }
    if (data.availableTechs) {
      updateFormData.availableTechs = data.availableTechs;
    }
    updateFirstCallState({ type: 'setFormData', data: {formData: updateFormData} });
    if (resetPage) {
      updateFirstCallState({ type: 'setLoaded', data: false });
    }
    if (refreshCalls) {
      updateFirstCallState({ type: 'setRefreshCalls', data: true });
    }
  }, [state.formData, state.loaded])

  const handleCallDetails = async (call : DispatchCall, techId? : string | DispatchableTech) => {
    let assignees : {id: number, name: string}[] = [];
    let ids = call.getLogTechnicianAssigned().split(',').map(Number);
    if (techId) {
      ids = call.getLogTechnicianAssigned().concat(`,${techId}`).split(',').map(Number);
    }
    try {
      const userData = await UserClientService.BatchGetUsersByIds(ids);
      for (const user of userData.getResultsList()) {
        assignees.push({id: user.getId(), name: `${user.getFirstname()} ${user.getLastname()}`})
      }
      updateFirstCallState({
        type: 'setModal',
        data: {
          openModal: true,
          modalKey: 'callInfo',
          selectedCall: call,
          assigneeList: assignees,
        }
      });
    } catch (err) {
      console.error('Error Occurred when Getting Assigned Users', err);
    }
  }

  const handleUpdateAssignTech = async (id : number, updateType : string) => {
    updateFirstCallState({ type: 'setProcessing', data: true });
    const currentCall = state.selectedCall;
    const currentAssignees = state.assigneeList;
    const currentInUse = state.firstCallInUse;
    const currentTechArray = currentCall.getLogTechnicianAssigned().split(',');
    if (updateType === 'remove') {
      currentTechArray.splice(currentTechArray.findIndex(tech => tech === String(id)),1);
      currentAssignees.splice(currentAssignees.findIndex(assignee => assignee.id === id), 1);
      currentInUse.splice(currentInUse.findIndex(tech => tech === id),1);
    } else {
      if (!currentTechArray.length || (currentTechArray.length === 1 && currentTechArray[0] === "0")) {
        currentTechArray[0] = String(id);
        currentAssignees[0] = {id: id, name: state.techs.filter(tech=>tech.getUserId() === id)[0].getTechname()};
      } else {
        currentTechArray.push(String(id));
        currentAssignees.push({id: id, name: state.techs.filter(tech=>tech.getUserId() === id)[0].getTechname()}); 
      }
      currentInUse.push(id);
    }
    currentCall.setLogTechnicianAssigned(currentTechArray.toString());
    updateFirstCallState({
      type: 'setFirstCallInUse',
      data: currentInUse
    });
    const availableTechs = state.techs.filter(tech => {
      const notAvailable = [];
      for (let i in state.firstCallManualOff) {
        notAvailable.push(state.firstCallManualOff[i].id);
      }
      for (let j in currentInUse) {
        notAvailable.push(currentInUse[j]);
      }
      for (let k in state.scheduledOff) {
        notAvailable.push(state.scheduledOff[k].id);
      }
      return !notAvailable.includes(tech.getUserId());
    });
    handleFormDataUpdate({availableTechs : availableTechs});
    updateFirstCallState({
      type: 'setAssigneesAndCall',
      data: {
        assigneeList: currentAssignees,
        selectedCall: currentCall,
      }
    });
  }

  const handleUnOffTech = async (tech : DispatchableTech) => {
    updateFirstCallState({ type: 'setProcessing', data: true});
    const offTechs = state.firstCallManualOff;
    const index = offTechs.findIndex(offTech => offTech.id === tech.getUserId());
    offTechs.splice(index,1);
    const availableTechs = state.techs.filter(tech => {
      const notAvailable = [];
      for (let i in offTechs) {
        notAvailable.push(offTechs[i].id);
      }
      for (let j in state.firstCallInUse) {
        notAvailable.push(state.firstCallInUse[j]);
      }
      for (let k in state.scheduledOff) {
        notAvailable.push(state.scheduledOff[k].id);
      }
      return !notAvailable.includes(tech.getUserId());
    });
    handleFormDataUpdate({availableTechs: availableTechs});
    updateFirstCallState({ type: 'setFirstCallManualOff', data: offTechs});
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
      updateFirstCallState({
        type: 'setCenter',
        data: {
          center: newCenter,
          zoom: zoom
        }
      });
    }
  }

  const handleCallUpdate = async () => {
    const updatedCall = new Event();
    updatedCall.setId(state.selectedCall.getId());
    updatedCall.setLogTechnicianAssigned(state.selectedCall.getLogTechnicianAssigned().length ? state.selectedCall.getLogTechnicianAssigned() : "0");
    updatedCall.setNotes(state.selectedCall.getNotes());
    try {
      await EventClientService.Update(updatedCall);
      const newCalls = await setCalls();
      updateFirstCallState({ type: 'setCalls', data: {available: newCalls.availableCalls, assigned: newCalls.assignedCalls} });
    } catch (err) {
      console.error(err);
    }
  }

  const handleSave = useCallback(async () => {
    let allowSave = true;
    let id = 0;
    const saveTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const updatedFirstCall = {
      calls: state.firstCallCalls,
      meeting: state.firstCallMeeting,
      class: state.firstCallClass,
      manualOff: state.firstCallManualOff,
      scheduledOff: state.scheduledOff,
      inUse: state.firstCallInUse,
      onCall: state.firstCallOnCall,
      message: state.firstCallMessage,
      expires: state.firstCallExpires
    };
    const firstCallJSON = JSON.stringify(updatedFirstCall);
    const firstCall = new FirstCall();
    if (!state.newFirstCall) {
      firstCall.setId(state.firstCallId);
      const currentCall = await FirstCallClientService.Get(firstCall);
      id = currentCall.getId();
      if (state.saveTime !== currentCall.getDateCreated()) {
        allowSave = false;
      }
    }
    firstCall.setDateCreated(saveTime);
    firstCall.setSector(state.formData.division);
    firstCall.setJson(firstCallJSON);
    if (!allowSave) {
      alert("Please Refresh Page");
      updateFirstCallState({ type: 'setFailedSave', data: {save: false, error: 'DateMismatch'}});
    } else {
      if (state.newFirstCall) {
        const newCall = await FirstCallClientService.Create(firstCall);
        id = newCall.getId();
      } else if (allowSave) {
        await FirstCallClientService.Update(firstCall);
      } 
      updateFirstCallState({ type: 'setSave', data: {save: false, saveTime: saveTime, firstCallId: id, isNew: false}});
    }
  }, [
    state.firstCallCalls, state.firstCallMeeting,
    state.firstCallClass, state.firstCallManualOff,
    state.firstCallInUse, state.firstCallOnCall,
    state.firstCallMessage, state.firstCallExpires,
    state.firstCallId, state.formData.division,
    state.newFirstCall, state.saveTime,
    state.scheduledOff
  ]);

  const handleFinalizeFirstCall = () => {
    if (state.firstCallCalls.length) {
      for (let call in state.firstCallCalls) {
        for (let user in state.firstCallCalls[call].assigned) {
          if (testUserId > 0) {
            SlackClientService.Dispatch(state.firstCallCalls[call].id, testUserId, loggedUserId, true);
          } else {
            SlackClientService.Dispatch(state.firstCallCalls[call].id, state.firstCallCalls[call].assigned[user].userId, loggedUserId, true);
          }
        }
      }
    }
    if (!disableSlack) {
      SlackClientService.FirstCall(state.formData.division);
    }
  }

  const getTechs = useCallback (async (refresh = false) => {
    console.log(state.formData.departmentIds);
    console.log(state.formData.departmentIds.toString());
    const techs = new DispatchableTech();
    const dr = new DateRange();
    dr.setStart('2012-01-01');
    dr.setEnd(format(new Date(), 'yyyy-MM-dd'));
    techs.setDateRange(dr);
    techs.setDepartmentList(state.formData.departmentIds.toString());
    const users = new User();
    users.setIsActive(1);
    users.setIsHvacTech(1);
    users.setDepartmentList(state.formData.departmentIds.toString());
    const off = new TimeoffRequest();
    const offRequestTimeStarted = format(addDays(setHours(setMinutes(setSeconds(new Date(), 0), 0), 7), 1), "yyyy-MM-dd HH::mm::ss");
    const offRequestTimeFinished = format(addDays(setHours(setMinutes(setSeconds(new Date(), 0), 0), 12), 1), "yyyy-MM-dd HH::mm::ss");
    off.setIsActive(1);
    off.setRequestStatus(1);
    off.setDateRangeList([">=", offRequestTimeStarted, "<=", offRequestTimeFinished]);
    off.setDateTargetList(["time_finished", "time_started"]);
    off.setDepartmentIdList(state.formData.departmentIds.toString());
    try {
      const userList = await UserClientService.BatchGet(users);
      const dispatchableTechs = await DispatchClientService.GetDispatchableTechnicians(techs);
      const techList = dispatchableTechs.getResultsList();
      const techIds = techList.map(tech => tech.getUserId());
      const missingTechs = userList.getResultsList().filter(user => !techIds.includes(user.getId()));
      missingTechs.forEach(tech => {
        const newTech = new DispatchableTech();
        newTech.setUserId(tech.getId());
        newTech.setTechname(`${tech.getFirstname()} ${tech.getLastname()}`);
        newTech.setHoursWorked(0);
        newTech.setUserEmail(tech.getEmail());
        newTech.setUserPhone(tech.getPhone());
        techList.push(newTech);
      });
      const timeoffList = await TimeoffRequestClientService.BatchGet(off);
      const timeoffIds : {id: number, name: string}[] = [];
      techList.filter(tech => timeoffList.getResultsList().map(req => req.getUserId()).includes(tech.getUserId())).forEach(tech => timeoffIds.push({id: tech.getUserId(), name: tech.getTechname()}));
      return {techList: techList, scheduledOff: timeoffIds};
    } catch (err) {
      console.error(err)
      return {techList: [], scheduledOff: []}
    }
  }, [state.formData.departmentIds]);

  // const setTechs = useCallback(async () => {
  //   const newFormData : FormData = {
  //     departmentIds: state.formData.departmentIds,
  //     division: state.formData.division,
  //     jobTypes: state.formData.jobTypes,
  //     meetingTime: state.formData.meetingTime,
  //     classTime: state.formData.classTime,
  //     availableTechs: results[0].techList.filter(tech => {
  //       const notAvailable = [];
  //       for (let i in results[4].firstCall.manualOff) {
  //         notAvailable.push(results[4].firstCall.manualOff[i].id);
  //       }
  //       for (let j in results[4].firstCall.inUse) {
  //         notAvailable.push(results[4].firstCall.inUse[j]);
  //       }
  //       for (let k in results[0].scheduledOff) {
  //         notAvailable.push(results[0].scheduledOff[k].id);
  //       }
  //       return !notAvailable.includes(tech.getUserId());
  //     }),
  //   }
  // }, [getTechs]);

  const getCalls =  useCallback(async () => {
    const newCall = new DispatchCall();
    newCall.setDateStarted(`${format(addDays(new Date(), 1), 'yyyy-MM-dd')}%`);
    newCall.setSectorGroupList(state.formData.division.toString());
    newCall.setJobTypeIdList(state.formData.jobTypes.toString());
    try {
      const callList = await DispatchClientService.GetDispatchCalls(newCall);
      const filteredCallList = callList.getResultsList()
        .filter(call =>
          Number(call.getTimeStarted().substring(0,2)) >= 7 &&
          Number(call.getTimeStarted().substring(0,2)) <= 12
        )
        return filteredCallList;
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [state.formData.jobTypes, state.formData.division])

  const setCalls = useCallback(async (refresh = false) => {
    const availableCalls : DispatchCall[] = [];
    const assignedCalls : DispatchCall[] = [];
    const calls = await getCalls();
    calls.forEach(call => {
      if (call.getLogTechnicianAssigned() === "" || call.getLogTechnicianAssigned() === "0" || call.getLogTechnicianAssigned() === null) {
        availableCalls.push(call);
      } else {
        assignedCalls.push(call);
      }
    });
    if (state.refreshCalls || refresh) {
      updateFirstCallState({ type: 'setCalls', data: {
        available: availableCalls,
        assigned: assignedCalls
      }})
    }
    return {availableCalls, assignedCalls};
  }, [getCalls, state.refreshCalls])

  const getJobTypes = async () => {
    const jobTypeReq = new JobType();
    try {
      const jobTypes = await JobTypeClientService.BatchGet(jobTypeReq);
      return {jobTypes: jobTypes.getResultsList()};
    } catch (err) {
      console.error(
        `An error occurred while getting Job Types: ${err}`
        );
      return {jobTypes: []};
    }
  }

  const getGoogleApiKey = async () => {
    const newKey = new ApiKey();
    newKey.setTextId('google_maps');
    try {
      const googleKey = await ApiKeyClientService.Get(newKey);
      return {googleKey: googleKey.getApiKey()};
    } catch (err) {
      console.error(
        `An error occurred while getting Google API Key: ${err}`
        );
      return {googleKey: ''};
    }
  };

  const getPreviousFirstCall =useCallback( async () => {
    const firstCall = new FirstCall();
    firstCall.setSector(state.formData.division);
    firstCall.setDateCreated(`${format(new Date(), 'yyyy-MM-dd')} %`);
    try {
      const previousFirstCall = await FirstCallClientService.Get(firstCall);
      const parsedFirstCalls = JSON.parse(previousFirstCall.getJson());
      const firstCallValues : FirstCallType = {
        calls: parsedFirstCalls.calls,
        meeting: parsedFirstCalls.meeting,
        class: parsedFirstCalls.class,
        onCall: parsedFirstCalls.onCall,
        message: parsedFirstCalls.message,
        expires: parsedFirstCalls.expires,
        manualOff: parsedFirstCalls.manualOff,
        scheduledOff: parsedFirstCalls.scheduledOff,
        inUse: parsedFirstCalls.inUse,
      }
      return {firstCall: firstCallValues, newFirstCall: false, firstCallId: previousFirstCall.getId(), saveTime: previousFirstCall.getDateCreated()};
    } catch (err) {
      return {firstCall: initialFirstCall, newFirstCall: true, firstCallId: 0, saveTime: ''};
    }
  }, [state.formData.division])

  const checkDivision = useCallback(async () => {
    const departmentReq = new TimesheetDepartment();
    const user = new User();
    user.setId(loggedUserId);
    departmentReq.setIsActive(1);
    try {
      const departments = await TimesheetDepartmentClientService.BatchGet(departmentReq);
      const userData = await UserClientService.Get(user);
      const userDepartments = userData.getPermissionGroupsList().filter(user => user.getType() === 'department').reduce((aggr, item) => [...aggr, +JSON.parse(item.getFilterData()).value], [] as number[],);
      let filteredDepartments = departments.getResultsList().filter(dep => userDepartments.includes(dep.getId()));
      if (!filteredDepartments.length) {
        filteredDepartments = departments.getResultsList().filter(dep => dep.getId() === userData.getEmployeeDepartmentId()); 
      }
      const sectorList = filteredDepartments.map(sector => sector.getSectorGroup())
      const filteredSectorList = sectorList.filter((c,index) => sectorList.indexOf(c) === index && c !== 0)
        .sort((a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
      console.log(filteredSectorList);
      if (filteredSectorList.length === 1) {
        handleFormDataUpdate({division: filteredSectorList[0]});
      }   
      updateFirstCallState({
        type: 'setSectorList',
        data: sectorList});
    } catch(err) {
      console.error(err);
    }
  }, [handleFormDataUpdate, loggedUserId])

  const getInitialConstructor = useCallback(async () => {
    const techs = getTechs();
    const calls = setCalls();
    const jobTypes = getJobTypes();
    const key = getGoogleApiKey();
    const firstCall = getPreviousFirstCall();
    const results = await Promise.all([techs, calls, jobTypes, key, firstCall]);
    const newFormData : FormData = {
      departmentIds: state.formData.departmentIds,
      division: state.formData.division,
      jobTypes: [],
      meetingTime: results[4].firstCall.meeting.start,
      classTime: results[4].firstCall.class.start,
      availableTechs: results[0].techList.filter(tech => {
        const notAvailable = [];
        for (let i in results[4].firstCall.manualOff) {
          notAvailable.push(results[4].firstCall.manualOff[i].id);
        }
        for (let j in results[4].firstCall.inUse) {
          notAvailable.push(results[4].firstCall.inUse[j]);
        }
        for (let k in results[0].scheduledOff) {
          notAvailable.push(results[0].scheduledOff[k].id);
        }
        return !notAvailable.includes(tech.getUserId());
      }),
    }
    return {
      techs: results[0].techList,
      scheduledOff: results[0].scheduledOff,
      calls: results[1].availableCalls,
      jobTypes: results[2].jobTypes,
      assigned: results[1].assignedCalls,
      key: results[3].googleKey,
      firstCall: results[4].firstCall,
      isNew: results[4].newFirstCall,
      saveTime: results[4].saveTime,
      firstCallId: results[4].firstCallId,
      newFormData: newFormData,
    };
  }, [getPreviousFirstCall, getTechs, setCalls, state.formData.departmentIds, state.formData.division])

  const load = useCallback(async() => {
    const initialData = await getInitialConstructor();
    const meetingList = initialData.techs.filter(tech => {
      const meetingTechIds = []
      for (let i in initialData.firstCall.meeting.list) {
        meetingTechIds.push(initialData.firstCall.meeting.list[i].id);
      }
      return meetingTechIds.includes(tech.getUserId())
    });
    const classList = initialData.techs.filter(tech => {
      const classTechIds = []
      for (let i in initialData.firstCall.class.list) {
        classTechIds.push(initialData.firstCall.class.list[i].id);
      }
      return classTechIds.includes(tech.getUserId())
    });
    updateFirstCallState({
      type: 'setInitialValues',
      data: {
        techs: initialData.techs,
        calls: initialData.calls,
        jobTypes: initialData.jobTypes,
        assignedCalls: initialData.assigned,
        key: initialData.key,
        firstCall: initialData.firstCall,
        newFirstCall: initialData.isNew,
        saveTime: initialData.saveTime,
        firstCallId: initialData.firstCallId,
        meetingList: meetingList,
        classList: classList,
        offList: initialData.firstCall.manualOff,
        scheduledOffList: initialData.scheduledOff,
        initialFormData: initialData.newFormData,
      }
    })
  },[getInitialConstructor])

  const DROP_DOWN_SCHEMA : Schema<FormData> = [
    [
      {
        name: 'jobTypes',
        label: 'Job Type(s)',
        options: state.jobTypeList.map(jtl => ({
          key: jtl.getId() + jtl.getName(),
          label: jtl.getName(),
          value: jtl.getId(),
        })),
        type: 'multiselect',
      },
      {
        name: 'division',
        label: 'Sector',
        options: [{name:'Residential', value: 1}, {name:'Commercial Light', value: 2}, {name:'Commercial Heavy', value: 3}]
        .filter(item => state.sectorList.includes(item.value))
        .map((item) => ({
          key: item.name,
          label: item.name,
          value: item.value
        })),
        invisible: state.sectorList.length <= 1 ? true : undefined,
        helperText: state.formData.division ? '' : 'Please Select Sector',
      },
    ],
  ];

  const DIVISION_ONLY_SCHEMA : Schema<FormData> = [
    [
      {
        name: 'division',
        label: 'Sector',
        options: [{name:'Residential', value: 1}, {name:'Commercial Light', value: 2}, {name:'Commercial Heavy', value: 3}]
        .filter(item => state.sectorList.includes(item.value))
        .map((item) => ({
          key: item.name,
          label: item.name,
          value: item.value
        })),
        invisible: state.sectorList.length <= 1 ? true : undefined,
        helperText: state.formData.division ? '' : 'Please Select Sector',
      },
    ],
  ]
  const MEETING_TIME_SCHEMA : Schema<FormData> = [
    [
      {
        name: 'meetingTime',
        type: 'mui-time',
      },
    ],
  ];

  const CLASS_TIME_SCHEMA : Schema<FormData> = [
    [
      {
        name: 'classTime',
        type: 'mui-time',
      },
    ],
  ];

  useEffect(() => {
    if (state.formData.division === 0) {
      checkDivision();
    }
    if (!state.loaded && state.formData.division !== 0) {
      load();
    }
    if (state.refreshCalls && state.loaded) {
      setCalls();
    }
    if (state.save) {
      handleSave();
    }
    if (state.loaded) {
      const intervalCalls = setInterval(() => setCalls(), 30000);
      // const intervalTechs = setInterval(() => setTechs)
      return () => clearInterval(intervalCalls);
      
    }
  }, [state.loaded, state.save, handleSave, state.refreshCalls, setCalls, load, checkDivision, state.formData.division])
  
  return (
    <PageWrapper userID={loggedUserId}>
      <SectionBar 
        title="First Calls" 
        styles={{backgroundColor: "#711313", color: "white", zIndex:3}} 
      />
      {!state.loaded && (
        <Grid container spacing={1} style={{paddingTop:'20px'}}>
        <Grid item xs={12}>
          <div style={{width:'95%', margin:'auto'}}>
            <PlainForm
              schema={DIVISION_ONLY_SCHEMA}
              data={state.formData}
              onChange={(callback)=>{handleFormDataUpdate(callback)}}
                // debounce(handleChange, 1000)}
            />
          </div>
        </Grid>
        </Grid>
      )}
      {!state.loaded && state.formData.division !== 0 && (
        <Loader
          backgroundColor={'black'}
          opacity={0.5}
        />
      )}
      {state.loaded && (
      <Grid container spacing={1} style={{paddingTop:'20px'}}>
        <Grid item xs={12}>
          <div style={{width:'95%', margin:'auto'}}>
            <PlainForm
              schema={DROP_DOWN_SCHEMA}
              data={state.formData}
              onChange={(callback)=>{handleFormDataUpdate(callback)}}
                // debounce(handleChange, 1000)}
            />
          </div>
        </Grid>
        <DragDropContext 
          onDragEnd={async (callback) => {
            if (callback.destination) {
              switch (callback.destination.droppableId) {
                case 'onCallDroppable': {
                  const selectedTech = state.techs.find(tech => tech.getUserId() === Number(callback.draggableId));
                  if (selectedTech) {
                    const newOnCall = {
                      coordinator: selectedTech.getTechname(),
                      expires: format(nextSunday(new Date()), 'yyyy-MM-dd'),
                      tech: {
                        userId: selectedTech.getUserId(),
                        userPhone: selectedTech.getUserPhone(),
                        userEmail: selectedTech.getUserEmail(),
                        secondsWorked: selectedTech.getHoursWorked(),
                        name: selectedTech.getTechname()
                      }
                    }
                    if (newOnCall.tech.userId !== state.firstCallOnCall.tech.userId) {
                      updateFirstCallState({ type: 'setFirstCallOnCall', data: newOnCall});
                    }
                  }
                  break;
                }
                case 'dismissTech': {
                  updateFirstCallState({ type: 'setProcessing', data: true });
                  const manualOffTechs = state.firstCallManualOff;
                  const selectedTech = state.techs.find(tech => tech.getUserId() === Number(callback.draggableId));
                  manualOffTechs.push({id: selectedTech!.getUserId(), name: selectedTech!.getTechname()});
                  const availableTechs = state.techs.filter(tech => {
                    const notAvailable = [];
                    for (let i in manualOffTechs) {
                      notAvailable.push(manualOffTechs[i].id);
                    }
                    for (let j in state.firstCallInUse) {
                      notAvailable.push(state.firstCallInUse[j]);
                    }
                    for (let k in state.scheduledOff) {
                      notAvailable.push(state.scheduledOff[k].id);
                    }
                    return !notAvailable.includes(tech.getUserId());
                  })
                  handleFormDataUpdate({availableTechs: availableTechs});
                  updateFirstCallState({ type: 'setFirstCallManualOff', data: manualOffTechs });
                  break;
                }
                default: {
                  updateFirstCallState({ type: 'setSaveCall', data: true });
                  const inUse = state.firstCallInUse;
                  inUse.push(Number(callback.draggableId));
                  updateFirstCallState({ type: 'setFirstCallInUse', data: inUse });
                  const availableTechs = state.techs.filter(tech => {
                    const notAvailable = [];
                    for (let i in state.firstCallManualOff) {
                      notAvailable.push(state.firstCallManualOff[i].id);
                    }
                    for (let j in inUse) {
                      notAvailable.push(inUse[j]);
                    }
                    for (let k in state.scheduledOff) {
                      notAvailable.push(state.scheduledOff[k].id);
                    }
                    return !notAvailable.includes(tech.getUserId());
                  });
                  handleFormDataUpdate({availableTechs: availableTechs});
                  const selectedCall = state.calls.concat(state.assignedCalls).filter(call => call.getId() === Number(callback.destination?.droppableId))[0];
                  selectedCall.setLogTechnicianAssigned(selectedCall.getLogTechnicianAssigned().concat(selectedCall.getLogTechnicianAssigned().length > 0 ? `,${callback.draggableId}` : callback.draggableId));
                  handleCallDetails(selectedCall);
                  break;
                }
              }
            }
          }}
        >
          <Grid item xs={12}>
            <div style={{borderStyle:'solid', borderBottom:'1px', width:'98%', margin:'auto'}}></div>
          </Grid>
          <Grid item xs={12} style={{margin:'auto', display:'flex', paddingTop:'20px'}}>
            <ButtonGroup 
              fullWidth 
              variant="text" 
              style={{paddingRight:'2%', paddingLeft:'2%', paddingBottom:'10px'}}
            >
              <Button 
                key='meeting'
                fullWidth
                style={{fontSize:'18px', backgroundColor:'#711313', color:'white'}}
                onClick={() => handleModalToggle('Meeting')}
              >
                {state.meetingTechs.length ?
                  state.formData.meetingTime.substring(11,12) === '0' && state.formData.meetingTime.substring(12,13) !== '0'
                    ? `Meeting Tomorrow @ ${state.formData.meetingTime.substring(12)}`
                    : `Meeting Tomorrow @ ${state.formData.meetingTime.substring(11)}`
                  : 'No Meeting Tomorrow'}
              </Button>
              <Button
                key='class'
                fullWidth
                style={{fontSize:'18px', backgroundColor:'#711313', color:'white', marginRight:'10px', marginLeft:'10px'}}
                onClick={() => handleModalToggle('Class')}
              >
                {state.classTechs.length ? 
                  state.formData.classTime.substring(11,12) === '0' && state.formData.meetingTime.substring(12,13) !== '0'
                    ? `Class Tomorrow @ ${state.formData.classTime.substring(12)}` 
                    : `Class Tomorrow @ ${state.formData.classTime.substring(11)}` 
                  : 'No Class Tomorrow'}
              </Button>
              <Button
                key='finalize'
                fullWidth
                style={{fontSize:'18px', backgroundColor:'#711313', color:'white'}}
                onClick={() => handleFinalizeFirstCall()}
              >
                Finalize First Calls
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid container style={{paddingTop:'15px', paddingBottom:'20px'}}>
            <Grid item xs={5} style={{alignItems:'center', margin:'auto'}}>
              <Table style={{width:'92%', margin:'auto'}}>
                <TableHead></TableHead>
              <Droppable droppableId="onCallDroppable">
                {(provided,snapshot) => (
                  <TableBody
                    ref={provided.innerRef}
                    style={{
                      margin:'auto',
                      backgroundColor:snapshot.isDraggingOver ? '#711313' : '',
                    }}
                    {...provided.droppableProps} 
                  >
                    <TableRow>
                      <TableCell 
                        style={{
                          margin:'auto',
                          color:snapshot.isDraggingOver ? 'white' : '#711313',
                          fontWeight:'bold',
                          fontSize:'20px',
                          textAlign:'center',
                          borderStyle:'solid',
                          borderColor:'#711313',
                          borderWidth:'3px'
                        }}>
                        {`On Call Technician / Coordinator: ${state.firstCallOnCall.coordinator}`}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Droppable>
              </Table>
            </Grid>
            <Grid item xs={7}>
              <div style={{margin:'auto', width:'93%'}}>
                <Typography>
                  First Call Notes:
                </Typography>
                <TextareaAutosize
                  minRows={5}
                  maxRows={9}
                  style={{width:'99%', fontSize:'17px', fontStyle:'inherit'}}
                  placeholder="Please Enter Any First Call Notes Here."
                  // @ts-ignore
                  defaultValue={state.firstCallMessage.replaceAll('     ', '\n')}
                  onBlur={(text)=>{
                    if (state.firstCallMessage !== text.target.value) {
                      updateFirstCallState({ type: 'setFirstCallMessage', data: text.target.value.replace(/\n/g,'     ') });
                    }
                  }}
                />
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div style={{borderStyle:'solid', borderBottom:'1px', width:'98%', margin:'auto'}}></div>
          </Grid>
          <Grid container style={{paddingTop:'30px', paddingBottom:'20px'}}>
            <Grid item xs={5}>       
              <div style={{margin:'auto', width:'92%', opacity:state.isProcessing? 0.2 : 1}}>
                <Typography style={{textAlign:'center', fontWeight:'bold', fontSize:'32px'}}>
                  Available Technicians
                </Typography>
                <DispatchTechs
                  userID={loggedUserId}
                  dismissedTechs={[]}
                  techs={state.formData.availableTechs}
                  loading={false}
                  isFirstCall={true}
                />
                <DismissedTechs
                  userID={loggedUserId}
                  dismissedTechs={state.techs.filter(tech=>{
                    const manualOff = []
                    for (let i in state.firstCallManualOff) {
                      manualOff.push(state.firstCallManualOff[i].id);
                    }
                    return manualOff.includes(tech.getUserId());
                  })}
                  handleUndismissTech={handleUnOffTech}
                  isFirstCall={true}
                  alternateTitle={"Manual Off Technicians"}
                  processingDismissed={state.isProcessing}
                />
                <DismissedTechs
                  userID={loggedUserId}
                  dismissedTechs={state.techs.filter(tech=>{
                    const scheduledOff = []
                    for (let i in state.scheduledOff) {
                      scheduledOff.push(state.scheduledOff[i].id);
                    }
                    return scheduledOff.includes(tech.getUserId());
                  })}
                  isFirstCall={true}
                  alternateTitle={"Scheduled Off Technicians"}
                  processingDismissed={state.isProcessing}
                />
              </div>
            </Grid>
            <Grid item xs={7}>
              <div style={{margin:'auto', width:'92%'}}>
                <Typography style={{textAlign:'center', fontWeight:'bold', fontSize:'32px'}}>
                  Available Calls
                </Typography>
                <div style={{opacity: state.saveCall ? 0.2 : 1}}>
                  <DispatchCalls
                    userID={loggedUserId}
                    calls={state.calls}
                    loading={false}
                    handleMapRecenter={handleMapRecenter}
                    showAssigned={false}
                    isFirstCall={true}
                    handleDblClick={handleCallDetails}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div style={{borderStyle:'solid', borderBottom:'1px', width:'98%', margin:'auto'}}></div>
          </Grid>
          <Grid container style={{paddingTop:'20px', paddingBottom:'20px'}}>
            <Grid item xs={5}>
              <div style={{margin:'auto', width:'92%'}}>
                {state.googleApiKey != '' && (
                  <DispatchMap 
                    userID={loggedUserId}
                    apiKey={state.googleApiKey}
                    techs={[]}
                    calls={state.calls.concat(state.assignedCalls)}
                    loading={false}
                    handleMapClick={handleCallDetails}
                    center={state.center}
                    zoom={state.zoom}
                  />
                )}
              </div>
            </Grid>
            <Grid item xs={7}>
              <div style={{margin:'auto', width:'92%'}}>
                <Typography style={{fontWeight:'bold', fontSize:'32px', textAlign:'center'}}>
                  First Call Queue                    
                </Typography>
                <div style={{opacity: state.saveCall ? 0.2 : 1}}>
                  <DispatchCalls 
                    userID={loggedUserId}
                    calls={state.assignedCalls}
                    loading={false}
                    handleMapRecenter={handleMapRecenter}
                    isFirstCall={true}
                    startingIndex={state.calls.length}
                    handleDblClick={handleCallDetails}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </DragDropContext>
      </Grid>
        )}
      <Modal
        open={state.openModal}
        onClose={resetModal}
      >
        <Alert
          open={state.modalKey === 'Class' || state.modalKey === 'Meeting'}
          onClose={resetModal}
          title={`${state.modalKey} Tomorrow`}
          label="Close"
          maxWidth={(window.innerWidth * .90)}
        >
          <ClassMeeting 
            userID={loggedUserId}
            techs={state.techs.filter(tech => {
              const schedoffList = [];
              for (let i in state.scheduledOff) {
                schedoffList.push(state.scheduledOff[i].id);
              }
              return !schedoffList.includes(tech.getUserId());
            })}
            listTechs={state.modalKey === 'Meeting' ? state.meetingTechs : state.classTechs}
            schema={state.modalKey === 'Meeting' ? MEETING_TIME_SCHEMA : CLASS_TIME_SCHEMA}
            formData={state.formData}
            handleFormDataUpdate={handleFormDataUpdate}
          />
        </Alert>
        {state.modalKey === 'callInfo' && (
          <Alert
            open
            onClose={resetModal}
            title="Call Info"
            label="Close"
            maxWidth={(window.innerWidth * .80)}
          >
            <div style={{textAlign: "center"}}>
              <h2>Selected Call</h2>
            </div>

            <Grid container spacing={3} style={{width:(window.innerWidth * .65)}}>
              <Grid item xs={6}>
                <TableContainer style={{width:'100%'}}>
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
                        <TableCell style={{textAlign:"center"}}>{state.selectedCall.getDescription().length >= 200 ? state.selectedCall.getDescription().slice(0,150).concat(" ...") : state.selectedCall.getDescription()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{fontWeight:"bold", fontSize:"15px"}}>Notes:</TableCell>
                        <TableCell>
                          <TextareaAutosize
                            minRows={5}
                            style={{width:'99%', fontSize:'17px', fontStyle:'inherit'}}
                            placeholder="Please Enter Any First Call Notes Here."
                            // @ts-ignore
                            defaultValue={state.selectedCall.getNotes().replaceAll('     ', '\n')}
                            onBlur={(text) => {
                              if (text.target.value !== state.selectedCall.getNotes()) {
                                const updatedSelectedCall = state.selectedCall;
                                updatedSelectedCall.setNotes(text.target.value.replace(/\n/g,'     '));
                                updateFirstCallState({ type: 'setSelectedCall', data: updatedSelectedCall });
                              }
                            }}
                          />
                        </TableCell>

                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={6} style={{margin:'auto', position:'relative'}}>
                {state.isProcessing && (
                  <CircleProgress
                    style={{
                      position:'absolute',
                      left:'50%',
                      top:'50%',
                      zIndex:5,
                      marginLeft:-20,
                      marginTop:-20,
                      width:50,
                      height:50
                    }}
                  />
                )}
                <List
                  subheader={
                    <ListSubheader style={{textAlign:'center', fontSize:'20px', margin:'auto'}}>
                      Assigned Technicians
                    </ListSubheader>
                  }
                  style={{display:'table',margin:'auto',alignItems:'center', opacity:state.isProcessing?0.2:1}}
                >
                  {!state.assigneeList.length && (
                    <ListItemText style={{textAlign:'center'}}>
                      No Assigned Technicians
                    </ListItemText>
                  )}
                  {state.assigneeList.length > 0 && state.assigneeList.map((assignee, index) => {
                    return (
                      <ListItem
                        key={index}
                      >
                        <ListItemIcon onClick={()=>{if(!state.isProcessing) handleUpdateAssignTech(assignee.id, 'remove')}}>
                          <RemoveCircleOutlineTwoTone
                            color='primary'
                          />
                        </ListItemIcon>
                        <ListItemText>
                          {assignee.name}
                        </ListItemText>
                      </ListItem>
                    )
                  })}
                  <ListItem
                    key="addNew"
                  >
                    <ListItemIcon onClick={handleAddTechToggle}>
                      <AddCircleOutlineTwoTone
                        color='secondary'
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <PlainForm
                        schema={[[{
                          name: "tempAssigneeList",
                          label: "Select Technician(s)",
                          options: state.formData.availableTechs
                            .filter(tech => !state.selectedCall.getLogTechnicianAssigned().split(',').includes(String(tech.getUserId())))
                            .sort((a,b) => (a.getTechname() > b.getTechname()) ? 1 : ((b.getTechname() > a.getTechname()) ? -1 : 0))
                            .map(tech => ({
                              key: tech.getUserId() + tech.getTechname(),
                              label: tech.getTechname(),
                              value: tech.getUserId(),
                            })),
                          invisible: !state.showAddTech ? true : undefined,
                          displayEmpty: true,
                        }]]}
                        data={state}
                        onChange={(callback)=>{
                          if (callback.tempAssigneeList !== ''){
                            handleUpdateAssignTech(Number(callback.tempAssigneeList), 'add');
                            callback.tempAssigneeList = '';
                            handleAddTechToggle();
                          }
                        }}
                        fullWidth
                      />
                    </ListItemText>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Alert>
        )}
      </Modal>
    </PageWrapper>
  );
};