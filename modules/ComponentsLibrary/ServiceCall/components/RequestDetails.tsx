import React, { FC, useEffect, useState, useCallback } from 'react';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { InfoTable } from '../../InfoTable';
import parseISO from 'date-fns/esm/parseISO';
import setHours from 'date-fns/esm/setHours';
import setMinutes from 'date-fns/esm/setMinutes';
import format from 'date-fns/esm/format';
import { User } from '@kalos-core/kalos-rpc/User';

export interface Props {
  requestInfo: Event;
  departmentList: TimesheetDepartment[];
  userList: User[];
  propertyEvents: Event[];
}

export const RequestDetails: FC<Props> = props => {
  const {
    requestInfo,
    departmentList,
    userList,
    propertyEvents,
  } = props;

  const [userNames, setUserNames] = useState<string[]>([]);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [propertyEvent, setPropertyEvent] = useState<string>("");

  const getUserNamesByIds = useCallback(() => {
    const users = requestInfo.getLogTechnicianAssigned().split(',');
    let userNames : string[] = [];
    for (let i in users) {
      const userName = userList.find(user => user.getId() === Number(users[i]));
      if (userName) {
        userNames = userNames.concat(`${userName.getFirstname()} ${userName.getLastname()}`);
      }
    }
    return userNames.length > 0 ? userNames : ["Unassigned"];
  }, [userList, requestInfo])

  const getDepartmentNameById = useCallback(() => {
    const department = departmentList.find(dpmnt => Number(dpmnt.getId()) === Number(requestInfo.getDepartmentId()));
    return department ? `${department.getValue()} - ${department.getDescription()}` : "N/A"
  }, [departmentList, requestInfo])

  const getPropertyEventById = useCallback(() => {
    const event = propertyEvents.find(property => property.getId() === requestInfo.getCallbackOriginalId());
    return event ? `${event.getLogJobNumber()} - ${event.getName()}` : "N/A";
  }, [propertyEvents, requestInfo])

  useEffect(() => {
    setUserNames(getUserNamesByIds());
    setDepartmentName(getDepartmentNameById());
    setPropertyEvent(getPropertyEventById());
  }, [getUserNamesByIds, getDepartmentNameById, getPropertyEventById])

  return (
    <InfoTable data={
      [
        [
          {label: 'Start Date/Time', value: `${requestInfo.getDateStarted() ? format(setMinutes(setHours(parseISO(requestInfo.getDateStarted()), Number(requestInfo.getTimeStarted().substring(0,2))), Number(requestInfo.getTimeStarted().substring(3))), 'MM/dd/yyyy h:mm aa') : ''}`},
          {label: 'End Date/Time', value: `${requestInfo.getDateEnded() ? format(setMinutes(setHours(parseISO(requestInfo.getDateEnded()), Number(requestInfo.getTimeEnded().substring(0,2))), Number(requestInfo.getTimeEnded().substring(3))), 'MM/dd/yyyy h:mm aa') : ''}`},
        ],
        [
          {label: 'Sector', value: `${requestInfo.getIsResidential() === 1 ? "Residential" : "Commercial"}`},
          {label: 'Department', value: `${departmentName}`},
          //@ts-ignore
          {label: 'Tech(s) Assigned', value: `${userNames.toString().replaceAll(',', ', ')}`},
        ],
        [
          {label: 'Job Status', value: `${requestInfo.getLogJobStatus()}`},
          {label: 'Job Type', value: `${requestInfo.getJobType()}`},
          {label: 'Job SubType', value: `${requestInfo.getJobSubtype()}`},
        ],
        [
          {label: 'Payment Type', value: `${requestInfo.getLogPaymentType()}`},
          {label: 'Amount Quoted', value: `${requestInfo.getAmountQuoted()}`},
        ],
        [
          {label: 'High Priority', value: `${requestInfo.getHighPriority() ? "Yes" : "No"}`},
          {label: 'Diagnostic Quoted', value: `${requestInfo.getDiagnosticQuoted() ? "Yes" : "No"}`},
          {label: 'Is LMPC', value: `${requestInfo.getIsLmpc() ? "Yes" : "No"}`},
          {label: 'Is Callback', value: `${requestInfo.getIsCallback() ? "Yes" : "No"}`},
        ],
        [
          {label: 'Callback Details', value: `${propertyEvent}`}
        ],
        [
          {label: 'Brief Description', value: `${requestInfo.getName().length > 100 ? requestInfo.getName().substring(0, 100).concat("...") : requestInfo.getName()}`}
        ],
        [
          {label: 'Service Needed', value: `${requestInfo.getDescription().length > 100 ? requestInfo.getDescription().substring(0, 100).concat("...") : requestInfo.getDescription()}`}
        ],
        [
          {label: 'Service Call Notes', value: `${requestInfo.getLogNotes().length > 100 ? requestInfo.getLogNotes().substring(0, 100).concat("...") : requestInfo.getLogNotes()}`}
        ],
      ]
    }
    />
  )
}