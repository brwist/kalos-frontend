import React, { FC, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Task } from '@kalos-core/kalos-rpc/Task';
import { SectionBar } from '../SectionBar';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { PlainForm, Option } from '../PlainForm';
import {
  loadEventById,
  loadEventTasks,
  EventType,
  TaskType,
} from '../../../helpers';
import { EVENT_STATUS_LIST, JOB_STATUS_COLORS } from '../../../constants';

const JOB_STATUS_OPTIONS: Option[] = EVENT_STATUS_LIST.map(label => ({
  label,
  value: label,
  color: `#${JOB_STATUS_COLORS[label]}`,
}));

interface Props {
  serviceCallId: number;
}

type SearchType = {
  technicians: string;
  jobStatus: string;
};

const SCHEMA: Schema<TaskType> = [
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
    },
  ],
];

const SCHEMA_SEARCH: Schema<SearchType> = [
  [
    {
      name: 'technicians',
      label: 'Technicians',
      type: 'technicians',
    },
    {
      name: 'jobStatus',
      label: 'Job Status',
      options: JOB_STATUS_OPTIONS,
      actions: [{ label: 'Search' }],
    },
  ],
];

const useStyles = makeStyles(theme => ({}));

export const EditProject: FC<Props> = ({ serviceCallId }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<TaskType>();
  const [search, setSearch] = useState<SearchType>({
    technicians: '',
    jobStatus: '',
  });
  const [event, setEvent] = useState<EventType>();
  const load = useCallback(async () => {
    setLoading(true);
    const event = await loadEventById(serviceCallId);
    setEvent(event);
    const a = await loadEventTasks(serviceCallId); //event.logJobNumber);
    console.log(a);
    setLoading(false);
  }, [setLoading, serviceCallId, setEvent]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  });
  const handleSetEditing = useCallback(
    (editingTask?: TaskType) => () => setEditingTask(editingTask),
    [setEditingTask],
  );
  const handleSaveTask = useCallback((formData: TaskType) => {
    console.log({ formData });
  }, []);
  console.log({ event });
  return (
    <div>
      <SectionBar
        title="Project Management"
        actions={[
          {
            label: 'Add Task',
            onClick: handleSetEditing(new Task().toObject()),
          },
        ]}
        fixedActions
      />
      <PlainForm schema={SCHEMA_SEARCH} data={search} onChange={setSearch} />
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
