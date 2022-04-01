import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import {
  ENROUTE,
  CHECKIN,
  CHECKOUT,
  TaskEvent,
} from '../../../@kalos-core/kalos-rpc/TaskEvent';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import HighestIcon from '@material-ui/icons/Block';
import HighIcon from '@material-ui/icons/ChangeHistory';
import NormalIcon from '@material-ui/icons/RadioButtonUnchecked';
import LowIcon from '@material-ui/icons/Details';
import {
  ProjectTask,
  Task,
  TaskPriority,
  TaskStatus,
} from '../../../@kalos-core/kalos-rpc/Task';
import { SectionBar } from '../SectionBar';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { PlainForm } from '../PlainForm';
import { Button } from '../Button';
import { ConfirmDelete } from '../ConfirmDelete';
import { Confirm } from '../Confirm';
import { CalendarEvents } from '../CalendarEvents';
import { GanttChart } from '../GanttChart';
import { Tabs } from '../Tabs';
import {
  formatDate,
  TaskClientService,
  timestamp,
  EventClientService,
  UserClientService,
  TaskEventClientService,
  loadProjects,
  TimesheetDepartmentClientService,
  ActivityLogClientService,
} from '../../../helpers';
import { PROJECT_TASK_STATUS_COLORS, OPTION_ALL } from '../../../constants';
import './EditProject.module.less';

import { format } from 'date-fns';
import { CostReport } from '../CostReport';
import { Loader } from '../../Loader/main';
import { CheckInProjectTask } from '../CheckInProjectTask';
import { getPropertyAddress } from '../../../@kalos-core/kalos-rpc/Property';
import { ActivityLog } from '../../../@kalos-core/kalos-rpc/ActivityLog';
import { User } from '../../../@kalos-core/kalos-rpc/User';
import { Event } from '../../../@kalos-core/kalos-rpc/Event';
import { TimesheetDepartment } from '../../../@kalos-core/kalos-rpc/TimesheetDepartment';

export interface Props {
  serviceCallId: number;
  loggedUserId: number;
  onClose?: () => void;
}

export type SearchType = {
  technicians: string;
  statusId: number;
  priorityId: number;
};

export type ExtendedProjectTaskType = ProjectTask & {
  startTime: string;
  endTime: string;
};

export const PROJECT_TASK_PRIORITY_ICONS: {
  [key: number]: FC<SvgIconProps>;
} = {
  1: LowIcon,
  2: NormalIcon,
  3: HighIcon,
  4: HighestIcon,
};

export const SCHEMA_PROJECT: Schema<Event> = [
  [
    {
      name: 'getDateStarted',
      label: 'Start Date',
      type: 'date',
    },

    {
      name: 'getDateEnded',
      label: 'End Date',
      type: 'date',
    },
  ],
  [
    {
      name: 'getDepartmentId',
      label: 'Department',
      type: 'department',
    },
  ],
  [
    {
      name: 'getDescription',
      label: 'Description',
      type: 'text',
      multiline: true,
    },
  ],
];

