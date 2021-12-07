import React, { useReducer, useCallback, useEffect } from 'react';
import { FormData, FirstCallType, TechObj, CallObj, State, reducer } from './reducer';
import { ClassMeeting } from './classMeeting';
import { PageWrapper } from '../../PageWrapper/main';
import { SectionBar } from '../SectionBar';
import { Alert as ModalAlert } from '../Alert';
import { Confirm } from '../Confirm';
import { Modal } from '../Modal';
import { Schema, PlainForm } from '../PlainForm';
import { Loader } from '../../Loader/main';
import { ServiceRequest } from '../ServiceCall/requestIndex';
import { DispatchTechs } from '../Dispatch/dispatchTechnicians';
import { DismissedTechs } from '../Dispatch/dismissedTechnicians';
import { DispatchCalls } from '../Dispatch/dispatchCalls';
import { DispatchMap } from '../Dispatch/dispatchMap';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setSeconds from 'date-fns/esm/setSeconds';
import nextSunday from 'date-fns/esm/nextSunday';
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
  EventAssignmentClientService,
  PropertyClientService,
} from '../../../helpers';
import { DispatchableTech, DispatchCall} from '@kalos-core/kalos-rpc/Dispatch';
import { User } from '@kalos-core/kalos-rpc/User';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { ApiKey } from '@kalos-core/kalos-rpc/ApiKey';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { DateRange } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { FirstCall } from '@kalos-core/kalos-rpc/FirstCall';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { EventAssignment } from '@kalos-core/kalos-rpc/EventAssignment';
import { Property } from '@kalos-core/kalos-rpc/Property';
import RemoveCircleOutlineTwoTone from '@material-ui/icons/RemoveCircleOutlineTwoTone';
import CircleProgress from '@material-ui/core/CircularProgress';
import AddCircleOutlineTwoTone from '@material-ui/icons/AddCircleOutlineTwoTone';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';

export interface Props {
  loggedUserId: number;
  testUserId?: number;
  disableSlack?: boolean;
  slackClientId?: string;
}

const initialFCCall : CallObj = {
  assigned: [],
  start: '',
  end: '',
  id: 0,
  propertyAddress: '',
  propertyCity: '',
  propertyState: '',
  propertyId: 0,
  userId: 0,
  description: '',
  custName: '',
  userBusinessName: '',
  jobType: '',
  subType: '',
  notes: ''
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
  users: [],
  techs: [],
  offTechs: [],
  scheduledOff: [],
  meetingTechs: [],
  classTechs: [],
  onCallTech: new DispatchableTech(),
  calls: [],
  availableCalls: [],
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
  currentFCCall: initialFCCall,
  isProcessing: false,
  assigneeList: [],
  callMsg: '',
  save: false,
  newFirstCall: false,
  saveTime: '',
  firstCallId: 0,
  errorMessage: '',
  saveCall: false,
  showAddTech: false,
  tempAssigneeList: '',
  refreshCalls: false,
  isApproved: false,
  hasNotification: false,
  notificationType: '',
  notificationMessage: [],
  pendingAddInUse: [],
  pendingRemoveInUse: [],
  userHasApiKey: false,
  checkUser: false,
};

