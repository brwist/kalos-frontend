import { addDays, format } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button } from '../Button';
import { Field as FieldComponent } from '../Field';
import { ExtendedProjectTaskType } from '../EditProject';
import { EventType, makeFakeRows, TaskClientService } from '../../../helpers';
import { Task } from '@kalos-core/kalos-rpc/Task';
import { Data, InfoTable } from '../InfoTable';
import { IconButton, Typography } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Tooltip } from '../Tooltip';
import { Modal } from '../Modal';
import { EnhancedField } from '../Field/examples';
import { Alert } from '../Alert';
interface Props {
  projectToUse: EventType;
  loggedUserId: number;
  serviceCallId: number;
}

export const CheckInProjectTask: FC<Props> = ({
  projectToUse,
  loggedUserId,
  serviceCallId,
}) => {
  const [checkedInTasks, setCheckedInTasks] = useState<Task[]>();
  const [checkInConfirmationBoxOpen, setCheckInConfirmationBoxOpen] =
    useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [briefDescription, setBriefDescription] = useState<string>(
    'Automatically set description',
  ); // sets the checked in task's brief description field
  const [checkInWarningBoxOpen, setCheckInWarningBoxOpen] = useState<boolean>();

  const handleBriefDescriptionChange = useCallback(
    value => {
      setBriefDescription(value);
    },
    [setBriefDescription],
  );

  const handleSetCheckInConfirmationBoxOpen = useCallback(
    isOpen => setCheckInConfirmationBoxOpen(isOpen),
    [setCheckInConfirmationBoxOpen],
  );

  const batchGetCheckedTasks = async () => {
    let task = new Task();
    task.setExternalId(loggedUserId);
    task.setCheckedIn(true);
    let checkedTask;
    try {
      checkedTask = await TaskClientService.BatchGet(task);
    } catch (err) {
      console.log({ err });
      if (!err.message.includes('failed to scan to struct')) {
        console.error('Error occurred during ProjectTask query:', err);
      }
    }

    if (checkedTask) {
      let arr = [];
      for (const val of checkedTask.getResultsList()) {
        arr.push(val);
      }
      setCheckedInTasks(arr);
    }
  };

  const handleSetCheckInWarningBoxOpen = useCallback(
    (isOpen: boolean) => {
      setCheckInWarningBoxOpen(isOpen);
    },
    [setCheckInWarningBoxOpen],
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
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      if (projectToUse.dateEnded < currentDate) {
        console.error(
          'Cannot save to the Project - the End Date has already passed.',
        );
        handleSetCheckInWarningBoxOpen(true);
        return;
      }
      if (!projectToUse) return;
      if (startDate > endDate && endDate != '') {
        console.error('Start Date cannot be after End Date.');
        return;
      }
      if (projectToUse.dateStarted.substr(0, 10) > startDate) {
        console.error(
          "Task's Start Date cannot be before Project's Start Date.",
        );
        return;
      }
      if (projectToUse.dateEnded.substr(0, 10) < endDate) {
        console.error(
          "Task's End Date was after the Project's End Date, setting the Task's End Date as the Project's End Date.",
        );
        // Auto set the task end date to be the project end date
        endDate = projectToUse.dateEnded.substr(0, 10);
        endTime = projectToUse.timeEnded;
      }
      await TaskClientService.upsertEventTask({
        ...formData,
        eventId: serviceCallId,
        startDate: `${startDate} ${startTime}:00`,
        endDate: `${endDate} ${endTime}:00`,
        checkedIn: checkedIn,
        ...(!formData.id ? { creatorUserId: loggedUserId } : {}),
      });
      await batchGetCheckedTasks();
      setLoaded(false);
    },
    [serviceCallId, loggedUserId, setLoaded],
  );

  const load = useCallback(async () => {
    await batchGetCheckedTasks();
  }, []);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);

  const data: Data = checkedInTasks
    ? checkedInTasks.map(task => {
        const date = new Date();
        return [
          {
            value: task.getId(),
          },
          {
            value: task.getBriefDescription(),
            actions: [
              <Tooltip key={task.getId() + 'tooltip'} content="Check Out">
                <IconButton
                  key={task.getId() + 'delete'}
                  size="small"
                  onClick={() =>
                    checkOut({
                      ...task,
                      id: task.getId(),
                      startDate: task.getHourlyStart().split(' ')[0],
                      startTime: task.getHourlyStart().split(' ')[1],
                      endDate: format(new Date(date), 'yyyy-MM-dd HH:mm:ss'),
                      endTime: format(new Date(date), 'HH-mm'),
                      checkedIn: false,
                    } as ExtendedProjectTaskType)
                  }
                >
                  <AccessTimeIcon />
                </IconButton>
              </Tooltip>,
            ],
          },
        ];
      })
    : makeFakeRows();

  const checkOut = (checkedInTask: ExtendedProjectTaskType) => {
    const date = new Date();

    let updateTask = {
      ...checkedInTask,
      id: checkedInTask.id,
      startDate: checkedInTask.startDate,
      startTime: checkedInTask.startTime,
      endDate: format(new Date(date), 'yyyy-MM-dd HH:mm:ss'),
      endTime: format(new Date(date), 'HH-mm'),
      checkedIn: false,
      externalId: loggedUserId,
    };

    handleSaveTask(updateTask);
  };

  const checkInNewTask = () => {
    // Need to save state that it's checked in, maybe make a call to check if it's an auto generated task in the table and then
    // if there is then use that result to set it as checked in
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

    handleSaveTask(taskNew);
  };

  return (
    <>
      {checkInWarningBoxOpen && (
        <Alert
          open={checkInWarningBoxOpen}
          onClose={() => handleSetCheckInWarningBoxOpen(false)}
          label="Close"
          title="Cannot Create Task"
        >
          <Typography>
            Tasks cannot be created after a project has ended.
          </Typography>
        </Alert>
      )}
      {checkInConfirmationBoxOpen && (
        <Modal
          open={true}
          onClose={() => handleSetCheckInConfirmationBoxOpen(false)}
        >
          <EnhancedField
            label="Name for new task"
            defaultValue="Automatically created task"
            onChange={changedText => {
              handleBriefDescriptionChange(changedText.toString());
            }}
            actions={[
              {
                label: 'Create',
                compact: true,
                onClick: () => {
                  checkInNewTask();
                  handleSetCheckInConfirmationBoxOpen(false);
                },
              },
            ]}
          />
        </Modal>
      )}
      <Button
        variant="outlined"
        label="Check In New Tasks"
        onClick={() => handleSetCheckInConfirmationBoxOpen(true)}
      />
      <InfoTable
        data={data}
        columns={[
          {
            name: 'Task ID',
          },
          {
            name: 'Brief Description',
            actions: [
              {
                label: 'Check All Out',
                compact: true,
                variant: 'outlined',
                onClick: () =>
                  checkedInTasks?.forEach(task => {
                    const date = new Date();
                    checkOut({
                      ...task,
                      id: task.getId(),
                      startDate: task.getHourlyStart().split(' ')[0],
                      startTime: task.getHourlyStart().split(' ')[1],
                      endDate: format(new Date(date), 'yyyy-MM-dd HH:mm:ss'),
                      endTime: format(new Date(date), 'HH-mm'),
                      checkedIn: false,
                    } as ExtendedProjectTaskType);
                  }),
              },
            ],
          },
        ]}
      />
    </>
  );
};
