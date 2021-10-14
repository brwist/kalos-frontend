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
} from '../../../helpers';
import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { User } from '@kalos-core/kalos-rpc/User';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { ApiKey } from '@kalos-core/kalos-rpc/ApiKey';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { DateRange } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { FirstCall } from '@kalos-core/kalos-rpc/FirstCall';
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
import { AddCircleOutlineTwoTone } from '@material-ui/icons';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';


export interface Props {
  loggedUserId: number;
  testUserId?: number;
  disableSlack?: boolean;
}

const initialFormData : FormData = {
  departmentIds: [],
  division: 1,
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
  const [state, firstCallDashboard] = useReducer(reducer, initialState);

  const handleModalToggle = (modalKey : string) => {
    firstCallDashboard({
      type: 'setModal',
      data: {
        openModal: !state.openModal,
        modalKey: modalKey,
      }
    });
  }
  const handleAddTechToggle = () => {
    firstCallDashboard({ type: 'setShowAddTech', data: !state.showAddTech });
  }
  const equals = (a : any, b : any) =>
    a.length === b.length &&
    a.every((v : any, i : number) => v === b[i]);

  const resetModal = () => {
    switch (state.modalKey) {
      case 'Class': {
        const techList : number[] = [];
        state.classTechs.map(tech => techList.push(tech.getUserId()));
        const data = {
          isTomorrow: state.classTechs ? true : false,
          start: state.formData.classTime,
          list: techList,
        };
        if (data.start !== state.firstCallClass.start || !equals(data.list,state.firstCallClass.list)) {
          firstCallDashboard({ type: 'setFirstCallClass', data: data});
        }
        break;
      }
      case 'Meeting': {
        const techList : number[] = [];
        state.meetingTechs.map(tech => techList.push(tech.getUserId()));
        const data = {
          isTomorrow: state.meetingTechs ? true : false,
          start: state.formData.meetingTime,
          list: techList,
        };
        if (data.start !== state.firstCallMeeting.start || !equals(data.list,state.firstCallMeeting.list)) {
          firstCallDashboard({ type: 'setFirstCallMeeting', data: data});
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
              type: state.selectedCall.getJobType(),
              subType: state.selectedCall.getJobSubtype(),
              start: state.selectedCall.getTimeStarted(),
              end: state.selectedCall.getTimeEnded(),
              propertyId: state.selectedCall.getPropertyId(),
              propertyAddress: state.selectedCall.getPropertyAddress(),
              propertyCity: state.selectedCall.getPropertyCity(),
              custName: state.selectedCall.getCustName(),
              userBusinessName: state.selectedCall.getUserBusinessname(),
              userId: state.selectedCall.getUserId(),
              notes: state.selectedCall.getNotes(),
            }
            firstCallDashboard({ type: 'setFirstCallCalls', data: state.firstCallCalls.concat(newCall) });
          }
        } else if (firstCall[0].notes !== state.selectedCall.getNotes() || firstCall[0].assigned !== assignedTech) {
          if (assignedTech.length) {
            const updatedCall : CallObj = {
              id: firstCall[0].id,
              assigned: assignedTech,
              description: firstCall[0].description,
              type: firstCall[0].type,
              subType: firstCall[0].subType,
              start: firstCall[0].start,
              end: firstCall[0].end,
              propertyId: firstCall[0].propertyId,
              propertyAddress: firstCall[0].propertyAddress,
              propertyCity: firstCall[0].propertyCity,
              custName: firstCall[0].custName,
              userBusinessName: firstCall[0].userBusinessName,
              userId: firstCall[0].userId,
              notes: state.selectedCall.getNotes(),
            }
            const fc = state.firstCallCalls;
            fc.splice(fc.findIndex(call => call.id === state.selectedCall.getId()),1);
            firstCallDashboard({ type: 'setFirstCallCalls', data: fc.concat(updatedCall).sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)) })
          } else {
            const fc = state.firstCallCalls;
            fc.splice(fc.findIndex(call => call.id === state.selectedCall.getId()),1);
            firstCallDashboard({ type: 'setFirstCallCalls', data: fc });
          }
        }
        break;
      }
    }
    firstCallDashboard({
      type: 'setModal',
      data: {
        openModal: !state.openModal,
        modalKey: '',
      }
    });
  }

  const handleFormDataUpdate = (data : any, timesOnly=false) => {
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
    if (data.division && data.division !== state.formData.division) {
      updateFormData.division = data.division;
      resetPage = true;
    }
    if (data.jobTypes) {
      updateFormData.jobTypes = data.jobTypes;
      refreshCalls = true;
    }
    if (data.availableTechs) {
      updateFormData.availableTechs = data.availableTechs;
    }
    firstCallDashboard({ type: 'setFormData', data: {formData: updateFormData} });
    if (resetPage) {
      firstCallDashboard({ type: 'setLoaded', data: false });
    }
    if (refreshCalls) {
      firstCallDashboard({ type: 'setRefreshCalls', data: true });
    }
  }

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
      firstCallDashboard({
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
    firstCallDashboard({ type: 'setProcessing', data: true });
    const currentCall = state.selectedCall;
    const currentAssignees = state.assigneeList;
    const currentInUse = state.firstCallInUse;
    const currentTechArray = currentCall.getLogTechnicianAssigned().split(',');
    if (updateType === 'remove') {
      currentTechArray.splice(currentTechArray.findIndex(tech => tech === String(id)),1);
      currentAssignees.splice(currentAssignees.findIndex(assignee => assignee.id === id), 1);
      currentInUse.splice(currentInUse.findIndex(tech => tech === id));
    } else {
      currentTechArray.push(String(id));
      currentAssignees.push({id: id, name: state.techs.filter(tech=>tech.getUserId() === id)[0].getTechname()});
      currentInUse.push(id);
    }
    currentCall.setLogTechnicianAssigned(currentTechArray.toString());
    firstCallDashboard({
      type: 'setAssigneesAndCall',
      data: {
        assigneeList: currentAssignees,
        selectedCall: currentCall,
      }
    });
    firstCallDashboard({
      type: 'setFirstCallInUse',
      data: currentInUse
    });
  }

  const handleUnOffTech = async (tech : DispatchableTech) => {
    firstCallDashboard({ type: 'setProcessing', data: true});
    const offTechs = state.firstCallManualOff;
    const index = offTechs.findIndex(id => id === tech.getUserId());
    offTechs.splice(index,1);
    firstCallDashboard({ type: 'setFirstCallManualOff', data: offTechs});
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
      firstCallDashboard({
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
      firstCallDashboard({ type: 'setCalls', data: {available: newCalls.availableCalls, assigned: newCalls.assignedCalls} });
    } catch (err) {
      console.error(err);
    }
  }

  const handleSave = useCallback(async () => {
    console.log('saving');
    let allowSave = true;
    let id = 0;
    const saveTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const updatedFirstCall = {
      calls: state.firstCallCalls,
      meeting: state.firstCallMeeting,
      class: state.firstCallClass,
      manualOff: state.firstCallManualOff,
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
      firstCallDashboard({ type: 'setFailedSave', data: {save: false, error: 'DateMismatch'}});
    } else {
      if (state.newFirstCall) {
        const newCall = await FirstCallClientService.Create(firstCall);
        id = newCall.getId();
      } else if (allowSave) {
        await FirstCallClientService.Update(firstCall);
      } 
      firstCallDashboard({ type: 'setSave', data: {save: false, saveTime: saveTime, firstCallId: id, isNew: false}});
    }
  }, [
    state.firstCallCalls, state.firstCallMeeting,
    state.firstCallClass, state.firstCallManualOff,
    state.firstCallInUse, state.firstCallOnCall,
    state.firstCallMessage, state.firstCallExpires,
    state.firstCallId, state.formData.division,
    state.newFirstCall, state.saveTime
  ])

  const getTechs = async () => {
    const techs = new DispatchableTech();
    const dr = new DateRange();
    dr.setStart('2012-01-01');
    dr.setEnd(format(new Date(), 'yyyy-MM-dd'));
    techs.setDateRange(dr);
    techs.setDepartmentList('19,20'); //Needs to be based on state.departmentList
    const users = new User();
    users.setIsActive(1);
    users.setIsHvacTech(1);
    users.setDepartmentList('19,20'); //Needs to be based on state.departmentList
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
      return {techList: techList}
    } catch (err) {
      console.error(err)
      return {techList: []}
    }
  }

  const getCalls =  useCallback(async () => {
    const newCall = new DispatchCall();
    newCall.setDateStarted(`${format(addDays(new Date(), 1), 'yyyy-MM-dd')}%`);
    newCall.setSectorGroupList("1");
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
  }, [state.formData.jobTypes])

  const setCalls = useCallback(async () => {
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
    if (state.refreshCalls) {
      firstCallDashboard({ type: 'setCalls', data: {
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
      console.log(displayedDepartments);
      const sectorGroupList = displayedDepartments.map(dep => dep.getSectorGroup());
      return {sectors: sectorGroupList.filter((c,index) => sectorGroupList.indexOf(c) === index && c !== 0).sort((a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0))};
    } catch (err) {
      console.error(
        `An error occurred while getting Departments: ${err}`
      );
      return {sectors: []};
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

  const getPreviousFirstCall = async () => {
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
        inUse: parsedFirstCalls.inUse,
      }
      return {firstCall: firstCallValues, newFirstCall: false, firstCallId: previousFirstCall.getId(), saveTime: previousFirstCall.getDateCreated()};
    } catch (err) {
      console.error(err);
      return {firstCall: initialFirstCall, newFirstCall: true, firstCallId: 0, saveTime: ''};
    }
  }

  const getInitialConstructor = useCallback(async () => {
    const departments = await getDepartments();
    const techs = getTechs();
    const calls = setCalls();
    const jobTypes = getJobTypes();
    const key = getGoogleApiKey();
    const firstCall = getPreviousFirstCall();
    const results = await Promise.all([techs, calls, jobTypes, key, firstCall]);
    handleFormDataUpdate({
      meetingTime: results[4].firstCall.meeting.start,
      classTime: results[4].firstCall.class.start,
      availableTechs: results[0].techList.filter(tech => !results[4].firstCall.manualOff.includes(tech.getUserId()) && !results[4].firstCall.inUse.includes(tech.getUserId())),
    });
    return {
      techs: results[0].techList,
      calls: results[1].availableCalls,
      jobTypes: results[2].jobTypes,
      assigned: results[1].assignedCalls,
      key: results[3].googleKey,
      firstCall: results[4].firstCall,
      isNew: results[4].newFirstCall,
      saveTime: results[4].saveTime,
      firstCallId: results[4].firstCallId,
      sectorList: departments.sectors,
    };
  }, [setCalls])

  const load = useCallback(async() => {
    const initialData = await getInitialConstructor();
    const meetingList = initialData.techs.filter(tech => initialData.firstCall.meeting.list.includes(tech.getUserId()));
    const classList = initialData.techs.filter(tech => initialData.firstCall.class.list.includes(tech.getUserId()))
    firstCallDashboard({
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
        sectorList: initialData.sectorList,
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
        options: ['Residential', 'Commercial Light', 'Commercial Heavy'].map((item, index) => ({
          key: item,
          label: item,
          value: index + 1
        })),
        invisible: state.sectorList.length <= 1 ? true : undefined,
      },
    ],
  ];

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
    console.log('loaded', state.loaded)
    if (!state.loaded) {
      load();
    }
    if (state.refreshCalls) {
      setCalls();
    }
    if (state.save) {
      handleSave();
    }
  }, [load, state.loaded, state.save, handleSave, state.refreshCalls, setCalls])
  return (
    <PageWrapper userID={loggedUserId}>
      <SectionBar 
        title="First Calls" 
        styles={{backgroundColor: "#711313", color: "white", zIndex:3}} 
      />
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
                      firstCallDashboard({ type: 'setFirstCallOnCall', data: newOnCall});
                    }
                  }
                  break;
                }
                case 'dismissTech': {
                  firstCallDashboard({ type: 'setProcessing', data: true });
                  const manualOffTechs = state.firstCallManualOff;
                  manualOffTechs.push(Number(callback.draggableId));
                  firstCallDashboard({ type: 'setFirstCallManualOff', data: manualOffTechs });
                  break;
                }
                default: {
                  firstCallDashboard({ type: 'setSaveCall', data: true });
                  const inUse = state.firstCallInUse;
                  inUse.push(Number(callback.draggableId));
                  const selectedCall = state.calls.concat(state.assignedCalls).filter(call => call.getId() === Number(callback.destination?.droppableId))[0];
                  selectedCall.setLogTechnicianAssigned(selectedCall.getLogTechnicianAssigned().concat(selectedCall.getLogTechnicianAssigned().length > 0 ? `,${callback.draggableId}` : callback.draggableId));
                  handleCallDetails(selectedCall);
                  firstCallDashboard({ type: 'setFirstCallInUse', data: inUse });
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
                  style={{width:'99%', fontSize:'17px', fontStyle:'inherit'}}
                  placeholder="Please Enter Any First Call Notes Here."
                  defaultValue={state.firstCallMessage.replace('     ', '\n')}
                  onBlur={(text)=>{
                    if (state.firstCallMessage !== text.target.value) {
                      firstCallDashboard({ type: 'setFirstCallMessage', data: text.target.value.replace(/\n/g,'     ') });
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
                  techs={state.techs.filter(tech=>!state.firstCallManualOff.includes(tech.getUserId())&&!state.firstCallInUse.includes(tech.getUserId()))}
                  loading={false}
                  isFirstCall={true}
                />
                <DismissedTechs
                  userID={loggedUserId}
                  dismissedTechs={state.techs.filter(tech => state.firstCallManualOff.includes(tech.getUserId()))}
                  handleUndismissTech={handleUnOffTech}
                  isFirstCall={true}
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
            techs={state.techs}
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
                            defaultValue={state.selectedCall.getNotes().replace('     ', '\n')}
                            onBlur={(text) => {
                              if (text.target.value !== state.selectedCall.getNotes()) {
                                const updatedSelectedCall = state.selectedCall;
                                updatedSelectedCall.setNotes(text.target.value.replace(/\n/g,'     '));
                                firstCallDashboard({ type: 'setSelectedCall', data: updatedSelectedCall });
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