import React, {
  FC,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core/styles';
import HighestIcon from '@material-ui/icons/Block';
import HighIcon from '@material-ui/icons/ChangeHistory';
import NormalIcon from '@material-ui/icons/RadioButtonUnchecked';
import LowIcon from '@material-ui/icons/Details';
import { ProjectTask } from '@kalos-core/kalos-rpc/Task';
import { SectionBar } from '../SectionBar';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { PlainForm, Option } from '../PlainForm';
import { PrintPage } from '../PrintPage';
import { CalendarEvents } from '../CalendarEvents';
import {
  loadEventById,
  loadProjectTasks,
  EventType,
  ProjectTaskType,
  getPropertyAddress,
  formatDate,
  upsertEventTask,
  loadProjectTaskStatuses,
  loadProjectTaskPriorities,
  TaskStatusType,
  TaskPriorityType,
} from '../../../helpers';
import { PROJECT_TASK_STATUS_COLORS, OPTION_ALL } from '../../../constants';

interface Props {
  serviceCallId: number;
  loggedUserId: number;
}

type SearchType = {
  technicians: string;
  statusId: number;
  priorityId: number;
};

type ExtendedProjectTaskType = ProjectTaskType & {
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

const useStyles = makeStyles(theme => ({}));

export const EditProject: FC<Props> = ({ serviceCallId, loggedUserId }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadedInit, setLoadedInit] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<ExtendedProjectTaskType>();
  const [tasks, setTasks] = useState<ProjectTaskType[]>([]);
  const [statuses, setStatuses] = useState<TaskStatusType[]>([]);
  const [priorities, setPriorities] = useState<TaskPriorityType[]>([]);
  const [search, setSearch] = useState<SearchType>({
    technicians: '',
    statusId: 0,
    priorityId: 0,
  });
  const [event, setEvent] = useState<EventType>();
  const loadInit = useCallback(async () => {
    const event = await loadEventById(serviceCallId);
    const statuses = await loadProjectTaskStatuses();
    const priorities = await loadProjectTaskPriorities();
    setEvent(event);
    setStatuses(statuses);
    setPriorities(priorities);
  }, [setEvent, setStatuses, setPriorities]);
  const load = useCallback(async () => {
    setLoading(true);
    const tasks = await loadProjectTasks(serviceCallId);
    setTasks(tasks);
    setLoading(false);
  }, [setLoading, serviceCallId, setTasks]);
  useEffect(() => {
    if (!loadedInit) {
      setLoadedInit(true);
      loadInit();
    }
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loadedInit, setLoadedInit, loadInit, loaded, setLoaded, load]);
  const handleSetEditing = useCallback(
    (editingTask?: ExtendedProjectTaskType) => () =>
      setEditingTask(editingTask),
    [setEditingTask],
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
      ...formData
    }: ExtendedProjectTaskType) => {
      setEditingTask(undefined);
      setLoading(true);
      await upsertEventTask({
        ...formData,
        eventId: serviceCallId,
        creatorUserId: loggedUserId,
        startDate: `${startDate} ${startTime}:00`,
        endDate: `${endDate} ${endTime}:00`,
      });
      setLoaded(false);
    },
    [serviceCallId, loggedUserId, setLoaded, setEditingTask, setLoading],
  );
  const SCHEMA_SEARCH: Schema<SearchType> = [
    [
      {
        name: 'technicians',
        label: 'Technicians',
        type: 'technicians',
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
        label: 'Employee',
        type: 'technician',
      },
    ],
    [
      {
        name: 'briefDescription',
        label: 'Brief Description',
        multiline: true,
        required: true,
      },
    ],
    [
      {
        name: 'startDate',
        label: 'Start Date',
        type: 'date',
        required: true,
      },
      {
        name: 'startTime',
        label: 'Start Time',
        type: 'time',
        required: true,
      },
    ],
    [
      {
        name: 'endDate',
        label: 'End Date',
        type: 'date',
        required: true,
      },
      {
        name: 'endTime',
        label: 'End Time',
        type: 'time',
        required: true,
      },
    ],
    [
      {
        name: 'statusId',
        label: 'Status',
        required: true,
        options: statusOptions,
      },
    ],
    [
      {
        name: 'priorityId',
        label: 'Priority',
        required: true,
        options: priorityOptions,
      },
    ],
  ];
  const filteredTasks = tasks.filter(({ statusId, priorityId }) => {
    if (search.statusId) {
      if (statusId !== search.statusId) return false;
    }
    if (search.priorityId) {
      if (priorityId !== search.priorityId) return false;
    }
    return true;
  });
  return (
    <div>
      <SectionBar
        title="Project Management"
        footer={
          event ? (
            <>
              <div>Address: {getPropertyAddress(event.property)}</div>
              <div>Start date: {formatDate(event.dateStarted)}</div>
              <div>End date: {formatDate(event.dateEnded)}</div>
              <div>Job Number: {event.logJobNumber}</div>
            </>
          ) : (
            'Loading...'
          )
        }
        actions={[
          {
            label: 'Add Task',
            onClick: handleSetEditing({
              ...new ProjectTask().toObject(),
              startTime: '00:00',
              endTime: '00:00',
              statusId: 1,
              priorityId: 2,
            }),
            disabled: loading,
          },
        ]}
        fixedActions
        asideContent={
          <PrintPage
            buttonProps={{ label: 'Print Cost Report', disabled: loading }}
            downloadLabel="Download Cost Report"
            downloadPdfFilename="Cost-Report"
          >
            ...
          </PrintPage>
        }
        asideContentFirst
        sticky={false}
      />
      <PlainForm
        schema={SCHEMA_SEARCH}
        data={search}
        onChange={setSearch}
        disabled={loading}
      />
      <CalendarEvents
        events={filteredTasks.map(task => {
          const {
            briefDescription,
            startDate: dateStart,
            endDate: dateEnd,
            statusId,
            priorityId,
          } = task;
          const [startDate, startHour] = dateStart.split(' ');
          const [endDate, endHour] = dateEnd.split(' ');
          return {
            startDate,
            endDate,
            startHour,
            endHour,
            notes: briefDescription,
            statusId,
            priorityId,
            onClick: handleSetEditing({
              ...task,
              startDate,
              endDate,
              startTime: startHour.substr(0, 5),
              endTime: endHour.substr(0, 5),
            }),
          };
        })}
        loading={loading}
      />
      {editingTask && (
        <Modal open onClose={handleSetEditing()}>
          <Form
            schema={SCHEMA}
            data={editingTask}
            onClose={handleSetEditing()}
            onSave={handleSaveTask}
            title={`${editingTask.id ? 'Edit' : 'Add'} Task`}
          />
        </Modal>
      )}
    </div>
  );
};
