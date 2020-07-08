import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
      await upsertEventTask({
        ...formData,
        eventId: serviceCallId,
        creatorUserId: loggedUserId,
        startDate: `${startDate} ${startTime}:00`,
        endDate: `${endDate} ${endTime}:00`,
      });
      setLoaded(false);
    },
    [serviceCallId, loggedUserId, setLoaded],
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
        actions: [
          {
            label: 'Search',
            disabled: loading,
          },
        ],
      },
    ],
  ];
  const SCHEMA: Schema<ExtendedProjectTaskType> = [
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
        events={tasks.map(
          ({
            briefDescription,
            startDate: dateStart,
            endDate: dateEnd,
            statusId,
            priorityId,
          }) => {
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
            };
          },
        )}
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
