import { addDays, format } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button } from '../Button';
import { Field as FieldComponent } from '../Field';
import { ExtendedProjectTaskType } from '../EditProject';
import { makeFakeRows, TaskClientService } from '../../../helpers';
import { ProjectTask, Task } from '@kalos-core/kalos-rpc/Task';
import { Data, InfoTable } from '../InfoTable';
import { IconButton, Typography } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Tooltip } from '../Tooltip';
import { Modal } from '../Modal';
import { EnhancedField } from '../Field/examples';
import { Alert } from '../Alert';
import { EventType } from '../ProjectDetail';
import { Event } from '@kalos-core/kalos-rpc/Event/index';
interface Props {
  projectToUse: Event;
  loggedUserId: number;
  serviceCallId: number;
}

export const CheckInProjectTask: FC<Props> = ({
  projectToUse,
  loggedUserId,
  serviceCallId,
}) => {
  console.log('project:', projectToUse);
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
      console.error(
        `An error occurred while batch-getting the checked task: `,
        err,
      );
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
    async (formData: ExtendedProjectTaskType) => {
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      if (projectToUse.getDateEnded() < currentDate) {
        console.error(
          'Cannot save to the Project - the End Date has already passed.',
        );
        handleSetCheckInWarningBoxOpen(true);
        return;
      }
      if (!projectToUse) return;
      if (
        formData.projectTask.getStartDate() >
          formData.projectTask.getEndDate() &&
        formData.projectTask.getEndDate() != ''
      ) {
        console.error('Start Date cannot be after End Date.');
        return;
      }
      if (
        projectToUse.getDateStarted().substr(0, 10) >
        formData.projectTask.getStartDate()
      ) {
        console.error(
          "Task's Start Date cannot be before Project's Start Date.",
        );
        return;
      }
      if (
        projectToUse.getDateEnded().substr(0, 10) <
        formData.projectTask.getEndDate()
      ) {
        console.error(
          "Task's End Date was after the Project's End Date, setting the Task's End Date as the Project's End Date.",
        );
        // Auto set the task end date to be the project end date
        formData.projectTask.setEndDate(
          projectToUse.getDateEnded().substr(0, 10),
        );
        formData.endTime = projectToUse.getTimeEnded();
      }

      let req = new ProjectTask();
      req.setEventId(formData.projectTask.getEventId());
      req.setStartDate(
        `${formData.projectTask.getStartDate()} ${formData.startTime}:00`,
      );
      req.setEndDate(
        `${formData.projectTask.getEndDate()} ${formData.endTime}:00`,
      );
      req.setCheckedIn(formData.projectTask.getCheckedIn());
      req.setFieldMaskList([
        'Id',
        'StartDate',
        'EndDate',
        'CheckedIn',
        'CreatorUserId',
      ]);
      req.setPriorityId(3);
      if (!formData.projectTask.getId()) req.setCreatorUserId(loggedUserId);

      await TaskClientService.upsertEventTask(req);
      await batchGetCheckedTasks();
      setLoaded(false);
    },
    [
      projectToUse,
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
                  onClick={() => {
                    let projectTask = { ...task } as ProjectTask;
                    projectTask.setStartDate(
                      task.getHourlyStart().split(' ')[0],
                    );
                    projectTask.setEndDate(
                      format(new Date(date), 'yyyy-MM-dd HH:mm:ss'),
                    );
                    projectTask.setId(task.getId());
                    projectTask.setCheckedIn(false);

                    checkOut({
                      ...projectTask,
                      startTime: task.getHourlyStart().split(' ')[1],
                      endTime: format(new Date(date), 'HH-mm'),
                    } as ExtendedProjectTaskType);
                  }}
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

    checkedInTask.projectTask.setId(checkedInTask.projectTask.getId());
    checkedInTask.projectTask.setEndDate(
      format(new Date(date), 'yyyy-MM-dd HH:mm:ss'),
    );
    checkedInTask.projectTask.setCheckedIn(false);
    checkedInTask.projectTask.setExternalId(loggedUserId);

    let updateTask = {
      projectTask: checkedInTask.projectTask,
      startTime: checkedInTask.startTime,
      endTime: format(new Date(date), 'HH-mm'),
    } as ExtendedProjectTaskType;

    handleSaveTask(updateTask);
  };

  const checkInNewTask = () => {
    // Need to save state that it's checked in, maybe make a call to check if it's an auto generated task in the table and then
    // if there is then use that result to set it as checked in
    const date = new Date();
    let projectTask = new ProjectTask();
    projectTask.setStartDate(format(new Date(date), 'yyyy-MM-dd HH-mm-ss'));
    projectTask.setEndDate('');
    projectTask.setStatusId(2);
    projectTask.setPriorityId(2);
    projectTask.setBriefDescription(
      briefDescription ? briefDescription : 'Auto generated task',
    );
    projectTask.setExternalId(loggedUserId);
    projectTask.setCheckedIn(true);
    let taskNew = {
      projectTask,
      startTime: format(new Date(date), 'HH-mm'),
      endTime: format(addDays(new Date(date), 1), 'HH-mm'),
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
                    let projectTask = { ...task } as ProjectTask;
                    projectTask.setStartDate(
                      task.getHourlyStart().split(' ')[0],
                    );
                    projectTask.setEndDate(
                      format(new Date(date), 'yyyy-MM-dd HH:mm:ss'),
                    );
                    projectTask.setId(task.getId());
                    projectTask.setCheckedIn(false);

                    checkOut({
                      ...projectTask,
                      startTime: task.getHourlyStart().split(' ')[1],
                      endTime: format(new Date(date), 'HH-mm'),
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