export const EditProject: FC<Props> = ({
  serviceCallId: serviceCallIdInit,
  loggedUserId,
  onClose,
}) => {
  const [serviceCallId, setServiceCallId] = useState<number>(serviceCallIdInit);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadedInit, setLoadedInit] = useState<boolean>(false);
  const [loggedUser, setLoggedUser] = useState<User>();
  const [editingTask, setEditingTask] = useState<ExtendedProjectTaskType>();
  const [deletingEvent, setDeletingEvent] = useState<boolean>(false);
  const [pendingDeleteEvent, setPendingDeleteEvent] = useState<Event>();
  const [pendingDeleteTask, setPendingDeleteTask] =
    useState<ExtendedProjectTaskType>();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);

  const [taskEvents, setTaskEvents] = useState<TaskEvent[]>([]);
  const [taskEventsLoaded, setTaskEventsLoaded] = useState<boolean>(false);
  const [pendingCheckout, setPendingCheckout] = useState<boolean>(false);
  const [pendingCheckoutChange, setPendingCheckoutChange] =
    useState<boolean>(false);
  const [pendingCheckoutDelete, setPendingCheckoutDelete] =
    useState<boolean>(false);
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [priorities, setPriorities] = useState<TaskPriority[]>([]);
  const [departments, setDepartments] = useState<TimesheetDepartment[]>([]);
  const [errorProject, setErrorProject] = useState<string>('');
  const [errorTask, setErrorTask] = useState<string>('');

  const [search, setSearch] = useState<SearchType>({
    technicians: '',
    statusId: 0,
    priorityId: 0,
  });
  const [event, setEvent] = useState<Event>();
  const [projects, setProjects] = useState<Event[]>([]);
  const [editingProject, setEditingProject] = useState<boolean>(false);

  const loadEvent = useCallback(async () => {
    setLoadingEvent(true);
    try {
      const event = await EventClientService.LoadEventByServiceCallID(
        serviceCallId,
      );
      setEvent(event);
    } catch (err) {
      console.log({ err });
      if (!err.message.includes('failed to scan to struct')) {
        console.error('Error occurred during ProjectTask query:', err);
      }
    }
    setLoadingEvent(false);
  }, [setEvent, setLoadingEvent, serviceCallId]);
  const loadInit = useCallback(async () => {
    let promises = [];

    promises.push(
      new Promise<void>(async resolve => {
        const projects = await loadProjects();
        setProjects(projects);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        await loadEvent();
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        try {
          const statuses = await TaskClientService.loadProjectTaskStatuses();
          setStatuses(statuses);
        } catch (err) {
          console.log({ err });
          if (!err.message.includes('failed to scan to struct')) {
            console.error('Error occurred during ProjectTask query:', err);
          }
        }
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        try {
          const priorities =
            await TaskClientService.loadProjectTaskPriorities();
          setPriorities(priorities);
        } catch (err) {
          console.log({ err });
          if (!err.message.includes('failed to scan to struct')) {
            console.error('Error occurred during ProjectTask query:', err);
          }
        }
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        try {
          const departments =
            await TimesheetDepartmentClientService.loadTimeSheetDepartments();
          setDepartments(departments);
        } catch (err) {
          console.log({ err });
          if (!err.message.includes('failed to scan to struct')) {
            console.error('Error occurred during ProjectTask query:', err);
          }
        }
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        try {
          const loggedUser = await UserClientService.loadUserById(loggedUserId);
          setLoggedUser(loggedUser);
        } catch (err) {
          console.log({ err });
          if (!err.message.includes('failed to scan to struct')) {
            console.error('Error occurred during ProjectTask query:', err);
          }
        }
        resolve();
      }),
    );

    await Promise.all(promises);

    setLoadedInit(true);
  }, [
    loadEvent,
    setProjects,
    setStatuses,
    setPriorities,
    setDepartments,
    setLoadedInit,
    loggedUserId,
  ]);

  const load = useCallback(async () => {
    try {
      const tasks = await EventClientService.loadProjectTasks(serviceCallId);
      setTasks(tasks);
    } catch (err) {
      console.log({ err });
      if (!err.message.includes('failed to scan to struct')) {
        console.error('Error occurred during ProjectTask query:', err);
      }
    }
    setLoading(false);
  }, [setLoading, serviceCallId, setTasks]);
  useEffect(() => {
    if (!loadedInit) {
      loadInit();
    }
    if (loadedInit && !loaded) {
      setLoaded(true);
      load();
    }
  }, [loadedInit, loadInit, loaded, setLoaded, load]);
  const loadTaskEvents = useCallback(
    async (taskId: number) => {
      setTaskEventsLoaded(false);
      const taskEvents = await TaskEventClientService.loadTaskEventsByFilter({
        id: taskId,
        technicianUserId: loggedUserId,
      });
      setTaskEvents(taskEvents);
      setTaskEventsLoaded(true);
    },
    [setTaskEventsLoaded, setTaskEvents, loggedUserId],
  );
  const handleSetEditing = useCallback(
    (editingTask?: ExtendedProjectTaskType) => async () => {
      setErrorTask('');
      setEditingTask(editingTask);
      if (editingTask && editingTask.getId()) {
        await loadTaskEvents(editingTask.getId());
      }
    },
    [setEditingTask, loadTaskEvents],
  );

  const handleUploadLog = useCallback(async (req: ActivityLog) => {
    try {
      let log = await ActivityLogClientService.Create(req);
    } catch (err) {
      console.error(
        `An error occurred while attempting to create an activity log: ${err}`,
      );
    }
  }, []);

  const handleDeleteEvent = useCallback(
    async (eventId: number) => {
      setDeletingEvent(true);
      try {
        await EventClientService.deleteEventById(eventId);
        setDeletingEvent(false);
        let req = new ActivityLog();
        req.setActivityName(`Deleted event: ${eventId}`);
        req.setActivityDate(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        req.setUserId(loggedUserId);
        req.setEventId(eventId);
        handleUploadLog(req);
      } catch (err) {
        console.error(
          `An error occurred while attempting to delete an event by ID: ${err}`,
        );
      }

      setPendingDeleteEvent(undefined);
      if (onClose) onClose();
    },
    [handleUploadLog, loggedUserId, onClose],
  );

  // The function used to actually delete projects (projects are of event type)
  const handleSetPendingDeleteEvent = useCallback(
    (pendingDelete?: Event) => () => {
      setPendingDeleteEvent(pendingDelete);
    },
    [setPendingDeleteEvent],
  );

  const handleSetPendingDeleteTask = useCallback(
    (pendingDelete?: ExtendedProjectTaskType) => () =>
      setPendingDeleteTask(pendingDelete),
    [setPendingDeleteTask],
  );
  const handleCheckout = useCallback(async () => {
    if (!editingTask) return;
    setPendingCheckout(false);
    setPendingCheckoutChange(true);
    const isEnroute =
      taskEvents.length === 0 ||
      (taskEvents[0] && taskEvents[0].getActionTaken() === CHECKOUT);
    const isCheckIn =
      taskEvents.length > 0 && taskEvents[0].getActionTaken() === ENROUTE;
    const timeStarted = timestamp();
    const req = new TaskEvent();
    req.setTaskId(editingTask.getId());
    req.setTechnicianUserId(loggedUserId);
    req.setTimeStarted(timeStarted);
    req.setStatusId(1);
    if (isEnroute) {
      req.setActionTaken(ENROUTE);
      await TaskEventClientService.upsertTaskEvent(req);
    } else if (isCheckIn) {
      req.setActionTaken(CHECKIN);
      await TaskEventClientService.upsertTaskEvent(req);
    } else {
      req.setActionTaken(CHECKOUT);
      await TaskEventClientService.upsertTaskEvent(req);
    }
    if (isEnroute || isCheckIn) {
      const pt = new ProjectTask();
      pt.setId(editingTask.getId());
      pt.setExternalCode('user');
      pt.setExternalId(loggedUserId);
      await TaskClientService.upsertEventTask(pt);
      setEditingTask(undefined);
      setEditingTask({ ...pt } as ExtendedProjectTaskType);
      setLoaded(false);
    }
    await loadTaskEvents(editingTask.getId());
    setPendingCheckoutChange(false);
  }, [
    editingTask,
    taskEvents,
    loggedUserId,
    setPendingCheckout,
    setLoaded,
    loadTaskEvents,
    setEditingTask,
    setPendingCheckoutChange,
  ]);
  const handleCheckoutDelete = useCallback(async () => {
    if (!editingTask || taskEvents.length === 0) return;
    setPendingCheckoutDelete(false);
    setPendingCheckoutChange(true);
    try {
      await TaskEventClientService.deleteTaskEvent(taskEvents[0].getId());
    } catch (err) {
      console.error(
        `An error occurred while trying to delete a task event: ${err}`,
      );
    }
    try {
      await loadTaskEvents(editingTask.getId());
    } catch (err) {
      console.log({ err });
      if (!err.message.includes('failed to scan to struct')) {
        console.error('Error occurred during ProjectTask query:', err);
      }
    }
    setPendingCheckoutChange(false);
  }, [
    setPendingCheckoutChange,
    taskEvents,
    loadTaskEvents,
    editingTask,
    setPendingCheckoutDelete,
  ]);
  const handleSetPendingCheckout = useCallback(
    (pendingCheckout: boolean) => () => setPendingCheckout(pendingCheckout),
    [setPendingCheckout],
  );
  const handleSetPendingCheckoutDelete = useCallback(
    (pendingCheckoutDelete: boolean) => () =>
      setPendingCheckoutDelete(pendingCheckoutDelete),
    [setPendingCheckoutDelete],
  );

  //TODO change to permission groups check
  const isAnyManager = useMemo(
    () => departments.map(dpt => dpt.getManagerId()).includes(loggedUserId),
    [departments, loggedUserId],
  );
  const isAssignedToAnyTask = useMemo(
    () =>
      tasks.some(
        t =>
          t.getExternalCode() === 'user' && t.getExternalId() === loggedUserId,
      ),
    [tasks, loggedUserId],
  );
  const hasEditRights = isAnyManager || isAssignedToAnyTask;
  const isOwner = useMemo(
    () =>
      editingTask &&
      (editingTask.getCreatorUserId() === loggedUserId || !editingTask.getId()),
    [editingTask, loggedUserId],
  );
  const statusOptions = useMemo(
    () =>
      statuses.map(ts => ({
        value: ts.getId(),
        label: ts.getDescription(),
        color: PROJECT_TASK_STATUS_COLORS[ts.getId()],
      })),
    [statuses],
  );
  const statusOptionsWithAll = useMemo(
    () => [{ label: OPTION_ALL, value: 0 }, ...statusOptions],
    [statusOptions],
  );
  const priorityOptions = useMemo(
    () =>
      priorities.map(tp => ({
        value: tp.getId(),
        label: tp.getDescription(),
        icon: PROJECT_TASK_PRIORITY_ICONS[tp.getId()],
      })),
    [priorities],
  );
  const priorityOptionsWithAll = useMemo(
    () => [{ label: OPTION_ALL, value: 0 }, ...priorityOptions],
    [priorityOptions],
  );
  const handleSaveTask = useCallback(
    async (startTime: string, endTime: string, formData: ProjectTask) => {
      if (!event) return;
      if (
        formData.getStartDate() > formData.getEndDate() &&
        formData.getEndDate() != ''
      ) {
        setErrorTask('Start Date cannot be after End Date.');
        console.error('Start Date cannot be after End Date.');
        return;
      }
      if (event.getDateStarted().substr(0, 10) > formData.getStartDate()) {
        setErrorTask(
          "Task's Start Date cannot be before Project's Start Date.",
        );
        console.error(
          "Task's Start Date cannot be before Project's Start Date.",
        );
        return;
      }
      if (event.getDateEnded().substr(0, 10) < formData.getEndDate()) {
        setErrorTask("Task's End Date cannot be after Project's End Date.");
        console.error("Task's End Date cannot be after Project's End Date.");
        return;
      }
      setEditingTask(undefined);
      setLoading(true);
      formData.setEventId(serviceCallId);
      formData.setStartDate(`${formData.getStartDate()} ${startTime}:00`);
      formData.setEndDate(`${formData.getEndDate()} ${endTime}:00`);
      formData.setCheckedIn(formData.getCheckedIn());
      if (formData.getId()) formData.setCreatorUserId(loggedUserId);
      await TaskClientService.upsertEventTask(formData);
      setLoaded(false);
    },
    [
      event,
      serviceCallId,
      loggedUserId,
      setLoaded,
      setEditingTask,
      setLoading,
      setErrorTask,
    ],
  );
  const handleDeleteTask = useCallback(async () => {
    if (pendingDeleteTask) {
      const id = pendingDeleteTask.getId();
      setPendingDeleteTask(undefined);
      setEditingTask(undefined);
      setLoading(true);
      try {
        await TaskClientService.deleteProjectTaskById(id);
      } catch (err) {
        console.error(
          `An error occurred while trying to delete a project task by ID: ${err}`,
        );
      }
      setLoaded(false);
    }
  }, [pendingDeleteTask, setPendingDeleteTask]);
  const handleAddTask = useCallback(
    (startDate: string) => {
      if (!loggedUser || !event) return;
      if (
        !(
          isAnyManager ||
          event.getDepartmentId() === loggedUser.getEmployeeDepartmentId()
        )
      )
        return;
      let newPt = new ProjectTask();
      newPt.setStartDate(startDate);
      newPt.setEndDate(startDate);
      newPt.setStatusId(1);
      newPt.setPriorityId(2);
      setEditingTask({
        startTime: '09:00',
        endTime: '10:00',
        ...newPt,
      } as ExtendedProjectTaskType);
    },
    [setEditingTask, loggedUser, event, isAnyManager],
  );
  const handleSetEditingProject = useCallback(
    (editingProject: boolean) => () => {
      setErrorProject('');
      setEditingProject(editingProject);
    },
    [setEditingProject],
  );
  const handleSaveProject = useCallback(
    async (formData: Event) => {
      if (event) {
        if (
          formData.getDateEnded().substr(0, 10) <
          formData.getDateStarted().substr(0, 10)
        ) {
          setErrorProject('Start Date cannot be after End date.');
          return;
        }
        if (
          tasks.some(
            task =>
              task.getStartDate().substr(0, 10) <
              formData.getDateStarted().substr(0, 10),
          )
        ) {
          setErrorProject(
            'Some existing tasks are already defined before new project Start Date.',
          );
          return;
        }
        if (
          tasks.some(
            task =>
              task.getEndDate().substr(0, 10) >
              formData.getDateEnded().substr(0, 10),
          )
        ) {
          setErrorProject(
            'Some existing tasks are already defined after new project End Date.',
          );
          return;
        }
        setEditingProject(false);
        setLoadingEvent(true);
        formData.setId(event.getId());
        await EventClientService.upsertEvent({
          ...formData,
        } as Event);
        loadEvent();
      }
    },
    [event, tasks, loadEvent],
  );

  const SCHEMA_SEARCH: Schema<SearchType> = [
    [
      {
        name: 'technicians',
        label: 'Employees',
        type: 'technicians',
        technicianAsEmployee: true,
      },
      {
        name: 'statusId',
        label: 'Status',
        options: statusOptionsWithAll,
      },
      {
        name: 'priorityId',
        label: 'Priority',
        options: priorityOptionsWithAll,
      },
    ],
  ];
  const SCHEMA: Schema<ExtendedProjectTaskType> = [
    [
      {
        name: 'getId',
        type: 'hidden',
      },
    ],
    [
      {
        name: 'getExternalId',
        label: 'Assigned Employee',
        type: 'technician',
        disabled: !hasEditRights,
        technicianAsEmployee: true,
      },
    ],
    [
      {
        name: 'getBriefDescription',
        label: 'Brief Description',
        multiline: true,
        required: !hasEditRights,
        disabled: !isOwner,
      },
    ],
    [
      {
        name: 'getStartDate',
        label: 'Start Date',
        type: 'date',
        required: true,
        disabled: !isOwner,
      },
      {
        name: 'startTime',
        label: 'Start Time',
        type: 'time',
        required: true,
        disabled: !isOwner,
      },
    ],
    [
      {
        name: 'getEndDate',
        label: 'End Date',
        type: 'date',
        required: true,
        disabled: !isOwner,
      },
      {
        name: 'endTime',
        label: 'End Time',
        type: 'time',
        required: true,
        disabled: !isOwner,
      },
    ],
    [
      {
        name: 'getStatusId',
        label: 'Status',
        required: true,
        options: statusOptions,
        disabled: !isOwner,
      },
    ],
    [
      {
        name: 'getPriorityId',
        label: 'Priority',
        required: true,
        options: priorityOptions,
        disabled: !isOwner,
      },
    ],
  ];
  const filteredTasks = tasks.filter(task => {
    if (search.statusId) {
      if (task.getStatusId() !== search.statusId) return false;
    }
    if (search.priorityId) {
      if (task.getPriorityId() !== search.priorityId) return false;
    }
    if (search.technicians) {
      if (
        task.getExternalCode() === 'project' ||
        (task.getExternalCode() === 'user' &&
          !search.technicians
            .split(',')
            .map(id => +id)
            .includes(task.getExternalId()))
      )
        return false;
    }
    return true;
  });

  return (
    <div>
      <SectionBar
        title="Project Management"
        footer={
          event && !loadingEvent ? (
            <>
              <div>Address: {getPropertyAddress(event.getProperty())}</div>
              <div>Start date: {formatDate(event.getDateStarted())}</div>
              <div>End date: {formatDate(event.getDateEnded())}</div>
              <div>Job Number: {event.getLogJobNumber()}</div>
              <div>Description: {event.getDescription()}</div>
            </>
          ) : (
            'Loading...'
          )
        }
        actions={[
          ...(hasEditRights
            ? [
                {
                  label: 'Edit Project',
                  onClick: handleSetEditingProject(true),
                  disabled: loading || loadingEvent,
                },
              ]
            : []),
          {
            label: 'Add Task',
            onClick: () => {
              let newPt = new ProjectTask();
              newPt.setStartDate(
                event ? event.getDateStarted().substr(0, 10) : '',
              );
              newPt.setEndDate(
                event ? event.getDateStarted().substr(0, 10) : '',
              );
              newPt.setStatusId(1);
              newPt.setPriorityId(2);
              handleSetEditing({
                ...newPt,
                startTime: '09:00',
                endTime: '10:00',
              } as ExtendedProjectTaskType);
            },
            disabled:
              loading ||
              loadingEvent ||
              !event ||
              !loggedUser ||
              !(
                isAnyManager ||
                event.getDepartmentId() === loggedUser.getEmployeeDepartmentId()
              ),
          },
          {
            label: 'Delete Project',
            onClick: handleSetPendingDeleteEvent(event),
            disabled:
              loading ||
              loadingEvent ||
              !event ||
              !loggedUser ||
              !event.getIsActive() ||
              !(
                isAnyManager ||
                event.getDepartmentId() === loggedUser.getEmployeeDepartmentId()
              ),
          },
          ...(onClose
            ? [
                {
                  label: 'Close',
                  onClick: onClose,
                },
              ]
            : []),
        ]}
        fixedActions
        actionsAndAsideContentResponsive
        asideContent={
          <CostReport
            serviceCallId={serviceCallId}
            loggedUserId={loggedUserId}
          />
        } // CostReport will go here once it is more stable
        asideContentFirst
        sticky={false}
      />
      <PlainForm
        schema={SCHEMA_SEARCH}
        data={search}
        onChange={setSearch}
        disabled={loading || loadingEvent}
      />
      {event ? (
        <CheckInProjectTask
          projectToUse={event}
          loggedUserId={loggedUserId}
          serviceCallId={serviceCallId}
        />
      ) : (
        <></>
      )}
      <Tabs
        defaultOpenIdx={0}
        tabs={[
          {
            label: 'Calendar',
            content: event ? (
              <CalendarEvents
                events={filteredTasks.map(task => {
                  if (task.getEndDate() == '0000-00-00 00:00:00') {
                    let date = new Date();
                    date.setMinutes(date.getMinutes() + 1);
                    task.setEndDate(format(date, 'yyyy-MM-dd hh-mm-ss'));
                  }
                  const [startDate, startHour] = task.getStartDate().split(' ');
                  const [endDate, endHour] = task.getEndDate().split(' ');
                  return {
                    id: task.getId(),
                    startDate: task.getStartDate(),
                    endDate: task.getEndDate(),
                    startHour: startHour,
                    endHour: endHour,
                    notes: task.getBriefDescription(),
                    status: statuses
                      .find(status => status.getId() === task.getStatusId())
                      ?.getDescription(),
                    statusColor: PROJECT_TASK_STATUS_COLORS[task.getStatusId()],
                    priority: priorities
                      .find(
                        priority => priority.getId() === task.getPriorityId(),
                      )
                      ?.getDescription(),
                    priorityId: task.getPriorityId(),
                    assignee: task.getOwnerName(),
                    onClick:
                      task.getCreatorUserId() === loggedUserId || hasEditRights
                        ? handleSetEditing({
                            ...task,
                            startTime: startHour.substr(0, 5),
                            endTime: endHour.substr(0, 5),
                          } as ExtendedProjectTaskType)
                        : undefined,
                  };
                })}
                startDate={event.getDateStarted().substr(0, 10)}
                endDate={event.getDateEnded().substr(0, 10)}
                loading={loading || loadingEvent}
                onAdd={handleAddTask}
              />
            ) : null,
          },
          {
            label: 'Gantt Chart',
            content: event ? (
              <GanttChart
                events={filteredTasks.map(task => {
                  const [startDate, startHour] = task.getStartDate().split(' ');
                  const [endDate, endHour] = task.getEndDate().split(' ');
                  return {
                    id: task.getId(),
                    startDate,
                    endDate,
                    startHour,
                    endHour,
                    notes: task.getBriefDescription(),
                    status: statuses
                      .find(status => status.getId() === task.getStatusId())
                      ?.getDescription(),
                    statusColor: PROJECT_TASK_STATUS_COLORS[task.getStatusId()],
                    priority: priorities
                      .find(status => status.getId() === task.getPriorityId())
                      ?.getDescription(),
                    priorityId: task.getPriorityId(),
                    assignee: task.getOwnerName(),
                    onClick:
                      task.getCreatorUserId() === loggedUserId || hasEditRights
                        ? handleSetEditing({
                            ...task,
                            startTime: startHour.substr(0, 5),
                            endTime: endHour.substr(0, 5),
                          } as ExtendedProjectTaskType)
                        : undefined,
                  };
                })}
                startDate={event.getDateStarted().substr(0, 10)}
                endDate={event.getDateEnded().substr(0, 10)}
                loading={loading || loadingEvent}
                onAdd={handleAddTask}
              />
            ) : null,
          },
          {
            label: 'Projects Gantt Chart',
            content:
              projects.length > 0 ? (
                <GanttChart
                  events={projects.map(task => {
                    const [startDate, startHour] = task
                      .getDateStarted()
                      .split(' ');
                    const [endDate, endHour] = task.getDateEnded().split(' ');
                    return {
                      id: task.getId(),
                      startDate,
                      endDate,
                      startHour,
                      endHour,
                      notes: task.getDescription(),
                      statusColor: '#' + task.getColor(),
                      onClick: () => {
                        setServiceCallId(task.getId());
                        setLoaded(false);
                        setLoadedInit(false);
                        // load();
                      },
                    };
                  })}
                  startDate={projects[0].getDateStarted().substr(0, 10)}
                  endDate={projects[projects.length - 1]
                    .getDateEnded()
                    .substr(0, 10)}
                  loading={loading || loadingEvent}
                />
              ) : (
                <div />
              ),
          },
        ]}
      />
      {editingTask && (
        <Modal open onClose={handleSetEditing()}>
          <Form
            schema={SCHEMA}
            data={editingTask}
            onClose={handleSetEditing()}
            onSave={(task: ExtendedProjectTaskType) =>
              handleSaveTask(task.startTime, task.endTime, task)
            }
            title={`${editingTask.getId() ? 'Edit' : 'Add'} Task`}
            error={errorTask}
          >
            <div className="EditProjectDelete">
              {taskEventsLoaded && !isAnyManager && (
                <>
                  <Button
                    variant="outlined"
                    label={
                      taskEvents.length === 0 ||
                      (taskEvents[0] &&
                        taskEvents[0].getActionTaken() === CHECKOUT)
                        ? 'Enroute'
                        : `Check ${
                            taskEvents.length > 0 &&
                            taskEvents[0].getActionTaken() === CHECKIN
                              ? 'Out'
                              : 'In'
                          }`
                    }
                    onClick={handleSetPendingCheckout(true)}
                    disabled={pendingCheckoutChange}
                  />
                  {taskEvents.length > 0 && (
                    <Button
                      variant="outlined"
                      label={`Delete ${taskEvents[0].getActionTaken()}`}
                      onClick={handleSetPendingCheckoutDelete(true)}
                      disabled={pendingCheckoutChange}
                    />
                  )}
                </>
              )}
              {editingTask.getId() > 0 &&
                editingTask.getCreatorUserId() === loggedUserId && (
                  <Button
                    variant="outlined"
                    label="Delete Task"
                    onClick={handleSetPendingDeleteTask(editingTask)}
                  />
                )}
            </div>
          </Form>
        </Modal>
      )}
      {pendingDeleteTask && (
        <ConfirmDelete
          open
          kind="Task"
          name={pendingDeleteTask.getBriefDescription()}
          onClose={handleSetPendingDeleteTask()}
          onConfirm={handleDeleteTask}
        />
      )}
      {pendingDeleteEvent && (
        <ConfirmDelete
          open
          kind="this project"
          name={''}
          onClose={handleSetPendingDeleteEvent()}
          onConfirm={() => {
            handleDeleteEvent(pendingDeleteEvent.getId());
          }}
        />
      )}
      {deletingEvent && <Loader />}
      {editingProject && event && (
        <Modal open onClose={handleSetEditingProject(false)}>
          <Form
            title="Edit Project"
            onClose={handleSetEditingProject(false)}
            onSave={handleSaveProject}
            schema={SCHEMA_PROJECT}
            data={event}
            error={errorProject}
          />
        </Modal>
      )}
      {pendingCheckout && (
        <Confirm
          open
          title={
            taskEvents.length === 0 ||
            (taskEvents[0] && taskEvents[0].getActionTaken() === CHECKOUT)
              ? 'Confirm Enroute'
              : `Confirm Check ${
                  taskEvents.length > 0 &&
                  taskEvents[0].getActionTaken() === CHECKIN
                    ? 'Out'
                    : 'In'
                }`
          }
          onClose={handleSetPendingCheckout(false)}
          onConfirm={handleCheckout}
        >
          {taskEvents.length === 0 ||
          (taskEvents[0] && taskEvents[0].getActionTaken() === CHECKOUT) ? (
            <div>
              Are you sure you want to Enroute and assign yourself to this task?
            </div>
          ) : taskEvents.length > 0 &&
            taskEvents[0].getActionTaken() === CHECKIN ? (
            <div>Are you sure you want to Check Out from this task?</div>
          ) : (
            <div>
              Are you sure you want to Check In and assign yourself to this
              task?
            </div>
          )}
        </Confirm>
      )}
      {pendingCheckoutDelete && taskEvents[0] && (
        <ConfirmDelete
          open
          kind="action"
          name={taskEvents[0].getActionTaken()}
          onClose={handleSetPendingCheckoutDelete(false)}
          onConfirm={handleCheckoutDelete}
        />
      )}
    </div>
  );
};
