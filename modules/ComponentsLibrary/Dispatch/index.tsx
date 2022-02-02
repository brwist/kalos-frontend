import React, { useReducer, useCallback, useEffect } from 'react';
import { DispatchTechs } from './dispatchTechnicians';
import { DispatchCalls } from './dispatchCalls';
import { DismissedTechs } from './dismissedTechnicians';
import { DispatchMap } from './dispatchMap';
import { State, reducer, FormData } from './reducer';
import {
  DispatchClientService,
  ActivityLogClientService,
  ServicesRenderedClientService,
  TimesheetDepartmentClientService,
  TimeoffRequestClientService,
  JobTypeClientService,
  EventAssignmentClientService,
  EventClientService,
  SlackClientService,
  ApiKeyClientService,
  UserClientService,
} from '../../../helpers';
import { DateRange } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';
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
import { Confirm } from '../Confirm';
import { Modal } from '../Modal';
import { Alert as ModalAlert } from '../Alert';
import { Loader } from '../../Loader/main';
import { DragDropContext } from 'react-beautiful-dnd';
import addDays from 'date-fns/esm/addDays';
import format from 'date-fns/esm/format';
import setHours from 'date-fns/esm/setHours';
import setMinutes from 'date-fns/esm/setMinutes';
import setSeconds from 'date-fns/esm/setSeconds';
import debounce from 'lodash/debounce';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Button  from '@material-ui/core/Button';
import UndoRounded from '@material-ui/icons/UndoRounded';
import List from '@material-ui/core/List/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RemoveCircleOutlineTwoTone from '@material-ui/icons/RemoveCircleOutlineTwoTone';
import ListItem from '@material-ui/core/ListItem';
import CircleProgress from '@material-ui/core/CircularProgress';
import { ServiceRequest } from '../ServiceCall/requestIndex';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import CloseIcon from '@material-ui/icons/Close';
export interface Props {
  loggedUserId: number;
  testUserId?: number;
  disableSlack?: boolean;
  slackClientId?: string;
}

const initialFormData: FormData = {
  dateStart: format(new Date(), 'yyyy-MM-dd'),
  timeStart: format(setHours(setMinutes(new Date(), 0), 0), 'yyyy-MM-dd HH:mm'),
  dateEnd: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
  timeEnd: format(setHours(setMinutes(new Date(), 0), 0), 'yyyy-MM-dd HH:mm'),
  departmentIds: [],
  jobTypes: [],
  divisionMulti: [],
};

const initialState: State = {
  techs: [],
  dismissedTechs: [],
  offTechs: [],
  offTechData: [],
  calls: [],
  departmentList: [],
  defaultDepartmentIds: [],
  defaultSectorIds: [],
  jobTypeList: [],
  formData: initialFormData,
  notIncludedJobTypes: [],
  openModal: false,
  modalKey: '',
  selectedTech: new DispatchableTech(),
  selectedCall: new DispatchCall(),
  center: {lat: 28.565989, lng: -81.733872},
  zoom: 11,
  isProcessing: false,
  googleApiKey: '',
  isLoadingTech: false,
  isLoadingCall: false,
  isLoadingMap: true,
  isLoadingDismissed: false,
  isInitialLoad: true,
  isLoadingFilters: true,
  assigneeList: [],
  userHasApiKey: false,
  checkUser: false,
  hasNotification: false,
  notificationType: '',
  notificationMessage: [],
  refreshTechnicians: false,
  refreshCalls: false,
  initialTechLoad: true,
};

