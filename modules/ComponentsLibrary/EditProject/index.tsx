import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { ENROUTE, CHECKIN, CHECKOUT } from '@kalos-core/kalos-rpc/TaskEvent';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import HighestIcon from '@material-ui/icons/Block';
import HighIcon from '@material-ui/icons/ChangeHistory';
import NormalIcon from '@material-ui/icons/RadioButtonUnchecked';
import LowIcon from '@material-ui/icons/Details';
import { ProjectTask, Task } from '@kalos-core/kalos-rpc/Task';
import { SectionBar } from '../SectionBar';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { PlainForm } from '../PlainForm';
import { Button } from '../Button';
import { PrintPage, Status } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintParagraph } from '../PrintParagraph';
import { PrintList } from '../PrintList';
import { ConfirmDelete } from '../ConfirmDelete';
import { Confirm } from '../Confirm';
import { CalendarEvents } from '../CalendarEvents';
import { GanttChart } from '../GanttChart';
import { Tabs } from '../Tabs';
import {
  EventType,
  ProjectTaskType,
  getPropertyAddress,
  formatDate,
  upsertEventTask,
  TaskStatusType,
  TaskPriorityType,
  TaskClientService,
  loadTimesheetDepartments,
  TimesheetDepartmentType,
  upsertEvent,
  PerDiemType,
  PerDiemRowType,
  getDepartmentName,
  usd,
  loadPerDiemsLodging,
  loadTransactionsByEventId,
  TransactionType,
  TaskEventType,
  loadTaskEventsByFilter,
  upsertTaskEvent,
  timestamp,
  UserType,
  EventClientService,
  UserClientService,
  PerDiemClientService,
  TaskEventClientService,
  padWithZeroes,
  TransactionClientService,
  TimesheetLineType,
  loadProjects,
} from '../../../helpers';
import {
  PROJECT_TASK_STATUS_COLORS,
  OPTION_ALL,
  MEALS_RATE,
  NULL_TIME,
} from '../../../constants';
import './styles.less';
import { addDays, format } from 'date-fns';
import {
  CostReportInfo,
  CostReportInfoList,
} from '@kalos-core/kalos-rpc/compiled-protos/event_pb';
import {
  Transaction,
  TxnDepartment,
} from '@kalos-core/kalos-rpc/compiled-protos/transaction_pb';
import { TransactionClient } from '@kalos-core/kalos-rpc/Transaction';
import {
  PerDiem,
  PerDiemRow,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { TimesheetLine } from '@kalos-core/kalos-rpc/compiled-protos/timesheet_line_pb';
import { TransactionAccount } from '@kalos-core/kalos-rpc/TransactionAccount';
import { Field } from '../Field';

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

type ExtendedProjectTaskType = ProjectTaskType & {
  startTime: string;
  endTime: string;
};

type TransactionDisplayType = {
  jobId: number;
  notes: string;
  description: string;
  amount: number;
};

export const PROJECT_TASK_PRIORITY_ICONS: {
  [key: number]: FC<SvgIconProps>;
} = {
  1: LowIcon,
  2: NormalIcon,
  3: HighIcon,
  4: HighestIcon,
};

export const SCHEMA_PROJECT: Schema<EventType> = [
  [
    {
      name: 'dateStarted',
      label: 'Start Date',
      type: 'date',
    },

    {
      name: 'dateEnded',
      label: 'End Date',
      type: 'date',
    },
  ],
  [
    {
      name: 'departmentId',
      label: 'Department',
      type: 'department',
    },
  ],
  [
    {
      name: 'description',
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
  const [loggedUser, setLoggedUser] = useState<UserType>();
  const [editingTask, setEditingTask] = useState<ExtendedProjectTaskType>();
  const [pendingDelete, setPendingDelete] = useState<ExtendedProjectTaskType>();
  const [tasks, setTasks] = useState<ProjectTaskType[]>([]);
  const [
    costReportInfoList,
    setCostReportInfoList,
  ] = useState<CostReportInfoList>();
  const [taskEvents, setTaskEvents] = useState<TaskEventType[]>([]);
  const [taskEventsLoaded, setTaskEventsLoaded] = useState<boolean>(false);
  const [pendingCheckout, setPendingCheckout] = useState<boolean>(false);
  const [pendingCheckoutChange, setPendingCheckoutChange] = useState<boolean>(
    false,
  );
  const [pendingCheckoutDelete, setPendingCheckoutDelete] = useState<boolean>(
    false,
  );
  const [statuses, setStatuses] = useState<TaskStatusType[]>([]);
  const [priorities, setPriorities] = useState<TaskPriorityType[]>([]);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [errorProject, setErrorProject] = useState<string>('');
  const [errorTask, setErrorTask] = useState<string>('');
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetLineType[]>([]);

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [lodgings, setLodgings] = useState<{ [key: number]: number }>({});
  const [search, setSearch] = useState<SearchType>({
    technicians: '',
    statusId: 0,
    priorityId: 0,
  });
  const [event, setEvent] = useState<EventType>();
  const [projects, setProjects] = useState<EventType[]>([]);
  const [editingProject, setEditingProject] = useState<boolean>(false);
  const [checkedInTask, setCheckedInTask] = useState<ExtendedProjectTaskType>();
  const [currentCheckedInTasks, setCurrentCheckedInTasks] = useState<
    ExtendedProjectTaskType[]
  >();
  const [briefDescription, setBriefDescription] = useState<string>(
    'Automatically set description',
  ); // sets the checked in task's brief description field
  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(0);
  const handleBriefDescriptionChange = useCallback(
    value => {
      setBriefDescription(value);
    },
    [setBriefDescription],
  );
  const loadEvent = useCallback(async () => {
    setLoadingEvent(true);
    //const event = await loadEventById(serviceCallId);
    const event = await EventClientService.LoadEventByServiceCallID(
      serviceCallId,
    );
    setEvent(event);
    setLoadingEvent(false);
  }, [setEvent, setLoadingEvent, serviceCallId]);
  const loadInit = useCallback(async () => {
    let promises = [];

    promises.push(
      new Promise<void>(async resolve => {
        console.log('Loading projects');
        const projects = await loadProjects();
        setProjects(projects);
        console.log('Loaded projects', projects);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        console.log('Loading event in loadInit.');
        await loadEvent();
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const statuses = await TaskClientService.loadProjectTaskStatuses();
        setStatuses(statuses);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const priorities = await TaskClientService.loadProjectTaskPriorities();
        setPriorities(priorities);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const departments = await loadTimesheetDepartments();
        setDepartments(departments);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const loggedUser = await UserClientService.loadUserById(loggedUserId);
        setLoggedUser(loggedUser);
        resolve();
      }),
    );

    Promise.all(promises).then(() => {
      setLoadedInit(true);
    });
  }, [
    loadEvent,
    setProjects,
    setStatuses,
    setPriorities,
    setDepartments,
    setLoadedInit,
    loggedUserId,
    serviceCallId,
  ]);
  const load = useCallback(async () => {
    let promises = [];
    let timesheets: TimesheetLineType[] = [];

    setLoading(true);

    promises.push(
      new Promise<void>(async resolve => {
        let taskReq = new ProjectTask();
        taskReq.setCheckedIn(true);
        taskReq.setCreatorUserId(loggedUserId);
        console.log('Task obj:', taskReq.toObject());
        let tasksList = await TaskClientService.BatchGetProjectTasks(taskReq);
        let tasks = tasksList.getResultsList().map(task => {
          return { ...task } as ExtendedProjectTaskType;
        });
        setCurrentCheckedInTasks(tasks);
        console.log('Project tasks found:', tasks);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        await loadPrintData();
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const tasks = await EventClientService.loadProjectTasks(serviceCallId);
        setTasks(tasks);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        console.log('Loading with GetCostReportInfo');
        let req = new CostReportInfo();
        req.setJobId(serviceCallId);
        const costReportList = await EventClientService.GetCostReportInfo(req);
        console.log('Ended rpc');

        for await (let data of costReportList.getResultsList()) {
          console.log('Timesheet lines being set. Data: ', data);
          timesheets = data.getTimesheetsList().map(line => line.toObject());
        }
        setCostReportInfoList(costReportList);

        console.log('Loaded GetCostReportInfo');
        resolve();
      }),
    );

    Promise.all(promises).then(() => {
      setTimesheets(timesheets);

      let total = 0;
      timesheets.forEach(timesheet => (total = total + timesheet.hoursWorked));
      setTotalHoursWorked(total);

      setLoading(false);
    });
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
      const taskEvents = await loadTaskEventsByFilter({
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
      if (editingTask && editingTask.id) {
        await loadTaskEvents(editingTask.id);
      }
    },
    [setEditingTask, setTaskEventsLoaded],
  );
  const handleSetPendingDelete = useCallback(
    (pendingDelete?: ExtendedProjectTaskType) => () =>
      setPendingDelete(pendingDelete),
    [setPendingDelete],
  );
  const handleCheckout = useCallback(async () => {
    if (!editingTask) return;
    setPendingCheckout(false);
    setPendingCheckoutChange(true);
    const isEnroute =
      taskEvents.length === 0 ||
      (taskEvents[0] && taskEvents[0].actionTaken === CHECKOUT);
    const isCheckIn =
      taskEvents.length > 0 && taskEvents[0].actionTaken === ENROUTE;
    const timeStarted = timestamp();
    if (isEnroute) {
      await upsertTaskEvent({
        taskId: editingTask.id,
        technicianUserId: loggedUserId,
        timeStarted,
        statusId: 1,
        actionTaken: ENROUTE,
      });
    } else if (isCheckIn) {
      await upsertTaskEvent({
        taskId: editingTask.id,
        technicianUserId: loggedUserId,
        timeStarted,
        statusId: 1,
        actionTaken: CHECKIN,
      });
    } else {
      await upsertTaskEvent({
        taskId: editingTask.id,
        technicianUserId: loggedUserId,
        timeStarted,
        timeFinished: timeStarted,
        statusId: 1,
        actionTaken: CHECKOUT,
      });
    }
    if (isEnroute || isCheckIn) {
      await upsertEventTask({
        id: editingTask.id,
        externalCode: 'user',
        externalId: loggedUserId,
      });
      setEditingTask(undefined);
      setEditingTask({
        ...editingTask,
        externalCode: 'user',
        externalId: loggedUserId,
      });
      setLoaded(false);
    }
    await loadTaskEvents(editingTask.id);
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
    await TaskEventClientService.deleteTaskEvent(taskEvents[0].id);
    await loadTaskEvents(editingTask.id);
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
  const handleSetCheckedInTask = useCallback(
    (checkedIn: ExtendedProjectTaskType) => setCheckedInTask(checkedIn),
    [setCheckedInTask],
  );

  const isAnyManager = useMemo(
    () => departments.map(({ managerId }) => managerId).includes(loggedUserId),
    [departments, loggedUserId],
  );
  const isAssignedToAnyTask = useMemo(
    () =>
      tasks.some(
        ({ externalCode, externalId }) =>
          externalCode === 'user' && externalId === loggedUserId,
      ),
    [tasks, loggedUserId],
  );
  const hasEditRights = isAnyManager || isAssignedToAnyTask;
  const isOwner = useMemo(
    () =>
      editingTask &&
      (editingTask.creatorUserId === loggedUserId || !editingTask.id),
    [editingTask, loggedUserId],
  );
  const statusOptions = useMemo(
    () =>
      statuses.map(({ id, description }) => ({
        value: id,
        label: description,
        color: PROJECT_TASK_STATUS_COLORS[id],
      })),
    [statuses],
  );
  const statusOptionsWithAll = useMemo(
    () => [{ label: OPTION_ALL, value: 0 }, ...statusOptions],
    [statusOptions],
  );
  const priorityOptions = useMemo(
    () =>
      priorities.map(({ id, description }) => ({
        value: id,
        label: description,
        icon: PROJECT_TASK_PRIORITY_ICONS[id],
      })),
    [priorities],
  );
  const priorityOptionsWithAll = useMemo(
    () => [{ label: OPTION_ALL, value: 0 }, ...priorityOptions],
    [priorityOptions],
  );
  const handleSaveTask = useCallback(
    async ({
      startDate,
      startTime,
      endDate,
      endTime,
      checkedIn,
      ...formData
    }: ExtendedProjectTaskType) => {
      if (!event) return;
      if (startDate > endDate && endDate != '') {
        setErrorTask('Start Date cannot be after End Date.');
        console.error('Start Date cannot be after End Date.');
        return;
      }
      if (event.dateStarted.substr(0, 10) > startDate) {
        setErrorTask(
          "Task's Start Date cannot be before Project's Start Date.",
        );
        console.error(
          "Task's Start Date cannot be before Project's Start Date.",
        );
        return;
      }
      if (event.dateEnded.substr(0, 10) < endDate) {
        setErrorTask("Task's End Date cannot be after Project's End Date.");
        console.error("Task's End Date cannot be after Project's End Date.");
        return;
      }
      setEditingTask(undefined);
      setLoading(true);
      await upsertEventTask({
        ...formData,
        eventId: serviceCallId,
        startDate: `${startDate} ${startTime}:00`,
        endDate: `${endDate} ${endTime}:00`,
        checkedIn: checkedIn,
        ...(!formData.id ? { creatorUserId: loggedUserId } : {}),
      });
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
    if (pendingDelete) {
      const { id } = pendingDelete;
      setPendingDelete(undefined);
      setEditingTask(undefined);
      setLoading(true);
      await TaskClientService.deleteProjectTaskById(id);
      setLoaded(false);
    }
  }, [pendingDelete, setPendingDelete]);
  const handleAddTask = useCallback(
    (startDate: string) => {
      if (!loggedUser || !event) return;
      if (
        !(
          isAnyManager || event.departmentId === loggedUser.employeeDepartmentId
        )
      )
        return;
      setEditingTask({
        ...new ProjectTask().toObject(),
        startDate,
        endDate: startDate,
        startTime: '09:00',
        endTime: '10:00',
        statusId: 1,
        priorityId: 2,
      });
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
    async (formData: EventType) => {
      if (event) {
        if (
          formData.dateEnded.substr(0, 10) < formData.dateStarted.substr(0, 10)
        ) {
          setErrorProject('Start Date cannot be after End date.');
          return;
        }
        if (
          tasks.some(
            ({ startDate }) =>
              startDate.substr(0, 10) < formData.dateStarted.substr(0, 10),
          )
        ) {
          setErrorProject(
            'Some existing tasks are already defined before new project Start Date.',
          );
          return;
        }
        if (
          tasks.some(
            ({ endDate }) =>
              endDate.substr(0, 10) > formData.dateEnded.substr(0, 10),
          )
        ) {
          setErrorProject(
            'Some existing tasks are already defined after new project End Date.',
          );
          return;
        }
        setEditingProject(false);
        setLoadingEvent(true);
        await upsertEvent({ ...formData, id: event.id });
        loadEvent();
      }
    },
    [
      event,
      loadEvent,
      setEditingProject,
      setLoadingEvent,
      tasks,
      setErrorProject,
    ],
  );

  const loadPrintData = useCallback(async () => {
    const { resultsList } = await PerDiemClientService.loadPerDiemsByEventId(
      serviceCallId,
    );
    const lodgings = await loadPerDiemsLodging(resultsList); // first # is per diem id
    setLodgings(lodgings);
    const transactions = await loadTransactionsByEventId(serviceCallId);
    setTransactions(transactions);
    setPerDiems(resultsList);
  }, [serviceCallId, setPerDiems, setLodgings]);
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadPrintData();
    setPrintStatus('loaded');
  }, [setPrintStatus, loadPrintData, serviceCallId]);
  const handlePrinted = useCallback(() => setPrintStatus('idle'), [
    setPrintStatus,
  ]);
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
        name: 'id',
        type: 'hidden',
      },
    ],
    [
      {
        name: 'externalId',
        label: 'Assigned Employee',
        type: 'technician',
        disabled: !hasEditRights,
        technicianAsEmployee: true,
      },
    ],
    [
      {
        name: 'briefDescription',
        label: 'Brief Description',
        multiline: true,
        required: !hasEditRights,
        disabled: !isOwner,
      },
    ],
    [
      {
        name: 'startDate',
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
        name: 'endDate',
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
        name: 'statusId',
        label: 'Status',
        required: true,
        options: statusOptions,
        disabled: !isOwner,
      },
    ],
    [
      {
        name: 'priorityId',
        label: 'Priority',
        required: true,
        options: priorityOptions,
        disabled: !isOwner,
      },
    ],
  ];
  const filteredTasks = tasks.filter(
    ({ statusId, priorityId, externalCode, externalId }) => {
      if (search.statusId) {
        if (statusId !== search.statusId) return false;
      }
      if (search.priorityId) {
        if (priorityId !== search.priorityId) return false;
      }
      if (search.technicians) {
        if (
          externalCode === 'project' ||
          (externalCode === 'user' &&
            !search.technicians
              .split(',')
              .map(id => +id)
              .includes(externalId))
        )
          return false;
      }
      return true;
    },
  );
  const totalMeals =
    perDiems.reduce((aggr, { rowsList }) => aggr + rowsList.length, 0) *
    MEALS_RATE;
  const totalLodging = perDiems
    .reduce(
      (aggr, { rowsList }) => [...aggr, ...rowsList],
      [] as PerDiemRowType[],
    )
    .filter(({ mealsOnly }) => !mealsOnly)
    .reduce((aggr, { id }) => aggr + lodgings[id], 0);
  const totalTransactions = transactions.reduce(
    (aggr, { amount }) => aggr + amount,
    0,
  );
  return (
    <div>
      <SectionBar
        title="Project Management"
        footer={
          event && !loadingEvent ? (
            <>
              <div>Address: {getPropertyAddress(event.property)}</div>
              <div>Start date: {formatDate(event.dateStarted)}</div>
              <div>End date: {formatDate(event.dateEnded)}</div>
              <div>Job Number: {event.logJobNumber}</div>
              <div>Description: {event.description}</div>
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
            onClick: handleSetEditing({
              ...new ProjectTask().toObject(),
              startDate: event ? event.dateStarted.substr(0, 10) : '',
              endDate: event ? event.dateStarted.substr(0, 10) : '',
              startTime: '09:00',
              endTime: '10:00',
              statusId: 1,
              priorityId: 2,
            }),
            disabled:
              loading ||
              loadingEvent ||
              !event ||
              !loggedUser ||
              !(
                isAnyManager ||
                event.departmentId === loggedUser.employeeDepartmentId
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
          <PrintPage
            buttonProps={{
              label: 'Print Cost Report',
              disabled: loading || loadingEvent || printStatus === 'loading',
            }}
            downloadLabel="Download Cost Report"
            downloadPdfFilename="Cost-Report"
            headerProps={{ title: 'Project Cost Report' }}
            onPrint={handlePrint}
            onPrinted={handlePrinted}
            status={printStatus}
            key={printStatus}
            className="EditProjectAsideContent"
          >
            <PrintParagraph tag="h2">Project Details</PrintParagraph>
            {event && (
              <PrintList
                items={[
                  <>
                    <strong>Address: </strong>
                    {getPropertyAddress(event.property)}
                  </>,
                  <>
                    <strong>Start Date: </strong>
                    {formatDate(event.dateStarted)}
                  </>,
                  <>
                    <strong>End Date: </strong>
                    {formatDate(event.dateEnded)}
                  </>,
                  <>
                    <strong>Job Number: </strong>
                    {event.logJobNumber}
                  </>,
                ]}
              />
            )}
            <PrintParagraph tag="h2">Summary Info</PrintParagraph>
            <PrintTable
              columns={[
                { title: 'Type', align: 'left' },
                { title: 'Total', align: 'right' },
              ]}
              data={[
                [
                  'Total Hours Worked',
                  totalHoursWorked > 1
                    ? `${totalHoursWorked} hrs`
                    : totalHoursWorked == 0
                    ? 'None'
                    : `${totalHoursWorked} hr`,
                ],
              ]}
            />
            <PrintParagraph tag="h2">Costs</PrintParagraph>
            <PrintTable
              columns={[
                { title: 'Type', align: 'left' },
                { title: 'Cost', align: 'right' },
              ]}
              data={[
                ['Transactions', usd(totalTransactions)],
                ['Meals', usd(totalMeals)],
                ['Lodging', usd(totalLodging)],
                [
                  '',
                  <strong>
                    TOTAL: {usd(totalMeals + totalLodging + totalTransactions)}
                  </strong>,
                ],
              ]}
            />
            <PrintParagraph tag="h2">Transactions</PrintParagraph>
            <PrintTable
              columns={[
                {
                  title: 'Department',
                  align: 'left',
                },
                {
                  title: 'Owner',
                  align: 'left',
                  widthPercentage: 10,
                },
                {
                  title: 'Cost Center / Vendor',
                  align: 'left',
                  widthPercentage: 10,
                },
                {
                  title: 'Date',
                  align: 'left',
                  widthPercentage: 10,
                },
                {
                  title: 'Amount',
                  align: 'left',
                  widthPercentage: 10,
                },
                {
                  title: 'Notes',
                  align: 'right',
                  widthPercentage: 20,
                },
              ]}
              data={transactions.map(
                ({
                  department,
                  ownerName,
                  amount,
                  notes,
                  costCenter,
                  timestamp,
                  vendor,
                }) => {
                  return [
                    department ? (
                      <>
                        {department.classification} - {department.description}
                      </>
                    ) : (
                      '-'
                    ),
                    ownerName,
                    <>
                      {`${costCenter?.description}` + ' - '}
                      <br />
                      {vendor}
                    </>,
                    formatDate(timestamp),
                    usd(amount),
                    notes,
                  ];
                },
              )}
            />
            <PrintParagraph tag="h2">Per Diem</PrintParagraph>
            {perDiems
              .sort((a, b) => (a.dateSubmitted > b.dateSubmitted ? -1 : 1))
              .map(
                ({
                  id,
                  department,
                  ownerName,
                  dateSubmitted,
                  approvedByName,
                  dateApproved,
                  notes,
                  rowsList,
                }) => {
                  const totalMeals = MEALS_RATE * rowsList.length;
                  const totalLodging = rowsList.reduce(
                    (aggr, { id, mealsOnly }) =>
                      aggr + (mealsOnly ? 0 : lodgings[id]),
                    0,
                  );
                  if (totalMeals == 0 && totalLodging == 0) {
                    return <></>; // Don't show it
                  }
                  return (
                    <div key={id}>
                      <PrintParagraph tag="h3">
                        Per Diem{' '}
                        {dateSubmitted.split(' ')[0] != NULL_TIME.split(' ')[0]
                          ? '-'
                          : ''}{' '}
                        {dateSubmitted.split(' ')[0] != NULL_TIME.split(' ')[0]
                          ? dateSubmitted.split(' ')[0]
                          : ''}{' '}
                        {ownerName ? '-' : ''} {ownerName}
                      </PrintParagraph>
                      <div
                        style={{
                          breakInside: 'avoid',
                          display: 'inline-block',
                          width: '100%',
                        }}
                      >
                        <PrintTable
                          columns={[
                            {
                              title: 'Department',
                              align: 'left',
                            },
                            {
                              title: 'Owner',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Submitted At',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Approved By',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Approved At',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Total Meals',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Total Lodging',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Notes',
                              align: 'right',
                              widthPercentage: 20,
                            },
                          ]}
                          data={[
                            [
                              getDepartmentName(department),
                              ownerName,
                              dateSubmitted != NULL_TIME
                                ? formatDate(dateSubmitted)
                                : '-' || '-',
                              approvedByName || '-',
                              dateApproved != NULL_TIME
                                ? formatDate(dateApproved)
                                : '-' || '-',
                              usd(totalMeals),
                              totalLodging != 0 ? usd(totalLodging) : '-',
                              notes,
                            ],
                          ]}
                        />
                      </div>
                      <PrintParagraph tag="h4">Per Diem Days</PrintParagraph>
                      <div
                        style={{
                          breakInside: 'avoid',
                          display: 'inline-block',
                          width: '100%',
                        }}
                      >
                        <PrintTable
                          columns={[
                            {
                              title: 'Date',
                              align: 'left',
                            },
                            {
                              title: 'Zip Code',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Meals Only',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Meals',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Lodging',
                              align: 'left',
                              widthPercentage: 10,
                            },
                            {
                              title: 'Notes',
                              align: 'right',
                              widthPercentage: 20,
                            },
                          ]}
                          data={rowsList.map(
                            ({
                              id,
                              dateString,
                              zipCode,
                              mealsOnly,
                              notes,
                              perDiemId,
                            }) => {
                              return [
                                formatDate(dateString),
                                zipCode,
                                mealsOnly ? 'Yes' : 'No',
                                usd(MEALS_RATE),
                                lodgings[id] ? usd(lodgings[id]) : '-',
                                notes,
                              ];
                            },
                          )}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            <PrintParagraph tag="h2">Timesheet Lines</PrintParagraph>
            {timesheets.map(
              ({
                id,
                departmentName,
                timeStarted,
                timeFinished,
                adminApprovalUserName,
                notes,
                briefDescription,
                technicianUserName,
                technicianUserId,
                hoursWorked,
              }) => {
                return (
                  <div key={id}>
                    <PrintTable
                      columns={[
                        {
                          title: 'Technician',
                          align: 'left',
                        },
                        {
                          title: 'Department',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Approved By',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Time Started',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Time Finished',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Brief Description',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Hours Worked',
                          align: 'left',
                          widthPercentage: 10,
                        },
                        {
                          title: 'Notes',
                          align: 'right',
                          widthPercentage: 20,
                        },
                      ]}
                      data={[
                        [
                          technicianUserName + ` (${technicianUserId})`,
                          departmentName,
                          adminApprovalUserName,
                          formatDate(timeStarted) || '-',
                          formatDate(timeFinished) || '-',
                          briefDescription,
                          hoursWorked != 0
                            ? hoursWorked > 1
                              ? `${hoursWorked} hrs`
                              : `${hoursWorked} hr`
                            : '-',
                          notes,
                        ],
                      ]}
                    />
                  </div>
                );
              },
            )}
          </PrintPage>
        }
        asideContentFirst
        sticky={false}
      />
      <PlainForm
        schema={SCHEMA_SEARCH}
        data={search}
        onChange={setSearch}
        disabled={loading || loadingEvent}
      />
      <Button
        variant="outlined"
        label={!checkedInTask ? `Check In` : `Check Out`}
        onClick={() => {
          // Need to save state that it's checked in, maybe make a call to check if it's an auto generated task in the table and then
          // if there is then use that result to set it as checked in
          if (!checkedInTask) {
            const date = new Date();
            let taskNew = {
              startDate: format(new Date(date), 'yyyy-MM-dd HH-mm-ss'),
              endDate: '',
              statusId: 2,
              priorityId: 2,
              startTime: format(new Date(date), 'HH-mm'),
              endTime: format(addDays(new Date(date), 1), 'HH-mm'),
              briefDescription: briefDescription
                ? briefDescription
                : 'Auto generated task',
              externalId: loggedUserId,
              checkedIn: true,
            } as ExtendedProjectTaskType;

            alert('upserting task - see details in console log');
            console.log('TASK CHECKED IN:', taskNew);

            handleSaveTask(taskNew);
            setCheckedInTask(taskNew);
          } else {
            console.log('Would have checked out');
          }
        }}
        disabled={pendingCheckoutChange}
      />
      {!checkedInTask && (
        <Field
          name="Brief Description for Check-in"
          onChange={changedText => {
            handleBriefDescriptionChange(changedText.toString());
          }}
          type="text"
          value={briefDescription}
        />
      )}
      <Tabs
        defaultOpenIdx={0}
        tabs={[
          {
            label: 'Calendar',
            content: event ? (
              <CalendarEvents
                events={filteredTasks.map(task => {
                  if (task.endDate == '0000-00-00 00:00:00') {
                    let date = new Date();
                    date.setMinutes(date.getMinutes() + 1);
                    task.endDate = format(date, 'yyyy-MM-dd hh-mm-ss');
                  }
                  const {
                    id,
                    briefDescription,
                    startDate: dateStart,
                    endDate: dateEnd,
                    statusId,
                    priorityId,
                    ownerName,
                    creatorUserId,
                  } = task;
                  const [startDate, startHour] = dateStart.split(' ');
                  const [endDate, endHour] = dateEnd.split(' ');
                  return {
                    id,
                    startDate,
                    endDate,
                    startHour,
                    endHour,
                    notes: briefDescription,
                    status: statuses.find(({ id }) => id === statusId)
                      ?.description,
                    statusColor: PROJECT_TASK_STATUS_COLORS[statusId],
                    priority: priorities.find(({ id }) => id === priorityId)
                      ?.description,
                    priorityId,
                    assignee: ownerName,
                    onClick:
                      creatorUserId === loggedUserId || hasEditRights
                        ? handleSetEditing({
                            ...task,
                            startDate,
                            endDate,
                            startTime: startHour.substr(0, 5),
                            endTime: endHour.substr(0, 5),
                          })
                        : undefined,
                  };
                })}
                startDate={event.dateStarted.substr(0, 10)}
                endDate={event.dateEnded.substr(0, 10)}
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
                  // This one is in-progress
                  if (
                    task.endDate == '2009-00-00 00:00:00' &&
                    task.statusId == 2
                  ) {
                  }
                  const {
                    id,
                    briefDescription,
                    startDate: dateStart,
                    endDate: dateEnd,
                    statusId,
                    priorityId,
                    ownerName,
                    creatorUserId,
                  } = task;
                  const [startDate, startHour] = dateStart.split(' ');
                  const [endDate, endHour] = dateEnd.split(' ');
                  return {
                    id,
                    startDate,
                    endDate,
                    startHour,
                    endHour,
                    notes: briefDescription,
                    status: statuses.find(({ id }) => id === statusId)
                      ?.description,
                    statusColor: PROJECT_TASK_STATUS_COLORS[statusId],
                    priority: priorities.find(({ id }) => id === priorityId)
                      ?.description,
                    priorityId,
                    assignee: ownerName,
                    onClick:
                      creatorUserId === loggedUserId || hasEditRights
                        ? handleSetEditing({
                            ...task,
                            startDate,
                            endDate,
                            startTime: startHour.substr(0, 5),
                            endTime: endHour.substr(0, 5),
                          })
                        : undefined,
                  };
                })}
                startDate={event.dateStarted.substr(0, 10)}
                endDate={event.dateEnded.substr(0, 10)}
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
                    const {
                      id,
                      description,
                      dateStarted: dateStart,
                      dateEnded: dateEnd,
                      logJobStatus,
                      color,
                    } = task;
                    const [startDate, startHour] = dateStart.split(' ');
                    const [endDate, endHour] = dateEnd.split(' ');
                    return {
                      id,
                      startDate,
                      endDate,
                      startHour,
                      endHour,
                      notes: description,
                      statusColor: '#' + color,
                      onClick: () => {
                        setServiceCallId(id);
                        setLoaded(false);
                        setLoadedInit(false);
                        // load();
                      },
                    };
                  })}
                  startDate={projects[0].dateStarted.substr(0, 10)}
                  endDate={projects[projects.length - 1].dateEnded.substr(
                    0,
                    10,
                  )}
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
            onSave={handleSaveTask}
            title={`${editingTask.id ? 'Edit' : 'Add'} Task`}
            error={errorTask}
          >
            <div className="EditProjectDelete">
              {taskEventsLoaded && !isAnyManager && (
                <>
                  <Button
                    variant="outlined"
                    label={
                      taskEvents.length === 0 ||
                      (taskEvents[0] && taskEvents[0].actionTaken === CHECKOUT)
                        ? 'Enroute'
                        : `Check ${
                            taskEvents.length > 0 &&
                            taskEvents[0].actionTaken === CHECKIN
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
                      label={`Delete ${taskEvents[0].actionTaken}`}
                      onClick={handleSetPendingCheckoutDelete(true)}
                      disabled={pendingCheckoutChange}
                    />
                  )}
                </>
              )}
              {editingTask.id > 0 &&
                editingTask.creatorUserId === loggedUserId && (
                  <Button
                    variant="outlined"
                    label="Delete Task"
                    onClick={handleSetPendingDelete(editingTask)}
                  />
                )}
            </div>
          </Form>
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDelete
          open
          kind="Task"
          name={pendingDelete.briefDescription}
          onClose={handleSetPendingDelete()}
          onConfirm={handleDeleteTask}
        />
      )}
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
            (taskEvents[0] && taskEvents[0].actionTaken === CHECKOUT)
              ? 'Confirm Enroute'
              : `Confirm Check ${
                  taskEvents.length > 0 && taskEvents[0].actionTaken === CHECKIN
                    ? 'Out'
                    : 'In'
                }`
          }
          onClose={handleSetPendingCheckout(false)}
          onConfirm={handleCheckout}
        >
          {taskEvents.length === 0 ||
          (taskEvents[0] && taskEvents[0].actionTaken === CHECKOUT) ? (
            <div>
              Are you sure you want to Enroute and assign yourself to this task?
            </div>
          ) : taskEvents.length > 0 && taskEvents[0].actionTaken === CHECKIN ? (
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
          name={taskEvents[0].actionTaken}
          onClose={handleSetPendingCheckoutDelete(false)}
          onConfirm={handleCheckoutDelete}
        />
      )}
    </div>
  );
};