export const FirstCallDashboard: React.FC<Props> = function FirstCallDashboard({
  loggedUserId,
  testUserId=0,
  disableSlack=false,
  slackClientId="11208000564.292497115846",
}) {
  const [state, updateFirstCallState] = useReducer(reducer, initialState);

  const handleModalToggle = (modalKey : string) => {
    updateFirstCallState({
      type: 'setModal',
      data: {
        openModal: !state.openModal,
        modalKey: modalKey,
        currentFC: state.savedFirstCall,
        callMsg: '',
      }
    });
  }

  const handleNotification = useCallback((message: string | string[], type: string, hasError = true) => {
    let updateNotification = true;
    let errorMessage = state.notificationMessage;
    if (typeof message === "string") {
      if (!errorMessage.includes(message)) {
        if (type === state.notificationType) { // If error/warning is same as current error/warning, then stack.
          errorMessage = errorMessage.concat(message);
        } else if (state.notificationType === "error" && hasError === true) { // Prevent warning message from overwriting error message.
          updateNotification = false;
        } else {
          errorMessage = [message];
        }
      } else {
        updateNotification = false;
      }
    } else {
      errorMessage = message;
    }
    if (updateNotification) {
      updateFirstCallState({type: 'setNotification', data: {
        hasNotification: hasError,
        notificationType: type,
        notificationMessage: errorMessage,
      }});
    }
  }, [state.notificationMessage, state.notificationType])

  const checkErrors = useCallback((errorMessage : string) => {
    if (state.notificationType === "error" && state.notificationMessage.includes(errorMessage)) {
      // Reset Service Call error on successful Get
      let newMessage : string[] | string = "";
      let newType = "";
      let hasError = false;
      if (state.notificationMessage.length > 1) {
        newMessage = state.notificationMessage;
        newMessage.splice(newMessage.findIndex(msg => msg === errorMessage),1);
        newType = state.notificationType;
        hasError = true;
      }
      handleNotification(newMessage, newType, hasError);
    }
  }, [state.notificationMessage, state.notificationType, handleNotification])

  const handleAddTechToggle = () => {
    updateFirstCallState({ type: 'setShowAddTech', data: !state.showAddTech });
  }
  const equals = (a : any, b : any) =>
    a.length === b.length &&
    a.every((v : any, i : number) => v === b[i]);

  const resetModal = async(refreshCalls = false, save = false) => {
    switch (state.modalKey) {
      case 'Class': {
        const techList : {id: number, name: string}[] = [];
        state.classTechs.map(tech => techList.push({id: tech.getUserId(), name: tech.getTechname()}));
        const data = {
          isTomorrow: state.classTechs.length ? true : false,
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
          isTomorrow: state.meetingTechs.length ? true : false,
          start: state.formData.meetingTime,
          list: techList,
        };
        if (data.start !== state.firstCallMeeting.start || !equals(data.list,state.firstCallMeeting.list)) {
          updateFirstCallState({ type: 'setFirstCallMeeting', data: data});
        }
        break;
      }
      case 'callInfo': {
        const firstCalls = state.firstCallCalls;
        const currentFCCall = state.currentFCCall;
        if (state.hasNotification) {
          handleNotification("", "", false);
        }
        if (state.showAddTech) {
          handleAddTechToggle();
        }
        if (save) {
          const newAssignees : TechObj[] = [];
          for (const i in state.assigneeList) {
            const tech = state.techs.find(tech => tech.getUserId() === state.assigneeList[i].id)!;
            newAssignees.push({
              userId: state.assigneeList[i].id,
              userPhone: tech.getUserPhone(),
              userEmail: tech.getUserEmail(),
              name: tech.getTechname(),
              secondsWorked: tech.getHoursWorked(),
            });
          }
          currentFCCall.assigned = newAssignees;
          currentFCCall.notes = state.callMsg;
          updateFirstCallState({type: 'setProcessing', data: true});
          const fcCallIndex = state.firstCallCalls.findIndex(call => call.id === currentFCCall.id);
          if (fcCallIndex >= 0 && currentFCCall.assigned.length) // Replace Current Entry if there are Assignees
            firstCalls[fcCallIndex] = currentFCCall;
          else if (fcCallIndex >= 0) // Remove Current Entry if there are no Assignees
            firstCalls.splice(firstCalls.findIndex(call => call.id === state.selectedCall.getId()),1);
          else if (currentFCCall.assigned.length) // Add New Entry if Assignees
            firstCalls.push(currentFCCall);
          // Else do nothing
          const fcInUse = state.firstCallInUse;
          for (const i in state.pendingAddInUse) {
            if (!fcInUse.includes(state.pendingAddInUse[i])) {
              fcInUse.push(state.pendingAddInUse[i]);
            }
          }
          for (const j in state.pendingRemoveInUse) {
            fcInUse.splice(fcInUse.findIndex(tech => tech === state.pendingRemoveInUse[j]), 1);
          }
          updateFirstCallState({type: 'setFCCallsAndInUse', data: {
            calls: firstCalls,
            inUse: fcInUse,
          }});
          console.log("here");
          updateFirstCallState({ type: 'setRefreshCalls', data: true });
        }
        updateFirstCallState({type: 'setAssigneeListAndPendingInUse', data: {
          assigneeList: [],
          pendingAdd: [],
          pendingRemove: [],
        }});
        updateFirstCallState({type: 'setProcessing', data: false});
        break;
      } case 'fcPreview': {
        if (state.isApproved) {
          updateFirstCallState({type: 'setFinalApproval', data: false});
        }
        break;
      }
    }
    if (refreshCalls) { // If Edit Service Call Modal is Saved
      const calls = await setCalls();
      if (calls.error.length > 0) {
        handleNotification(calls.error, "error");
      }
      updateFirstCallState({ type: 'setCalls', data: {
        calls: calls.calls,
        assigned: calls.assignedCalls,
        available: calls.availableCalls,
      }});
    }
    updateFirstCallState({
      type: 'setModal',
      data: {
        openModal: !state.openModal,
        modalKey: '',
        currentFC: state.savedFirstCall,
        callMsg: '',
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
      try {
        const departments = await TimesheetDepartmentClientService.BatchGet(departmentReq);
        updateFormData.departmentIds = departments.getResultsList().map(dep => dep.getId());
      } catch (err) {
        console.error(err);
        handleNotification("- Failed to Retrieve Departments.", "error");
      }
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
  }, [state.formData, state.loaded, handleNotification])

  const handleCallDetails = async (call : DispatchCall, editCall = false, techAssign? : DispatchableTech) => {
    if (editCall) {
      updateFirstCallState({
        type: 'setModal',
        data: {
          openModal: true,
          modalKey: 'editRequest',
          selectedCall: call,
          assigneeList: [],
          currentFC: state.savedFirstCall,
          callMsg: '',
        }
      });
    } else {
      let currentFCCall = state.firstCallCalls.find(fcCall => fcCall.id === call.getId());
      let errorMessage = "";
      const techsAlreadyAssigned : string[] = [];
      const techsNotFound : number[] = [];
      const assigneeList : {id: number, name: string}[] = [];
      const techAssigneeList : TechObj[] = [];
      const callAssignees = call.getLogTechnicianAssigned().split(',');
      const pendingAddInUse : number[] = [];
      if (!currentFCCall) {
        for (const i in callAssignees) {
          if (callAssignees[i] != "" && callAssignees[i] != "0") {
            const tech = state.techs.find(tech => tech.getUserId() === Number(callAssignees[i]));
            if (tech) {
              if (state.firstCallInUse.includes(Number(callAssignees[i]))) {
                techsAlreadyAssigned.push(tech.getTechname());
              } else {
                techAssigneeList.push({
                  userId: tech.getUserId(),
                  name: tech.getTechname(),
                  userEmail: tech.getUserEmail(),
                  userPhone: tech.getUserPhone(),
                  secondsWorked: tech.getHoursWorked(),
                });
                pendingAddInUse.push(tech.getUserId());
              }
            } else {
              techsNotFound.push(Number(callAssignees[i]));
            }
          }
        }
        if (techsAlreadyAssigned.length) {
          errorMessage += `- Could Not Add `;
          for (const i in techsAlreadyAssigned) {
            if (i === "0") {
              errorMessage += techsAlreadyAssigned[i];
            } else if (i === String(techsAlreadyAssigned.length - 1) && techsAlreadyAssigned.length === 2) {
              errorMessage += ` and ${techsAlreadyAssigned[i]}`;
            } else if (i === String(techsAlreadyAssigned.length - 1)) {
              errorMessage += `, and ${techsAlreadyAssigned[i]}`;
            } else {
              errorMessage += `, ${techsAlreadyAssigned[i]}`;
            }
          }
          errorMessage += `. They are already assigned on another first call.`
        }
        if (techsNotFound.length && techsAlreadyAssigned.length) {
          errorMessage += '     '; // Necessary for split to move to next line
        }
        if (techsNotFound.length) {
          errorMessage += `- Could Not Add `;
          const usersNotFound = state.users.filter(user => techsNotFound.includes(user.getId()));
          for (const j in usersNotFound) {
            if (j === "0") {
              errorMessage += `${usersNotFound[j].getFirstname()} ${usersNotFound[j].getLastname()}`;
            } else if (j === String(usersNotFound.length - 1) && usersNotFound.length === 2) {
              errorMessage += ` and ${usersNotFound[j].getFirstname()} ${usersNotFound[j].getLastname()}`;
            } else if (j === String(usersNotFound.length - 1)) {
              errorMessage += `, and ${usersNotFound[j].getFirstname()} ${usersNotFound[j].getLastname()}`;
            } else {
              errorMessage += `, ${usersNotFound[j].getFirstname()} ${usersNotFound[j].getLastname()}`;
            }
          }
          errorMessage += `.  They are not in this department.`
        }
        if (errorMessage.length) {
          handleNotification(errorMessage, "warning");
        }
        if (techAssign) {
          techAssigneeList.push({
            userId: techAssign.getUserId(),
            name: techAssign.getTechname(),
            userEmail: techAssign.getUserEmail(),
            userPhone: techAssign.getUserPhone(),
            secondsWorked: techAssign.getHoursWorked(),
          });
          pendingAddInUse.push(techAssign.getUserId());
        }
        currentFCCall = {
          assigned: techAssigneeList,
          id: call.getId(),
          start: call.getTimeStarted(),
          end: call.getTimeEnded(),
          propertyAddress: call.getPropertyAddress(),
          propertyCity: call.getPropertyCity(),
          propertyId: call.getPropertyId(),
          propertyState: call.getPropertyState(),
          userId: call.getUserId(),
          description: call.getDescription(),
          custName: call.getCustName(),
          userBusinessName: call.getUserBusinessname(),
          jobType: call.getJobType(),
          subType: call.getJobSubtype(),
          notes: call.getNotes(),
        }
      }
      updateFirstCallState({type: 'setCurrentFCCallAndPendingInUse', data: {
        currentFCCall: currentFCCall,
        pendingAdd: pendingAddInUse,
        pendingRemove: [],
      }});
      for (const i in currentFCCall.assigned) {
        assigneeList.push({id: currentFCCall.assigned[i].userId, name: currentFCCall.assigned[i].name});
      }
      updateFirstCallState({
        type: 'setModal',
        data: {
          openModal: true,
          modalKey: 'callInfo',
          assigneeList: assigneeList,
          selectedCall: call,
          currentFC: state.savedFirstCall,
          callMsg: state.firstCallCalls.find(fcCall => fcCall.id === call.getId()) ? state.firstCallCalls.find(fcCall => fcCall.id === call.getId())!.notes : call.getNotes()
        }
      });
    }
  }

  const getAvailableTechs = useCallback((techs : DispatchableTech[] = [], manualOff : {id: number, name: string}[] = [], inUse : number[] = [], scheduledOff: {id: number, name: string}[] = [], returnArray = false) => {
    const technicians = techs.length ? techs : state.techs;
    const manualOffTechs = manualOff.length ? manualOff : state.firstCallManualOff;
    const inUseTechs = inUse.length ? inUse : state.firstCallInUse;
    const scheduledOffTechs = scheduledOff.length ? scheduledOff : state.firstCallScheduledOff;
    const availableTechs = technicians.filter(tech => {
      const notAvailable = [];
      for (let i in manualOffTechs) {
        notAvailable.push(manualOffTechs[i].id);
      }
      for (let j in inUseTechs) {
        notAvailable.push(inUseTechs[j]);
      }
      for (let k in scheduledOffTechs) {
        notAvailable.push(scheduledOffTechs[k].id);
      }
      return !notAvailable.includes(tech.getUserId());
    });
    if (returnArray) {
      return availableTechs;
    } else {
      handleFormDataUpdate({availableTechs: availableTechs});
    }
  }, [handleFormDataUpdate, state.firstCallInUse, state.firstCallManualOff, state.firstCallScheduledOff, state.techs])

  const handleUpdateAssignTech = async (id : number, updateType : string) => {
    updateFirstCallState({ type: 'setProcessing', data: true });
    const currentAssignees = state.assigneeList;
    const removeInUse = state.pendingRemoveInUse;
    const addInUse = state.pendingAddInUse;
    if (updateType === 'remove') {
      removeInUse.push(id);
      if (addInUse.includes(id)) {
        addInUse.splice(addInUse.findIndex(tech=>tech===id), 1);
      }
      currentAssignees.splice(currentAssignees.findIndex(tech => tech.id === id),1);
    } else {
      addInUse.push(id);
      if (removeInUse.includes(id)) {
        removeInUse.splice(removeInUse.findIndex(tech=>tech===id), 1);
      }
      const techAssigned = state.techs.find(tech => tech.getUserId() === id)!;
      currentAssignees.push({
        id: id,
        name: techAssigned.getTechname(),
      });
    }
    updateFirstCallState({
      type: 'setAssigneeListAndPendingInUse',
      data: {
        assigneeList: currentAssignees,
        pendingAdd: addInUse,
        pendingRemove: removeInUse,
      }
    });
    updateFirstCallState({ type: 'setProcessing', data: false });
  }

  const handleUnOffTech = async (tech : DispatchableTech) => {
    updateFirstCallState({ type: 'setProcessing', data: true});
    const offTechs = state.firstCallManualOff;
    const index = offTechs.findIndex(offTech => offTech.id === tech.getUserId());
    offTechs.splice(index,1);
    getAvailableTechs([], offTechs, [], [], false);
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
          handleNotification("- Failed to Retrieve Latitude and Longitude.", "error");
          newCenter = {lat: 0, lng: 0};
        }
      } else {
        handleNotification("- No Valid Latitude, Longitude, or Address found.", "error");
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
    let errorMessage = "";
    for (const i in state.firstCallCalls) {
      const assignment = new EventAssignment();
      assignment.setEventId(state.firstCallCalls[i].id);
      try {
        const assignedEvents = await EventAssignmentClientService.BatchGet(assignment);
        const results = assignedEvents.getResultsList();
        for (const event in results) {
          assignment.setId(results[event].getId());
          EventAssignmentClientService.Delete(assignment);
        }
      } catch (err) {
        console.error(err);
      }
      const newAssignment = new EventAssignment();
      newAssignment.setEventId(state.firstCallCalls[i].id);
      const call = new Event();
      const techAssigned : string[] = [];
      call.setId(state.firstCallCalls[i].id);
      for (const j in state.firstCallCalls[i].assigned) {
        techAssigned.push(String(state.firstCallCalls[i].assigned[j].userId));
        newAssignment.setUserId(state.firstCallCalls[i].assigned[j].userId);
        try {
          EventAssignmentClientService.Create(newAssignment);
        } catch (err) {
          console.error(err);
          if (errorMessage !== "") {
            errorMessage += `     `;
          }
          errorMessage += `- Failed to Assign ${state.firstCallCalls[i].assigned[j].name} to Call ${state.selectedCall.getId()}`;
        }
      }
      call.setLogTechnicianAssigned(techAssigned.toString());
      call.setNotes(state.firstCallCalls[i].notes);

      try {
        EventClientService.Update(call);
      } catch (err) {
        console.error(err);
        if (errorMessage !== "") {
          errorMessage += `     `;
        }
        errorMessage += `- Failed to Update Call ${state.selectedCall.getId()}`;
      }
    }
    if (errorMessage !== "") {
      handleNotification(errorMessage, "error");
    }
  }

  const handleFirstCallPreview = async () => {
    const currentFC = await getPreviousFirstCall();
    updateFirstCallState({
      type: 'setModal', 
      data: {
        openModal: true,
        modalKey: 'fcPreview',
        currentFC: currentFC.firstCall,
        callMsg: '',
      }
    })
  }

  const handleSave = useCallback(async () => {
    updateFirstCallState({type: 'setProcessing', data: true});
    let allowSave = true;
    let id = 0;
    const saveTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
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
    try {
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
        updateFirstCallState({ type: 'setFailedSave', data: {save: false, error: 'DateMismatch'}});
        handleNotification("- A Newer Version Exists.  Please Refresh the Page.", "warning");
      } else {
        if (state.newFirstCall) {
          const newCall = await FirstCallClientService.Create(firstCall);
          id = newCall.getId();
        } else if (allowSave) {
          await FirstCallClientService.Update(firstCall);
        } 
        updateFirstCallState({ type: 'setSave', data: {save: false, saveTime: saveTime, firstCallId: id, isNew: false}});
        handleNotification("- Save Successful!", "success");
      }
    } catch (err) {
      console.error(err);
      updateFirstCallState({ type: 'setFailedSave', data: {save: false, error: 'Error'}});
      handleNotification("- Failed to Save First Call Information.", "error");
    }
    updateFirstCallState({type: 'setProcessing', data: false});
  }, [
    state.firstCallCalls, state.firstCallMeeting,
    state.firstCallClass, state.firstCallManualOff,
    state.firstCallInUse, state.firstCallOnCall,
    state.firstCallMessage, state.firstCallExpires,
    state.firstCallId, state.formData.division,
    state.newFirstCall, state.saveTime,
    state.scheduledOff, handleNotification,
  ]);

  const handleFinalizeFirstCall = async() => {
    updateFirstCallState({type:'setProcessing', data:true});
    if (state.firstCallCalls.length) {
      await handleCallUpdate();
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
    updateFirstCallState({type:'setProcessing', data: false});
    resetModal();
  }

  const handleGeocodeUpdate = async(type : string, id : number, geo : {lat: number, lng: number}) => {
    if (type === "user") {
      const tech = new User();
      tech.setId(id);
      tech.setGeolocationLat(Number(geo.lat.toFixed(8)));
      tech.setGeolocationLng(Number(geo.lng.toFixed(8)));
      try {
        await UserClientService.Update(tech);
      } catch (err) {
        console.error(err);
      }
      const users = state.users;
      users.forEach(user => {if (user.getId() === id) {user.setGeolocationLat(geo.lat); user.setGeolocationLng(geo.lng);} });
      updateFirstCallState({type: 'setUsers', data: {users}});
    } else if (type === "property") {
      const property = new Property();
      property.setId(id);
      property.setGeolocationLat(Number(geo.lat.toFixed(8)));
      property.setGeolocationLng(Number(geo.lng.toFixed(8)));
      try {
        await PropertyClientService.Update(property);
      } catch (err) {
        console.error(err);
      }
      const availableCalls : DispatchCall[] = [];
      const assignedCalls : DispatchCall[] = [];
      const calls = state.calls;
      calls.forEach(call => {if (call.getPropertyId() === id) {call.setGeolocationLat(geo.lat); call.setGeolocationLng(geo.lng);} });
      const sortedFirstCalls = state.firstCallCalls.sort((a,b) => {
        const dateA = new Date(`${calls[0].getDateStarted()} ${a.start}`);
        const dateB = new Date(`${calls[0].getDateStarted()} ${b.start}`);
        return dateA > dateB ? 1 : dateB > dateA ? -1 : 0;
      });
  
      for (let i in sortedFirstCalls) {
        const fcCall = calls.slice(0).find(call => call.getId() === sortedFirstCalls[i].id);
        const logTechAssigned : string[] = [];
        const logTechNames : string[] = [];
        if (fcCall) {
          sortedFirstCalls[i].assigned.forEach(tech => {logTechAssigned.push(String(tech.userId)); logTechNames.push(tech.name)});
          fcCall.setLogTechnicianAssigned(logTechAssigned.toString());
          fcCall.setAssigned(logTechNames.toString());
          assignedCalls.push(fcCall);
        }
      }
      calls.forEach(call => {
        if (!assignedCalls.includes(call)) {
          availableCalls.push(call);
        }
      });
      updateFirstCallState({type: 'setCalls', data: {
        calls,
        available: availableCalls,
        assigned: assignedCalls,
      }});
    }
  }

  const getAllEmployees = useCallback (async() => {
    const errorMessage = "- Failed to Retrieve All Users."
    try {
      return {users : await UserClientService.loadTechnicians(), error: ""};
    } catch (err) {
      return {users : [], error: errorMessage};
    }
  }, [])

  const getTechs = useCallback (async (userList: User[] = state.users) => {
    const techs = new DispatchableTech();
    const dr = new DateRange();
    const errorMessage = "- Failed to Retrieve Technician List.";
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
      const userTechList = userList.filter(user => user.getIsHvacTech() === 1 && state.formData.departmentIds.includes(user.getEmployeeDepartmentId()));
      const dispatchableTechs = await DispatchClientService.GetDispatchableTechnicians(techs);
      const techList = dispatchableTechs.getResultsList();
      const techIds = techList.map(tech => tech.getUserId());
      const missingTechs = userTechList.filter(user => !techIds.includes(user.getId()));
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
      checkErrors(errorMessage);
      return {techList: techList, scheduledOff: timeoffIds, error: ""};
    } catch (err) {
      console.error(err);
      return {techList: [], scheduledOff: [], error: errorMessage}
    }
  }, [state.formData.departmentIds, state.users, checkErrors]);

  const setTechs = useCallback(async () => {
    const techs = await getTechs();
    const availableTechs = getAvailableTechs(techs.techList, [], [], techs.scheduledOff, true)!;
    const newFormData : FormData = {
      departmentIds: state.formData.departmentIds,
      division: state.formData.division,
      jobTypes: state.formData.jobTypes,
      meetingTime: state.formData.meetingTime,
      classTime: state.formData.classTime,
      availableTechs: availableTechs,
    }
    return {techList: techs.techList, newFormData, scheduledOff: techs.scheduledOff, error: techs.error}
  }, [
    getTechs, state.formData.classTime, 
    state.formData.departmentIds, state.formData.division, 
    state.formData.jobTypes, state.formData.meetingTime,
    getAvailableTechs
  ]);

  const getCalls =  useCallback(async () => {
    const newCall = new DispatchCall();
    const errorMessage = "- Failed to Retrieve Service Calls";  // If errors, show this message
    let filteredCallList : DispatchCall[] = [];
    if (state.formData.division === 1) {
      newCall.setDateStarted(`${format(addDays(new Date(), 1), 'yyyy-MM-dd')}%`);
    }
    newCall.setSectorGroupList(state.formData.division.toString());
    newCall.setJobTypeIdList(state.formData.jobTypes.toString());
    try {
      const callList = await DispatchClientService.GetDispatchCalls(newCall);
      if (state.formData.division === 1) {
        filteredCallList = callList.getResultsList()
        .filter(call =>
          Number(call.getTimeStarted().substring(0,2)) >= 7 &&
          Number(call.getTimeStarted().substring(0,2)) <= 12
        )
      } else {
        filteredCallList = callList.getResultsList()
        .filter(call => {
          return (call.getDateStarted() <= format(addDays(new Date(), 1), 'yyyy-MM-dd') &&
          call.getDateEnded() >= format(addDays(new Date(), 1), 'yyyy-MM-dd'))
        })
      }
      checkErrors(errorMessage);
      return {filteredCallList, error: ""};
    } catch (err) {
      return {filteredCallList: [], error: errorMessage};
    }
  }, [state.formData.jobTypes, state.formData.division, checkErrors])

  const setCalls = useCallback(async (skipGet = false, firstCalls? : CallObj[]) => {
    let firstCall = firstCalls;
    if (!firstCall) {
      firstCall = state.firstCallCalls;
    }
    const availableCalls : DispatchCall[] = [];
    const assignedCalls : DispatchCall[] = [];
    let calls : DispatchCall[] = [];
    let errorMessage = "";
    if (skipGet) {
      calls = state.calls;
    } else {
      const call = await getCalls()
      calls = call.filteredCallList;
      errorMessage = call.error;
    }
    const sortedFirstCalls = firstCall.sort((a,b) => {
      const dateA = new Date(`${calls[0].getDateStarted()} ${a.start}`);
      const dateB = new Date(`${calls[0].getDateStarted()} ${b.start}`);
      return dateA > dateB ? 1 : dateB > dateA ? -1 : 0;
    });
    for (let i in sortedFirstCalls) {
      const fcCall = calls.slice(0).find(call => call.getId() === sortedFirstCalls[i].id);
      const logTechAssigned : string[] = [];
      const logTechNames : string[] = [];
      if (fcCall) {
        sortedFirstCalls[i].assigned.forEach(tech => {logTechAssigned.push(String(tech.userId)); logTechNames.push(tech.name)});
        fcCall.setLogTechnicianAssigned(logTechAssigned.toString());
        fcCall.setAssigned(logTechNames.toString());
        assignedCalls.push(fcCall);
      }
    }
    calls.forEach(call => {
      if (!assignedCalls.includes(call)) {
        availableCalls.push(call);
      }
    });
    return {calls, availableCalls, assignedCalls, error: errorMessage};
  }, [getCalls, state.calls, state.firstCallCalls])

  const getJobTypes = useCallback(async () => {
    const jobTypeReq = new JobType();
    const errorMessage = "- Failed to Retrieve Job Types.";
    try {
      const jobTypes = await JobTypeClientService.BatchGet(jobTypeReq);
      checkErrors(errorMessage);
      return {jobTypes: jobTypes.getResultsList(), error: ""};
    } catch (err) {
      console.error(`An error occurred while getting Job Types: ${err}`);
      return {jobTypes: [], error: errorMessage};
    }
  }, [checkErrors])

  const getGoogleApiKey = useCallback(async () => {
    const newKey = new ApiKey();
    const errorMessage = "- Failed to Load Google Maps.";
    newKey.setTextId('google_maps');
    try {
      const googleKey = await ApiKeyClientService.Get(newKey);
      checkErrors(errorMessage);
      return {googleKey: googleKey.getApiKey(), error: ""};
    } catch (err) {
      console.error(
        `An error occurred while getting Google API Key: ${err}`
      );
      return {googleKey: '', error: errorMessage};
    }
  }, [checkErrors])

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
      return {firstCall: firstCallValues, newFirstCall: false, firstCallId: previousFirstCall.getId(), saveTime: previousFirstCall.getDateCreated(), error: ""};
    } catch (err) {
      return {firstCall: initialFirstCall, newFirstCall: true, firstCallId: 0, saveTime: '', error: ""};
    }
  }, [state.formData.division])

  const checkDivision = useCallback(async () => {
    const departmentReq = new TimesheetDepartment();
    const user = new User();
    const errorMessage = "- Failed to User Department Information";
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
      if (filteredSectorList.length === 1) {
        handleFormDataUpdate({division: filteredSectorList[0]});
      }
      checkErrors(errorMessage);
      updateFirstCallState({
        type: 'setSectorList',
        data: sectorList});
    } catch(err) {
      console.error(err);
      handleNotification(errorMessage, "error");
    }
  }, [handleFormDataUpdate, loggedUserId, handleNotification, checkErrors])

  const userCheck = useCallback(async () => {
    const url = new URL(window.location.href);
    const apiKey = new ApiKey();
    const secretApiKey = new ApiKey();
    secretApiKey.setTextId("slack_client_secret");
    apiKey.setApiUser(loggedUserId);
    apiKey.setTextId("slack_dispatch_as_user");
    try {
      if (url.searchParams.get("code")) {
        const secretKey = await ApiKeyClientService.Get(secretApiKey);
        const token = await axios.get(`https://slack.com/api/oauth.access?client_id=${slackClientId}&client_secret=${secretKey.getApiKey()}&code=${url.searchParams.get("code")}&redirect_uri=https://app.kalosflorida.com/index.cfm?action=admin:dispatch.firstcall`)
        const apiToken = token.data.access_token;
        const slackApiKey = new ApiKey();
        slackApiKey.setApiUser(loggedUserId);
        slackApiKey.setTextId("slack_dispatch_as_user");
        slackApiKey.setApiKey(apiToken);
        await ApiKeyClientService.Create(slackApiKey);
      } else {
        await ApiKeyClientService.Get(apiKey);
      }
      updateFirstCallState({type: 'setUserHasApiKey', data: true});
    } catch (err) {
      updateFirstCallState({type: 'setUserHasApiKey', data: false});
    }
  }, [loggedUserId, slackClientId])

  const getInitialConstructor = useCallback(async () => {
    const users = await getAllEmployees();
    const techs = getTechs(users.users);
    const firstCall = await getPreviousFirstCall();
    const calls = setCalls(false, firstCall.firstCall.calls);
    const jobTypes = getJobTypes();
    const key = getGoogleApiKey();
    const results = await Promise.all([techs, calls, jobTypes, key, firstCall, users]);
    let errorArray : string[] = [];
    const newFormData : FormData = {
      departmentIds: state.formData.departmentIds,
      division: state.formData.division,
      jobTypes: [],
      meetingTime: results[4].firstCall.meeting.start,
      classTime: results[4].firstCall.class.start,
      availableTechs: getAvailableTechs(results[0].techList, results[4].firstCall.manualOff, results[4].firstCall.inUse, results[0].scheduledOff, true)!,
    }
    for (let i = 0; i < results.length; i++) {
      if (results[i].error) {
        errorArray = errorArray.concat(results[i].error);
      }
    }
    if (errorArray.length > 0) {
      handleNotification(errorArray, "error")
    }
    return {
      users: results[5].users,
      techs: results[0].techList,
      scheduledOff: results[0].scheduledOff,
      calls: results[1].calls,
      jobTypes: results[2].jobTypes,
      available: results[1].availableCalls,
      assigned: results[1].assignedCalls,
      key: results[3].googleKey,
      firstCall: results[4].firstCall,
      isNew: results[4].newFirstCall,
      saveTime: results[4].saveTime,
      firstCallId: results[4].firstCallId,
      newFormData: newFormData,
    };
  }, [getPreviousFirstCall, getTechs, setCalls, getGoogleApiKey, getJobTypes, getAllEmployees, state.formData.departmentIds, state.formData.division, getAvailableTechs, handleNotification])

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
        users: initialData.users,
        techs: initialData.techs,
        calls: initialData.calls,
        jobTypes: initialData.jobTypes,
        availableCalls: initialData.available,
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
    if (!state.checkUser) {
      userCheck();
    }
    if (state.formData.division === 0) {
      checkDivision();
    }
    if (!state.loaded && state.formData.division !== 0 && state.formData.departmentIds.length !== 0) {
      load();
    }
    if (state.refreshCalls && state.loaded) {
      console.log("it is in the spot");
      (async() => {
        console.log("refresh call reached");
        const calls = setCalls(true);
        const techs = setTechs();
        const results = await Promise.all([calls, techs]);
        let errorMessage : string[] = [];
        if (results[0].error) {
          errorMessage = errorMessage.concat(results[0].error);
        }
        if (results[1].error) {
          errorMessage = errorMessage.concat(results[1].error);
        }
        if (errorMessage.length > 0) {
          handleNotification(errorMessage, "error");
        }
        console.log(results[0]);
        console.log(results[1]);
        updateFirstCallState({type: 'refreshCallsAndTechs', data: {
          techs: results[1].techList,
          scheduledOff: results[1].scheduledOff,
          newFormData: results[1].newFormData,
          calls: results[0].calls,
          available: results[0].availableCalls,
          assigned: results[0].assignedCalls,
        }});
      })()
    }
    if (state.save && !state.isProcessing) {
      handleSave();
    }
    if (state.hasNotification && (state.notificationType === "success" || state.notificationType === "info") && !state.isProcessing) {
      setTimeout(() => {handleNotification("", "", false)}, 5000);
    }
    if (state.loaded && !state.isProcessing) {
      const interval = setInterval(async() => {
        console.log("auto reset");
        const calls = setCalls();
        const techs = setTechs();
        const results = await Promise.all([calls, techs]);
        let errorMessage : string[] = [];
        if (results[0].error) {
          errorMessage = errorMessage.concat(results[0].error);
        }
        if (results[1].error) {
          errorMessage = errorMessage.concat(results[1].error);
        }
        if (errorMessage.length > 0) {
          handleNotification(errorMessage, "error");
        }
        updateFirstCallState({type: 'refreshCallsAndTechs', data: {
          techs: results[1].techList,
          scheduledOff: results[1].scheduledOff,
          newFormData: results[1].newFormData,
          calls: results[0].calls,
          available: results[0].availableCalls,
          assigned: results[0].assignedCalls,
        }});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [
    state.loaded, state.save,
    handleSave, state.refreshCalls,
    setCalls, setTechs,
    load, checkDivision,
    state.formData.division, state.formData.departmentIds,
    state.hasNotification, state.notificationType,
    getAllEmployees, state.isProcessing,
    handleNotification, state.checkUser,
    userCheck,
  ])
  
  return (
    <PageWrapper userID={loggedUserId}>
      <SectionBar 
        title="First Calls" 
        styles={{backgroundColor: "#711313", color: "white", zIndex:4}} 
      />
      <Box sx={{width:'100%', position: 'sticky', top:'45px', zIndex:3}}>
        <Collapse in={state.hasNotification}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {handleNotification("", "", false)}}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity={
              state.notificationType === "error" ? "error" : 
              state.notificationType === "success" ? "success" : 
              state.notificationType === "warning" ? "warning" : 
              state.notificationType === "info" ? "info" : undefined}
          >
            <AlertTitle>
              {
              state.notificationType === "error" ? "ERROR!" : 
              state.notificationType === "success" ? "SUCCESS!" : 
              state.notificationType === "warning" ? "WARNING!" : 
              state.notificationType === "info" ? "" : ""
              }
            </AlertTitle>
            {state.notificationMessage.map((message) => 
              message.split('     ').map((msg, index) => (
                <Typography key={`${index}_notifications`}>
                  {msg}
                </Typography>
              ))
            )}
            {state.notificationType === 'error' && (
              <Typography key={`webTech_message`}>
                {`  If This Error Continues, Please Contact Webtech.`}
              </Typography>
            )}
          </Alert>
        </Collapse>
      </Box>
      {!state.loaded && (
        <Grid container spacing={1} style={{paddingTop:'20px'}}>
        <Grid item xs={12}>
          <div style={{width:'95%', margin:'auto'}}>
            <PlainForm
              schema={DIVISION_ONLY_SCHEMA}
              data={state.formData}
              onChange={(callback)=>{handleFormDataUpdate(callback)}}
            />
          </div>
        </Grid>
        </Grid>
      )}
      {!state.userHasApiKey && state.checkUser && (
        <Modal
          open={true}
          onClose={()=>{}}
        >
          <Typography style={{fontSize:"24px", fontWeight:"bold", textAlign:"center"}}>
            Validation Error!
          </Typography>
          <Typography style={{textAlign:"center"}}>
            You need to register your Slack account to the Dispatch App before you can use First Calls.
          </Typography>
          <Typography style={{textAlign:"center"}}>
            Please click the following link to register.  In the dropdown, select the dispatch channel for your department.
          </Typography>
          <Button
            href={`https://slack.com/oauth/authorize?client_id=11208000564.292497115846&scope=incoming-webhook,chat:write:user,chat:write:bot,links:write,bot,users.profile:read,users:read,users:read.email&redirect_uri=${window.location.href}`}
            variant="outlined"
          >
            Add to Slack
          </Button>
        </Modal>
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
                  getAvailableTechs([], manualOffTechs, [], [], false);
                  updateFirstCallState({ type: 'setFirstCallManualOff', data: manualOffTechs });
                  break;
                }
                default: {
                  updateFirstCallState({ type: 'setSaveCall', data: true });
                  const selectedCall = state.calls.filter(call => call.getId() === Number(callback.destination?.droppableId))[0];
                  const techAssign = state.techs.find(tech => tech.getUserId() === Number(callback.draggableId))!;
                  handleCallDetails(selectedCall, false, techAssign);
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
                style={{fontSize:'18px', backgroundColor:state.save?'grey':'#711313', color:'white'}}
                onClick={() => handleFirstCallPreview()}
                disabled={state.save}
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
            <Grid item xs={12} md={4}>       
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
            <Grid item xs={12} md={8}>
              <div style={{margin:'auto', width:'92%'}}>
                <Typography style={{textAlign:'center', fontWeight:'bold', fontSize:'32px'}}>
                  Available Calls
                </Typography>
                <div style={{opacity: state.isProcessing ? 0.2 : 1}}>
                  <DispatchCalls
                    userID={loggedUserId}
                    calls={state.availableCalls}
                    loading={false}
                    handleMapRecenter={handleMapRecenter}
                    showAssigned={true}
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
            <Grid item md={4} xs={12}>
              <div style={{margin:'auto', width:'92%'}}>
                {state.googleApiKey != '' && (
                  <DispatchMap 
                    userID={loggedUserId}
                    apiKey={state.googleApiKey}
                    techs={[]}
                    users={state.users.filter(user=>{
                      const techIds = state.techs.map(tech=>tech.getUserId());
                      return techIds.includes(user.getId())
                    })}
                    calls={state.calls}
                    loading={false}
                    handleMapClick={handleCallDetails}
                    handleGeocodeUpdate={handleGeocodeUpdate}
                    center={state.center}
                    zoom={state.zoom}
                    isFirstCall={true}
                    handleError={handleNotification}
                  />
                )}
              </div>
            </Grid>
            <Grid item md={8} xs={12}>
              <div style={{margin:'auto', width:'92%'}}>
                <Typography style={{fontWeight:'bold', fontSize:'32px', textAlign:'center'}}>
                  First Call Queue                    
                </Typography>
                <div style={{opacity: state.isProcessing ? 0.2 : 1}}>
                  <DispatchCalls 
                    userID={loggedUserId}
                    calls={state.assignedCalls}
                    loading={false}
                    handleMapRecenter={handleMapRecenter}
                    isFirstCall={true}
                    startingIndex={state.availableCalls.length}
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
        <ModalAlert
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
        </ModalAlert>
        {state.modalKey === 'callInfo' && (
          <Confirm
            open
            onConfirm={()=>resetModal(false, true)}
            onClose={()=>resetModal(false, false)}
            title="Call Info"
            submitLabel = {state.isProcessing ? "Saving" : "Save"}
            cancelLabel = "Cancel"
            maxWidth={(window.innerWidth * .90)}
            disabled = {state.isProcessing}
          >
            <Box sx={{width:'100%', position: 'sticky', top:'20px', zIndex:3}}>
              <Collapse in={state.hasNotification}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {handleNotification("", "", false)}}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  severity={state.notificationType === 'error' ? "error" : state.notificationType === 'success' ? "success" : state.notificationType === "warning" ? "warning" : undefined}
                >
                  <AlertTitle>
                    {state.notificationType === 'error' ? "ERROR!" : state.notificationType === 'success' ? "SUCCESS!" : state.notificationType === "warning" ? "WARNING!" : ""}
                  </AlertTitle>
                  {state.notificationMessage.map((message) => message.split('     ').map((msg, index) => (
                    <Typography key={`${index}_notifications`}>
                      {msg}
                    </Typography>
                  )))}
                  {state.notificationType === 'error' && (
                    <Typography key={`webTech_message`}>
                      {`  If This Error Continues, Please Contact Webtech.`}
                    </Typography>
                  )}
                </Alert>
              </Collapse>
            </Box>
            <div style={{textAlign: "center"}}>
              <h2>Selected Call</h2>
            </div>
            <Grid container spacing={3} style={{width:(window.innerWidth * .95)}}>
              <Grid item md={8} xs={10}>
                <Grid container>
                  <Grid item md={6} xs={12}>
                    <TableContainer style={{width:'100%'}}>
                      <Table>
                        <TableHead></TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Call ID:</TableCell>
                            <TableCell style={{width:"65%", textAlign:"center"}}>{state.currentFCCall.id}</TableCell>
                            {/* <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getId()}</TableCell> */}
                          </TableRow>
                          <TableRow>
                            <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Location:</TableCell>
                            <TableCell style={{width:"65%", textAlign:"center"}}>{state.currentFCCall.propertyCity}</TableCell>
                            {/* <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getPropertyCity()}</TableCell> */}
                          </TableRow>
                          <TableRow>
                            <TableCell style={{fontWeight:"bold", fontSize:"15px"}}>Type:</TableCell>
                            <TableCell style={{textAlign:"center"}}>{`${state.currentFCCall.jobType}/${state.currentFCCall.subType}`}</TableCell>
                            {/* <TableCell style={{textAlign:"center"}}>{`${state.selectedCall.getJobType()}/${state.selectedCall.getJobSubtype()}`}</TableCell> */}
                          </TableRow>
                          <TableRow>
                            <TableCell style={{fontWeight:"bold", fontSize:"15px"}}>Description:</TableCell>
                            <TableCell style={{textAlign:"center"}}>{state.currentFCCall.description.length >= 200 ? state.currentFCCall.description.slice(0,150).concat(" ...") : state.currentFCCall.description}</TableCell>
                            {/* <TableCell style={{textAlign:"center"}}>{state.selectedCall.getDescription().length >= 200 ? state.selectedCall.getDescription().slice(0,150).concat(" ...") : state.selectedCall.getDescription()}</TableCell> */}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TableContainer style={{width:'100%'}}>
                      <Table>
                        <TableHead></TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Customer:</TableCell>
                            <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getCustName()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Address:</TableCell>
                            <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getPropertyAddress()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Email:</TableCell>
                            <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getUserEmail()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Phone:</TableCell>
                            <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getUserPhone()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead/>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{fontWeight:"bold", fontSize:"15px", width:"15%"}}>Notes:</TableCell>
                          <TableCell>
                            <TextareaAutosize
                              minRows={5}
                              maxRows={5}
                              style={{width:'99%', fontSize:'17px', fontStyle:'inherit'}}
                              placeholder="Please Enter Any First Call Notes Here."
                              // @ts-ignore
                              defaultValue={state.callMsg.replaceAll('     ', '\n')}
                              onBlur={(text) => {
                                if (text.target.value !== state.callMsg) {
                                  updateFirstCallState({ type: 'setCallMsg', data: text.target.value.replace(/\n/g,'     ')})
                                }
                              }}
                            />
                            <Typography style={{color:'red'}}>
                              *Note: Removing all assignees from call will remove this note!
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid item md={4} xs={12} style={{margin:'auto', position:'relative'}}>
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
                  style={{display:'table', marginLeft:'15%', alignItems:'center', opacity:state.isProcessing?0.2:1}}
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
                          options: state.techs
                            .filter(tech => state.formData.availableTechs.includes(tech) && !state.pendingAddInUse.includes(tech.getUserId()) || state.pendingRemoveInUse.includes(tech.getUserId()))
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
          </Confirm>
        )}
        {state.modalKey === 'editRequest' && state.selectedCall.getPropertyId() !== 0 && (
          <ServiceRequest
            loggedUserId={loggedUserId}
            propertyId={state.selectedCall.getPropertyId()}
            userID={state.selectedCall.getUserId()}
            serviceCallId={state.selectedCall.getId()}
            onClose={() => resetModal(true)}
          />
        )}
        {state.modalKey === 'fcPreview' && (
          <Confirm
            open
            onClose={resetModal}
            onConfirm={handleFinalizeFirstCall}
            title="Finalize First Call"
            submitLabel={state.isProcessing ? "Saving" : "Send First Calls"}
            cancelLabel="Close"
            disabled={!state.isApproved || state.isProcessing}
            maxWidth={(window.innerWidth * .50)}
          >
            {state.isProcessing && (
              <div>
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
              </div>
            )}
            <div style={{opacity:state.isProcessing?0.2:1}}>
              <Grid container style={{verticalAlign:'middle'}}>
              <Grid item xs={9}>
                  <Typography style={{fontWeight:'bolder', fontSize:'22px', textAlign:'center'}}>
                    Please Review the First Call and Approve.
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Checkbox
                    defaultChecked = {false}
                    size = 'medium'
                    color = "default"
                    onChange = {() => updateFirstCallState({type:'setFinalApproval', data:!state.isApproved})}
                    inputProps = {{"aria-label": 'Approve'}}
                    style={{marginBottom:'10px'}}
                    disabled = {state.isProcessing}
                  />
                </Grid>
                
              </Grid>
              <div style={{border:1, borderWidth:'1px', borderStyle:'solid'}}>
                <Grid container justifyContent="center" style={{textAlign:'center', maxHeight:(window.innerHeight*0.75), overflow:'auto'}}>
                  <Grid item xs={12}>
                    <Typography style={{fontWeight:'bolder', fontSize:'20px', paddingTop:'10px'}}>
                      Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{paddingTop:'10px', paddingBottom:'10px'}}>
                    <div style={{borderStyle:'solid', borderBottom:'1px', width:'98%', margin:'auto', color:'grey'}}></div>
                  </Grid>
                  <Grid item xs={6} style={{paddingTop:'15px'}}>
                    <Grid container>
                      <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px'}}>
                        On Call Coordinator
                      </Grid>
                      <Grid item xs={12}>
                        {state.savedFirstCall.onCall.coordinator}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} style={{paddingTop:'15px'}}>
                    <Grid container>
                      <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px'}}>
                        First Call Notes
                      </Grid>
                      <Grid item xs={12}>
                        {state.savedFirstCall.message.split('     ').map((message, index) => (
                          <Typography key={`${index}_message`}>
                            {message}
                          </Typography>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} style={{paddingTop:'10px', paddingBottom:'10px'}}>
                    <div style={{borderStyle:'solid', borderBottom:'1px', width:'90%', margin:'auto', color:'grey'}}></div>
                  </Grid>
                  <Grid item xs={6} style={{paddingTop:'15px'}}>
                    <Grid container>
                      <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px'}}>
                        {!state.savedFirstCall.class.isTomorrow ? `No Class Tomorrow` : `Class Tomorrow @ ${state.savedFirstCall.class.start}`}
                      </Grid>
                      {state.savedFirstCall.class.list.length > 0 && state.savedFirstCall.class.list.map(tech => (
                        <Grid item xs={12} key={`${tech.id}_class`}>
                          {tech.name}
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={6} style={{paddingTop:'15px'}}>
                    <Grid container>
                      <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px'}}>
                        {!state.savedFirstCall.meeting.isTomorrow ? `No Meeting Tomorrow` : `Meeting Tomorrow @ ${state.savedFirstCall.meeting.start}`}
                      </Grid>
                      {state.savedFirstCall.meeting.list.length > 0 && state.savedFirstCall.meeting.list.map(tech => (
                        <Grid item xs={12} key={`${tech.id}_meeting`}>
                          {tech.name}
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} style={{paddingTop:'10px', paddingBottom:'10px'}}>
                    <div style={{borderStyle:'solid', borderBottom:'1px', width:'90%', margin:'auto', color:'grey'}}></div>
                  </Grid>
                  <Grid item xs={6} style={{paddingTop:'15px'}}>
                    <Grid container>
                      <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px'}}>
                        Manual Off Technicians  
                      </Grid>
                      {state.savedFirstCall.manualOff.length > 0 && state.savedFirstCall.manualOff.map(tech => (
                        <Grid item xs={12} key={`${tech.id}_manual_off`}>
                          {tech.name}                   
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={6} style={{paddingTop:'15px'}}>
                    <Grid container>
                      <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px'}}>
                        Scheduled Off Technicians
                      </Grid>
                      {state.savedFirstCall.scheduledOff.length > 0 && state.savedFirstCall.scheduledOff.map(tech => (
                        <Grid item xs={12} key={`${tech.id}_scheduled_off`}>
                          {tech.name}
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} style={{paddingTop:'15px'}}>
                    <div style={{borderStyle:'solid', borderBottom:'1px', width:'98%', margin:'auto'}}></div>
                  </Grid>
                  <Grid item xs={12} style={{paddingTop:'15px'}}>
                    <Typography style={{fontWeight:'bolder', fontSize:'20px'}}>
                      Calls
                    </Typography>
                  </Grid>
                  {state.savedFirstCall.calls.length > 0 && state.savedFirstCall.calls.map(call => (
                    <Grid item xs={12} key={`${call.id}_calls`}>
                      <Grid container>
                        <Grid item xs={12} style={{paddingTop:'10px', paddingBottom:'10px'}}>
                          <div style={{borderStyle:'solid', borderBottom:'1px', width:'90%', margin:'auto', color:'grey'}}></div>
                        </Grid>
                        <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px'}}>
                          {`Call Info : ${call.id} - ${call.custName}`}
                        </Grid>
                        <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px', paddingTop:'10px'}}>
                          {`Assignee(s)`}
                        </Grid>
                        <Grid item xs={12}>
                          {/* @ts-ignore */}
                          {`${call.assigned.map(tech => tech.name).toString().replaceAll(',', ', ')}`}
                        </Grid>
                        <Grid item xs={6} style={{fontWeight:'bolder', fontSize:'16px', paddingTop:'10px'}}>
                          {`Window`}
                        </Grid>
                        <Grid item xs={6} style={{fontWeight:'bolder', fontSize:'16px', paddingTop:'10px'}}>
                          {`Location`}
                        </Grid>
                        <Grid item xs={6}>
                          {`${call.start} - ${call.end}`}
                        </Grid>
                        <Grid item xs={6}>
                          {`${call.propertyAddress}`}
                        </Grid>
                        <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px', paddingTop:'10px'}}>
                          {`Description`}
                        </Grid>
                        <Grid item xs={12}>
                          {`${call.description}`}
                        </Grid>
                        <Grid item xs={12} style={{fontWeight:'bolder', fontSize:'16px', paddingTop:'10px'}}>
                          {`Additional Notes`}
                        </Grid>
                        <Grid item xs={12}>
                          {call.notes.split('     ').map((message, index) => (
                            <Typography key={`${index}_notes`}>
                              {message}
                            </Typography>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </div>
          </Confirm>
        )}
      </Modal>
    </PageWrapper>
  );
};