export const DispatchDashboard: React.FC<Props> = function DispatchDashboard({
  loggedUserId,
  testUserId,
  disableSlack,
  slackClientId="11208000564.292497115846",
}) {
  const [state, updateDispatchState] = useReducer(reducer, initialState);

  const resetModal = (refreshTechs: boolean, refreshCalls: boolean) => {
    updateDispatchState({ 
      type: 'setModal',
      data: {
        openModal: false,
        modalKey: '',
        selectedTech: new DispatchableTech(),
        selectedCall: new DispatchCall(),
        isProcessing: false,
        refreshTechs: refreshTechs,
        refreshCalls: refreshCalls
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
      updateDispatchState({type: 'setNotification', data: {
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

  const handleDismissTech =  useCallback(async (overrideId : number = 0, suppressSlack : boolean = false, skipRefresh : boolean = false) => {
    setProcessing(true);
    const actLog = new ActivityLog();
    const errorMessage = "- Unable to Create Activity Log and Service Rendered for Dismissal.";
    const techId = overrideId > 0 ? overrideId : state.selectedTech.getUserId();
    actLog.setUserId(loggedUserId);
    actLog.setPropertyId(19139);
    actLog.setActivityName(`Sent user ${techId} home for the day.`);
    actLog.setActivityDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    const service = new ServicesRendered();
    service.setTechnicianUserId(techId);
    service.setName('Dismissed Technician');
    service.setStatus('Dismissed');
    service.setEventId(124362);
    service.setDatetime(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    service.setTimeStarted(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    try{
      ActivityLogClientService.Create(actLog);
      await ServicesRenderedClientService.Create(service);
      if (!disableSlack && !suppressSlack) SlackClientService.DirectMessageUser(testUserId ? 103939 : techId, `Go Home, ${state.selectedTech.getTechname()}`, loggedUserId);
      if (!suppressSlack) handleNotification(`${state.selectedTech.getTechname()} Successfully Dismissed`, "success", true);
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      console.error(
        `An error occurred while creating the Activity Log and Service Rendered for the dismissal: ${err}`
      );
    }
    if (!skipRefresh) resetModal(true, false);
  }, [disableSlack, handleNotification, loggedUserId, state.selectedTech, testUserId]);

  const handleUndismissTech = useCallback(async (tech : DispatchableTech, suppressSlack = false, skipRefresh = false) => {
    setProcessing(true, true);
    const actLog = new ActivityLog();
    const errorMessage = "- Unable to Create Activity Log and Service Rendered for Undismissal.";
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
      ActivityLogClientService.Create(actLog);
      await ServicesRenderedClientService.Create(service);
      if (!disableSlack && !suppressSlack) SlackClientService.DirectMessageUser(testUserId ? 103939 : tech.getUserId(), `False Alarm, ${tech.getTechname()}!  I need you back on the schedule!`, loggedUserId);
      if (!suppressSlack) handleNotification(`${tech.getTechname()} Successfully Undismissed!`, "success", true);
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      // console.error(
      //   `An error occured while create the Activity Log and Service Rendered for the Un-Dismissal: ${err}`
      // );
    }
    if (!skipRefresh) resetModal(true, false);
  }, [disableSlack, handleNotification, loggedUserId, testUserId])

  const getTimeOffTechnicians = useCallback( async() => {
    const errorMessage = "- Unable to Retrieve Time Off List.";
    const off = new TimeoffRequest();
    const offRequestTimeStarted = format(setHours(setMinutes(setSeconds(new Date(), 0), 0), 0), "yyyy-MM-dd HH::mm::ss");
    const offRequestTimeFinished = format(setHours(setMinutes(setSeconds(new Date(), 59), 59), 23), "yyyy-MM-dd HH::mm::ss");
    off.setIsActive(1);
    off.setRequestStatus(1);
    off.setDateRangeList([">=", offRequestTimeStarted, "<=", offRequestTimeFinished]);
    off.setDateTargetList(["time_finished", "time_started"]);
    off.setDepartmentIdList(state.formData.departmentIds.toString());
    try {
      const timeoff = await TimeoffRequestClientService.BatchGet(off);
      const timeoffList = timeoff.getResultsList();
      checkErrors(errorMessage);
      return {timeOff: timeoffList};
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      return {timeOff: []};
    }
  }, [checkErrors, handleNotification, state.formData.departmentIds])

  const getTechnicians = useCallback( async () => {
    const tech = new DispatchableTech();
    const dr = new DateRange();
    const errorMessage = "- Unable to Retrieve Technicians.";
    dr.setStart('2012-01-01');
    dr.setEnd(format(new Date(), 'yyyy-MM-dd'));
    tech.setDateRange(dr);
    if (state.formData.departmentIds.length) {
      tech.setDepartmentList(state.formData.departmentIds.toString());
    } else {
      tech.setDepartmentList(state.defaultDepartmentIds.toString());
    }
    const off = new TimeoffRequest();
    const offRequestTimeStarted = format(setHours(setMinutes(setSeconds(new Date(), 0), 0), 0), "yyyy-MM-dd HH::mm::ss");
    const offRequestTimeFinished = format(setHours(setMinutes(setSeconds(new Date(), 59), 59), 23), "yyyy-MM-dd HH::mm::ss");
    off.setIsActive(1);
    off.setRequestStatus(1);
    off.setDateRangeList([">=", offRequestTimeStarted, "<=", offRequestTimeFinished]);
    off.setDateTargetList(["time_finished", "time_started"]);
    off.setDepartmentIdList(state.formData.departmentIds.toString());
    try {      
      const offTechs = await getTimeOffTechnicians();
      const timeoffList = offTechs.timeOff;
      const techs = await DispatchClientService.GetDispatchableTechnicians(tech);
      const techList = techs.getResultsList().map(tech=>tech.getUserId());
      const offTechnicians = offTechs.timeOff.filter(tech => techList.includes(tech.getUserId()));
      let requestedOffTechs : DispatchableTech[] = [];
      let requestOffData : {tech: DispatchableTech, start: string, end: string}[] = [];
      offTechnicians.forEach(req => {
        const tech = techs.getResultsList().find(tech => tech.getUserId() === req.getUserId())!;
        requestOffData = requestOffData.concat({tech: tech, start: req.getTimeStarted(), end: req.getTimeFinished()});
        if (format(new Date(), `yyyy-MM-dd HH:mm:ss`) >= req.getTimeStarted() && format(new Date(), `yyyy-MM-dd HH:mm:ss`) <= req.getTimeFinished()) {
          requestedOffTechs = requestedOffTechs.concat(tech);
          if (req.getTimeFinished() < format(setHours(setMinutes(setSeconds(new Date(), 0), 0), 17), `yyyy-MM-dd HH:mm:ss`)) {
            if (tech.getActivity() !== "Standby") {
              handleUndismissTech(tech, true, true);
            }
          } else {
            if (tech.getActivity() !== "Dismissed") {
              handleDismissTech(tech.getUserId(), true, true);
            }
          }

        }
      })
      const availableTechs = techs.getResultsList().filter(tech => tech.getActivity() != 'Dismissed' && !requestedOffTechs.includes(tech));
      const dismissedTechs = techs.getResultsList().filter(tech => tech.getActivity() === 'Dismissed' && !requestedOffTechs.includes(tech));
      checkErrors(errorMessage);
      return {available: availableTechs, dismissed: dismissedTechs, off: requestedOffTechs, offData: requestOffData};
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      console.error(
        `An error occurred while getting Dispatch Techs: ${err}`
      );
      return {available: [], dismissed: [], off: [], offData: []};
    }
  }, [state.formData.departmentIds, state.defaultDepartmentIds, handleNotification, checkErrors, getTimeOffTechnicians, handleDismissTech, handleUndismissTech]);

  const getCalls = useCallback( async () => {
    const call = new DispatchCall();
    const errorMessage = "- Unable to Retrieve Service Calls.";
    call.setDateRangeList(['>=', state.formData.dateStart, '<=', state.formData.dateEnd]);
    call.setDateTargetList(['date_started', 'date_ended']);
    call.setJobTypeIdList(state.formData.jobTypes.toString());
    call.setLogJobstatus("Confirmed");
    if (state.formData.divisionMulti.length) {
      call.setSectorGroupList(state.formData.divisionMulti.toString());
    } else {
      call.setSectorGroupList(state.defaultSectorIds.toString());
    }
    try {
      const calls = await DispatchClientService.GetDispatchCalls(call);
      const callResults = calls.getResultsList();
      const filteredCalls = callResults.filter(call => 
        `${call.getDateStarted()} ${call.getTimeStarted()}` >= `${state.formData.dateStart} ${state.formData.timeStart.substring(11)}` &&
        `${call.getDateEnded()} ${call.getTimeEnded()}` <= `${state.formData.dateEnd} ${state.formData.timeEnd.substring(11)}` 
        // && ( state.formData.divisionMulti.length === 0 ||
        // state.formData.divisionMulti.includes(call.getSectorGroup()))
      ); 
      checkErrors(errorMessage);
      return {calls: filteredCalls};
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      // console.error(
      //   `An error occurred while getting Dispatch Calls: ${err}`
      // );
      return {calls: []};
    }
  }, [
    state.formData.jobTypes,
    state.formData.dateStart, state.formData.timeStart,
    state.formData.dateEnd, state.formData.timeEnd,
    state.formData.divisionMulti,
    state.defaultSectorIds, handleNotification,
    checkErrors
  ]);

  const getDepartments = useCallback(async() => {
    const departmentReq = new TimesheetDepartment();
    const user = new User();
    const errorMessage = "- Unable to Retrieve Department List.";
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
      checkErrors(errorMessage);
      return {departments: displayedDepartments, defaultValues: displayedDepartments.map(dep => dep.getId())};
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      // console.error(
      //   `An error occurred while getting Departments: ${err}`
      // );
      return {departments: [], defaultValues: []};
    }
  }, [loggedUserId, handleNotification, checkErrors])

  const getJobTypes = useCallback(async() => {
    const jobTypeReq = new JobType();
    const errorMessage = "- Unable to Retrieve Job Types.";
    try {
      const jobTypes = await JobTypeClientService.BatchGet(jobTypeReq);
      const displayedJobTypes = jobTypes.getResultsList().filter(jobType => !state.notIncludedJobTypes.includes(jobType.getId()));
      checkErrors(errorMessage);
      return {jobTypes: displayedJobTypes};
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      // console.error(
      //   `An error occurred while getting Job Types: ${err}`
      // );
      return {jobTypes: []};
    }
  }, [state.notIncludedJobTypes, handleNotification, checkErrors])

  const getGoogleApiKey = useCallback(async() => {
    const newKey = new ApiKey();
    const errorMessage = "- Unable to Connect to Google.";
    newKey.setTextId('google_maps');
    try {
      const googleKey = await ApiKeyClientService.Get(newKey);
      checkErrors(errorMessage);
      return {googleKey: googleKey.getApiKey()};
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      // console.error(
      //   `An error occurred while getting Google API Key: ${err}`
      // );
      return {googleKey: ''};
    }
  }, [handleNotification, checkErrors])

  const getSectorGroups = (departments: TimesheetDepartment[]) => {
    const department = departments.map(dep => dep.getSectorGroup())
    const defaultSectors = department.filter((c,index) => {
      return department.indexOf(c) === index && c !== 0;
    });
    initialFormData.divisionMulti = defaultSectors;
    return defaultSectors;
  }

  const setTechnicians = useCallback( async() => {
    const techs = await getTechnicians();
    if (techs.dismissed.length === 0 && state.dismissedTechs.length > 0) {
      resetModal(false, false);
    }
    updateDispatchState({
      type: 'setTechs',
      data: {
        availableTechs: techs.available,
        dismissedTechs: techs.dismissed,
        offTechs: techs.off,
        offTechData: techs.offData,
      }
    });
  }, [getTechnicians, state.dismissedTechs.length]);

  const setCalls = useCallback( async() => {
    const calls = await getCalls();
    updateDispatchState({
      type: 'setCalls',
      data: {
        calls: calls.calls
      }
    });
  }, [getCalls])

  useEffect(() => {
    if (state.defaultDepartmentIds.length && !state.isLoadingFilters) {
      if (state.refreshTechnicians || state.initialTechLoad) {
        updateDispatchState({
          type: 'setLoadingTech',
          data: {
            isLoadingTech: true,
            refreshTechs: false,
            initialTechLoad: false,
          }
        });
        setTechnicians();
      }
      const interval = setInterval(() => setTechnicians(), 15000);
      return () => clearInterval(interval);
    }
  }, [setTechnicians, state.defaultDepartmentIds, state.isLoadingFilters, state.refreshTechnicians, state.initialTechLoad]);

  useEffect(() => {
    if (state.defaultSectorIds.length && !state.isLoadingFilters) {
      if (state.refreshCalls) {
        updateDispatchState({
          type: 'setLoadingCall',
          data: {
            isLoadingCall: true,
            refreshCalls: false,
          }
        });
        setCalls();
      }
      const interval = setInterval(() => setCalls(), 30000);
      return () => clearInterval(interval);
    }
  }, [setCalls, state.defaultSectorIds, state.isLoadingFilters, state.refreshCalls])

  const handleChange = async (formData: FormData) => {
    setProcessing(true);
    const callDateStart = formData.dateStart.replace(' 00:00', '');
    const callDateEnd = formData.dateEnd.replace(' 00:00', '');
    const callTimeStart = formData.timeStart;
    const callTimeEnd = formData.timeEnd;
    if (state.formData.departmentIds.length != formData.departmentIds.length
    || !state.formData.departmentIds.every((val, index) => val === formData.departmentIds[index])) {
      formData.divisionMulti = [];
      state.departmentList
        .filter(dep => formData.departmentIds.includes(dep.getId()))
        .forEach(dep => !formData.divisionMulti.includes(dep.getSectorGroup()) ? formData.divisionMulti.push(dep.getSectorGroup()) : formData.divisionMulti);
    }
    if (!formData.divisionMulti.length) {
      formData.divisionMulti = state.defaultSectorIds;
    }
    const updatedForm : FormData = {
      dateStart: callDateStart,
      timeStart: callTimeStart,
      dateEnd: callDateEnd,
      timeEnd: callTimeEnd,
      departmentIds: formData.departmentIds,
      jobTypes: formData.jobTypes,
      divisionMulti: formData.divisionMulti,
    };
    updateDispatchState({
      type: 'setFormData',
      data: updatedForm,
    });
  }

  const handleUndismissButtonClick = () => {
    updateDispatchState({ 
      type: 'setModal',
      data: {
        openModal: true,
        modalKey: 'Undismiss',
        selectedTech: new DispatchableTech(),
        selectedCall: new DispatchCall(),
        isProcessing: false
      }
    })
  }

  const handleAssignTech = async () => {
    setProcessing(true);
    const assignment = new EventAssignment();
    const event = new Event();
    const errorMessage = "- Failed to Assign Technician.";
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
      if (!disableSlack) SlackClientService.Dispatch(state.selectedCall.getId(), testUserId ? 103939 : state.selectedTech.getUserId(), loggedUserId);
      handleNotification(`${state.selectedTech.getTechname()} Successfully Assigned to Call ${state.selectedCall.getId()}`, "success", true);
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      // console.error(
      //   `An error occurred while updating the Event Assignment and Event: ${err}`
      // );
    }
    resetModal(false, true);
  }

  const handleUnassignTech = async (id: number) => {
    setProcessing(true);
    let error = false;
    const assignment = new EventAssignment();
    const event = new Event();
    const errorMessage = "- Failed to Unassign Technician.";
    assignment.setEventId(state.selectedCall.getId());
    assignment.setUserId(id);
    event.setId(state.selectedCall.getId());
    const idArray = state.assigneeList.map(assignee=>assignee.id).filter(techId => techId !== id).map(String);
    event.setLogTechnicianAssigned(idArray.length ? idArray.toString() : '0');
    try {
      const assignedEvent = await EventAssignmentClientService.Get(assignment);
      assignment.setId(assignedEvent.getId());
      EventAssignmentClientService.Delete(assignment);
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      error = true;
      // console.error('Error updating Event Assignment', err);
    }
    try {
      await EventClientService.Update(event);
    } catch (err) {
      handleNotification(errorMessage, "error", true);
      error = true
      // console.error('Error Updating Event', err);
    }
    updateDispatchState({
      type: 'setAssigneeList',
      data: state.assigneeList.filter(assignee => assignee.id !== id)
    });
    setCalls();
    if (!error) {
      const tech = state.techs.filter(tech => tech.getUserId() === id)[0];
      handleNotification(`${tech.getTechname()} Successfully Unassigned from Call ${state.selectedCall.getId()}`, "success", true);
    }
  }

  const handleCallDetails = async (call : DispatchCall, edit = false) => {
    if (edit) {
      updateDispatchState({
        type: 'setModal',
        data: {
          openModal: true,
          modalKey: 'editRequest',
          selectedTech: new DispatchableTech(),
          selectedCall: call,
          isProcessing: false,
          assigneeList: [],
        }
      });
    } else {
      let assignees : {id: number, name: string}[] = [];
      const ids = call.getLogTechnicianAssigned().split(',').map(Number);
      const errorMessage = "- Failed to Retrieve Assigned Technicians.";
      try {
        const userData = await UserClientService.BatchGetUsersByIds(ids);
        for (const user of userData.getResultsList()) {
          assignees.push({id: user.getId(), name: `${user.getFirstname()} ${user.getLastname()}`})
        }
        updateDispatchState({
          type: 'setModal',
          data: {
            openModal: true,
            modalKey: 'callInfo',
            selectedTech: new DispatchableTech(),
            selectedCall: call,
            isProcessing: false,
            assigneeList: assignees,
          }
        });
      } catch (err) {
        handleNotification(errorMessage, "error", true);
        // console.error('Error Occurred when Getting Assigned Users', err);
      }
    }
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
      updateDispatchState({type: 'setCenter', data: {
        center: newCenter,
        zoom: zoom
      }});
    }
  }

  const handleMapClick = (call: DispatchCall, edit = false, tech: DispatchableTech) => {
    updateDispatchState({ type: 'setModal', data: {
      openModal: true,
      modalKey: 'mapInfo',
      selectedTech: tech,
      selectedCall: call,
      isProcessing: false,
    }})
  }

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
      updateDispatchState({type: 'setUserHasApiKey', data: true});
    } catch (err) {
      updateDispatchState({type: 'setUserHasApiKey', data: false});
    }
  }, [loggedUserId, slackClientId])

  const setInitialValues = useCallback(async () => {
    const departmentReq = getDepartments();
    const jobTypeReq = getJobTypes();
    const googleApiKey = getGoogleApiKey();
    const results = await Promise.all([departmentReq, jobTypeReq, googleApiKey]);
    const defaultSectors = getSectorGroups(results[0].departments.filter(dep => results[0].defaultValues.includes(dep.getId())));
    updateDispatchState({
      type: 'setDropdownValuesAndApi',
      data: {
        departmentList: results[0].departments,
        defaultDepartmentIds: results[0].defaultValues,
        defaultSectorIds: defaultSectors,
        jobTypeList: results[1].jobTypes,
        googleApiKey: results[2].googleKey,
      }
    });
  }, [getDepartments, getJobTypes, getGoogleApiKey])

  const handleFilterSave = () => {
    const saveFilter : FormData = {
      dateStart: initialFormData.dateStart, 
      timeStart: initialFormData.timeStart, 
      dateEnd: initialFormData.dateEnd, 
      timeEnd: initialFormData.timeEnd, 
      departmentIds: state.formData.departmentIds,
      jobTypes: state.formData.jobTypes,
      divisionMulti: state.formData.divisionMulti,
    }
    window.localStorage.setItem(
      'DISPATCH_DASHBOARD_FILTER',
      JSON.stringify(saveFilter),
    );
  };

  const handleFilterLoad = () => {
    // const cachedFilters = window.localStorage.getItem('DISPATCH_DASHBOARD_FILTER',);
    // if (cachedFilters) {
    //   updateDispatchState({type:'setFormData', data:JSON.parse(cachedFilters)});
    // } else {
      updateDispatchState({type:'setFormData', data:initialFormData});
    // }
  }

  const SCHEMA_PRINT: Schema<FormData> = [
    [
      {
        name: 'departmentIds',
        label: 'Department(s)',
        options: state.departmentList.map(dl => ({
          key: dl.getId() + dl.getDescription(),
          label: `${dl.getValue()} - ${dl.getDescription()}`,
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
      {
        name: 'divisionMulti',
        label: 'Sectors(s)',
        options: ['Residential', 'Commercial Light', 'Commercial Heavy'].map((item, index) => ({
          key: item,
          label: item,
          value: index + 1
        })),
        type: 'multiselect',
        invisible: state.defaultSectorIds.length <= 1 ? true : undefined,
      },
    ],
    [
      {
        name: 'dateStart',
        label: 'Call Start Date',
        type: 'mui-date',
      },
      {
        name: 'timeStart',
        label: 'Call Start Time',
        type: 'mui-time',
      },
      {
        name: 'dateEnd',
        label: 'Call End Date',
        type: 'mui-date',
      },
      {
        name: 'timeEnd',
        label: 'Call End Time',
        type: 'mui-time',
      },
    ],
    [
      
    ],
  ];

  const setProcessing = (loading : boolean, dismissProcessing = false) => {
    updateDispatchState({
      type: 'setProcessing',
      data: {
        loading,
        dismissProcessing,
      }
    });
  }

  useEffect(() => {
    if (!state.checkUser) {
      userCheck();
    }
    if (state.isInitialLoad && state.userHasApiKey) {
      setInitialValues();
      handleFilterLoad();
    }
    if (state.notificationType === "success") {
      const interval = setInterval(() => handleNotification("", "", false), 5000);
      return () => clearInterval(interval);
    }
  }, [setInitialValues, state.isInitialLoad, state.userHasApiKey, state.checkUser, userCheck, state.notificationType, handleNotification]);

  return (
    <PageWrapper userID={loggedUserId}>
      {!state.userHasApiKey && state.checkUser && (
        <Modal
          open={true}
          onClose={()=>{}}
          maxWidth={window.innerWidth*.3}
        >
          <div style={{margin:"auto", paddingLeft:"20px", paddingRight:"20px", paddingTop:"20px", paddingBottom:"20px"}}>
            <Typography style={{fontSize:"26px", fontWeight:"bold", textAlign:"center", paddingBottom:"15px"}}>
              Slack Registration Required!
            </Typography>
            <div style={{borderStyle:'solid', borderBottom:'1px', width:'98%', margin:'auto', color:'#711313'}}></div>
            <Typography style={{textAlign:"center", paddingTop:"15px", fontSize:"20px"}}>
              You need to register your Slack account to the Dispatch App before you can use First Calls.
            </Typography>
            <Typography style={{textAlign:"center", paddingTop:"15px", paddingBottom:"15px", fontSize:"20px"}}>
              Please click the following link to register.  In the dropdown, enter and select the dispatch channel for your department and then click Authorize.
            </Typography>
            <div style={{display:"block", margin:"auto", textAlign:"center", alignItems:"center", paddingBottom:"15px"}}>
              <Button
                href={`https://slack.com/oauth/authorize?client_id=11208000564.292497115846&scope=incoming-webhook,chat:write:user,chat:write:bot,links:write,bot,users.profile:read,users:read,users:read.email&redirect_uri=${window.location.href}`}
                style={{color:"white", backgroundColor:"#711313"}}
                >
                Add to Slack
              </Button>
            </div>
            <div style={{borderStyle:'solid', borderBottom:'1px', width:'98%', margin:'auto', color:'#711313'}}></div>
            <Typography style={{textAlign:"center", paddingTop:"15px", fontSize:"20px"}}>
              You will be returned to this page after registration is complete.
            </Typography>
            <Typography style={{textAlign:"center", paddingTop:"15px", fontSize:"20px"}}>
              If you have any issues registering, please contact Webtech.
            </Typography>
          </div>
        </Modal>
      )}
      {state.isLoadingMap && state.isLoadingTech && state.isLoadingCall && state.checkUser && (
        <Loader
          backgroundColor={'black'}
          opacity={0.5}
        />
      )}
      <SectionBar title="Dispatch" styles={{backgroundColor: "#711313", color: "white", zIndex:3}} />
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
      {!state.isInitialLoad && (
        <div>
      <Grid style={{paddingTop:'15px'}}>
        {!state.isLoadingFilters && (
        <Grid item xs={12} style={{width:'98%', margin:'auto'}}>
          <PlainForm
            schema={SCHEMA_PRINT}
            data={state.formData}
            onChange={debounce(handleChange, 1000)}
          />
        </Grid>
        )}
        {/* Commented out for when they ask for filter saving */}
        {/* <Grid item xs={12}>
          <Grid container spacing={1} justifyContent='center'>
            <Grid item xs={3}>
              <Button size="small" variant="contained" color="secondary" style={{width:'80%'}} onClick={handleFilterSave}>
                Save Non-Date Filters
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button size="small" variant="outlined" color="primary" style={{width:'80%'}} onClick={() => {updateDispatchState({type:'setFormData', data:initialFormData})}}>
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Grid> */}
        <Grid item xs={12} style={{width:'98%', margin:'auto', paddingTop:'15px', paddingBottom:'10px'}}>
          <hr style={{borderTop: "3px solid black"}}/>
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
              updateDispatchState({ 
                type: 'setModal',
                data: {
                  openModal: true,
                  modalKey: modalKey,
                  selectedTech: tech!,
                  selectedCall: call, 
                  isProcessing: false,
                }
              });
            }
          }}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <div style={{alignItems:'center', margin:'auto', textAlign:'center', display:state.dismissedTechs.length ? '' : 'none'}}>
                  <Button style={{backgroundColor:'green', color:'white', width:'60%', padding:'10px', textAlign:'center'}} onClick={handleUndismissButtonClick}>
                    <UndoRounded></UndoRounded>
                    Undismiss Technician
                  </Button>
                </div>
                <DispatchTechs
                  userID={loggedUserId}
                  techs={state.techs}
                  dismissedTechs={state.dismissedTechs}
                  offTechs={state.offTechData}
                  handleMapRecenter={handleMapRecenter}
                  loading={state.isLoadingTech}
                />
                <DismissedTechs
                  userID={loggedUserId}
                  dismissedTechs={state.offTechs}
                  isFirstCall={true}
                  alternateTitle={"Requested Off"}
                  processingDismissed={state.isLoadingTech}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                {state.googleApiKey != '' && (
                  <DispatchMap
                    userID={loggedUserId}
                    center={state.center}
                    zoom={state.zoom}
                    apiKey={state.googleApiKey}
                    techs={state.techs}
                    calls={state.calls}
                    handleMapClick={handleMapClick}
                    loading={state.isLoadingMap}
                    handleGeocodeUpdate={() => {}}
                  />
                )}
              </Grid>
              
              <Grid item xs={12} style={{margin:'auto'}}>
                <hr style={{borderTop: "3px solid black"}}></hr>
              </Grid>
              
              <Grid item xs={12} style={{paddingTop: "10px"}}>
                <DispatchCalls
                  userID={loggedUserId}
                  calls={state.calls}
                  handleMapRecenter={handleMapRecenter}
                  handleDblClick={handleCallDetails}
                  loading={state.isLoadingCall}
                />
              </Grid>
            </Grid>
          </DragDropContext>
        </Grid>
      </Grid>

      <Modal
        open={state.openModal}
        onClose={() => resetModal(false, false)}
      >
        {state.modalKey === 'Undismiss' && (
            <ModalAlert
              open={true}
              onClose={() => resetModal(false, false)}
              title="Undismiss Tech"
              label={state.isProcessing ? "Saving..." : "Cancel"}
              disabled={state.isProcessing}
              maxWidth={(window.innerWidth * .40)}
              >
              <DismissedTechs
                userID={loggedUserId}
                dismissedTechs={state.dismissedTechs}
                handleUndismissTech={handleUndismissTech}
                processingDismissed={state.isLoadingDismissed}
              />
            </ModalAlert>
        )}
        {state.modalKey === 'Dismiss' &&
          (
            <Confirm
              key="ConfirmDismiss"
              title="Dismiss Tech"
              open={true}
              onClose={() => resetModal(false, false)}
              onConfirm={handleDismissTech}
              maxWidth={(window.innerWidth * .40)}
              submitLabel={state.isProcessing ? "Saving..." : "Dismiss"}
              cancelLabel="Cancel Dismissal"
              disabled={state.isProcessing}
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
              onClose={() => resetModal(false, false)}
              onConfirm={handleAssignTech}
              maxWidth={(window.innerWidth * .60)}
              submitLabel={state.isProcessing ? "Saving..." : "Assign Tech to Call"}
              cancelLabel="Cancel Assignment"
              disabled={state.isProcessing}
            >
              <div style={{display: 'flex', width: "98%"}}>
                <Grid container>
                  <Grid item md={6} xs={12}>
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
                  </Grid>
                  <Grid item md={6} xs={12}>
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
                  </Grid>
                </Grid>
              </div>
            </Confirm>
          )
        }
        {state.modalKey === 'mapInfo' && state.selectedCall.getId() > 0 && (
          <ModalAlert
          open
          onClose={() => resetModal(false, false)}
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
          </ModalAlert>
        )}
        {state.modalKey === 'callInfo' && (
          <ModalAlert
            open
            onClose={() => resetModal(false, false)}
            title="Call Info"
            label="Close"
            maxWidth={(window.innerWidth * .80)}
          >
            <div style={{textAlign: "center"}}>
              <h2>Selected Call</h2>
            </div>

            <Grid container spacing={1} style={{width:(window.innerWidth * .85)}}>
              <Grid item md={7} xs={10}>
                <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                    <TableContainer style={{width:'100%'}}>
                      <Table>
                        <TableHead></TableHead>
                        <TableBody>
                        <TableRow>
                            <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Call ID:</TableCell>
                            <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getId()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{width:"35%", fontWeight:"bold", fontSize:"15px"}}>Location:</TableCell>
                            <TableCell style={{width:"65%", textAlign:"center"}}>{state.selectedCall.getPropertyCity()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{fontWeight:"bold", fontSize:"15px"}}>Type:</TableCell>
                            <TableCell style={{textAlign:"center"}}>{`${state.selectedCall.getJobType()}/${state.selectedCall.getJobSubtype()}`}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{fontWeight:"bold", fontSize:"15px"}}>Description:</TableCell>
                            <TableCell style={{textAlign:"center"}}>{state.selectedCall.getDescription().length >= 200 ? state.selectedCall.getDescription().slice(0,150).concat(" ...") : state.selectedCall.getDescription()}</TableCell>
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
              </Grid>
              <Grid item md={5} xs={12} style={{margin:'auto', position:'relative'}}>
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
                        <ListItemIcon onClick={()=>{if(!state.isProcessing) handleUnassignTech(assignee.id)}}>
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
                </List>
              </Grid>
            </Grid>
          </ModalAlert>
        )}
        {state.modalKey === 'editRequest' && (
          <ServiceRequest
            loggedUserId={loggedUserId}
            propertyId={state.selectedCall.getPropertyId()}
            userID={state.selectedCall.getUserId()}
            serviceCallId={state.selectedCall.getId()}
            onClose={() => resetModal(false, true)}
          />
        )}
      </Modal>
      </div>
      )}
    </PageWrapper>
  );
};
