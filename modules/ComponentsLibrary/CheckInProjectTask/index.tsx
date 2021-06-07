import { addDays, format } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button } from '../Button';
import { Field as FieldComponent } from '../Field';
import { ExtendedProjectTaskType } from '../EditProject';
import {
  ActivityLogClientService,
  EventType,
  makeFakeRows,
  TaskClientService,
} from '../../../helpers';
import { Task } from '@kalos-core/kalos-rpc/Task';
import { Data, InfoTable } from '../InfoTable';
import { IconButton, Typography } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Tooltip } from '../Tooltip';
import { Modal } from '../Modal';
import { EnhancedField } from '../Field/examples';
import { Alert } from '../Alert';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
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

  const batchGetCheckedTasks = useCallback(async () => {
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
  }, [loggedUserId]);

  const handleSetCheckInWarningBoxOpen = useCallback(
    (isOpen: boolean) => {
      setCheckInWarningBoxOpen(isOpen);
    },
    [setCheckInWarningBoxOpen],
  );

  const handleSaveTask = useCallback(
    async (
      {
        startDate,
        startTime,
        endDate,
        endTime,
        checkedIn,
        ...formData
      }: ExtendedProjectTaskType,
      typeOfTask: 'check-in' | 'check-out',
    ) => {
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
      try {
        await TaskClientService.upsertEventTask({
          ...formData,
          eventId: serviceCallId,
          startDate: `${startDate} ${startTime}`,
          endDate: `${endDate} ${endTime}`,
          checkedIn: checkedIn,
          ...(!formData.id ? { creatorUserId: loggedUserId } : {}),
        });
        try {
          let req = new ActivityLog();
          req.setUserId(loggedUserId);
          req.setActivityName(
            `Created task for project ${serviceCallId} (${typeOfTask})`,
          );
          req.setActivityDate(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          req.setEventId(serviceCallId);
          await ActivityLogClientService.Create(req);
        } catch (err) {
          console.error(
            `An error occurred while attempting to create a log: ${err}`,
          );
        }
      } catch (err) {
        console.error(
          `An error occurred while attempting to upsert an task: ${err}`,
        );
      }
      await batchGetCheckedTasks();
      setLoaded(false);
    },
    [
      projectToUse,
      serviceCallId,
      loggedUserId,
      batchGetCheckedTasks,
      handleSetCheckInWarningBoxOpen,
    ],
  );

  const load = useCallback(async () => {
    await batchGetCheckedTasks();
  }, [batchGetCheckedTasks]);

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
    let updateTask = {
      ...checkedInTask,
      id: checkedInTask.id,
      startDate: checkedInTask.startDate,
      startTime: checkedInTask.startTime,
      endDate: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      endTime: format(new Date(), 'HH-mm'),
      checkedIn: false,
      externalId: loggedUserId,
    };
    handleSaveTask(updateTask, 'check-out');
  };

  const checkInNewTask = () => {
    let taskNew = {
      startDate: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      endDate: '',
      statusId: 2,
      priorityId: 2,
      startTime: format(new Date(), 'hh:mm:ss'),
      endTime: format(addDays(new Date(), 1), 'hh:mm:ss'),
      briefDescription: briefDescription
        ? briefDescription
        : 'Auto generated task',
      externalId: loggedUserId,
      checkedIn: true,
    } as ExtendedProjectTaskType;
    handleSaveTask(taskNew, 'check-in');
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
