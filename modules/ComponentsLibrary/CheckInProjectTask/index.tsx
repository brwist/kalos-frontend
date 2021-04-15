import { addDays, format } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button } from '../Button';
import { Field } from '../Field';
import { ExtendedProjectTaskType } from '../EditProject';
import {
  EventType,
  TaskClientService,
  upsertEventTask,
} from '../../../helpers';
import { Task } from '@kalos-core/kalos-rpc/Task';
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
  const [checkedInTask, setCheckedInTask] = useState<ExtendedProjectTaskType>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [briefDescription, setBriefDescription] = useState<string>(
    'Automatically set description',
  ); // sets the checked in task's brief description field

  const handleBriefDescriptionChange = useCallback(
    value => {
      setBriefDescription(value);
    },
    [setBriefDescription],
  );

  const getCheckedTasks = async () => {
    let task = new Task();
    task.setExternalId(loggedUserId);
    task.setCheckedIn(true);
    let checkedTask;
    try {
      checkedTask = await TaskClientService.Get(task);
    } catch (err) {
      console.log({ err });
      if (!err.message.includes('failed to scan to struct')) {
        console.error('Error occurred during ProjectTask query:', err);
      }
    }

    if (checkedTask) {
      setCheckedInTask({
        ...checkedTask,
        startDate: checkedTask.hourlyStart,
        endDate: checkedTask.hourlyEnd,
        startTime: '',
        endTime: '',
      } as ExtendedProjectTaskType);
    }
  };

  const handleSaveTask = useCallback(
    async ({
      startDate,
      startTime,
      endDate,
      endTime,
      checkedIn,
      ...formData
    }: ExtendedProjectTaskType) => {
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
        console.error("Task's End Date cannot be after Project's End Date.");
        return;
      }
      await upsertEventTask({
        ...formData,
        eventId: serviceCallId,
        startDate: `${startDate} ${startTime}:00`,
        endDate: `${endDate} ${endTime}:00`,
        checkedIn: checkedIn,
        ...(!formData.id ? { creatorUserId: loggedUserId } : {}),
      });
      await getCheckedTasks();
      setLoaded(false);
    },
    [serviceCallId, loggedUserId, setLoaded],
  );

  const load = useCallback(async () => {
    await getCheckedTasks();
  }, []);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);

  return (
    <>
      <Button
        variant="outlined"
        label={!checkedInTask ? `Check In` : `Check Out`}
        onClick={() => {
          // Need to save state that it's checked in, maybe make a call to check if it's an auto generated task in the table and then
          // if there is then use that result to set it as checked in
          const date = new Date();
          if (!checkedInTask) {
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
            setCheckedInTask(taskNew);
          } else {
            let updateTask = {
              ...checkedInTask,
              id: checkedInTask.id,
              startDate: checkedInTask.startDate,
              startTime: checkedInTask.startTime,
              endDate: format(new Date(date), 'yyyy-MM-dd HH:mm:ss'),
              endTime: format(new Date(date), 'HH-mm'),
              checkedIn: false,
            };

            handleSaveTask(updateTask);
            setCheckedInTask(undefined);
          }
        }}
      />
      <Field
        name="Brief Description for Check-in"
        onChange={changedText => {
          handleBriefDescriptionChange(changedText.toString());
        }}
        type="text"
        value={briefDescription}
      />
    </>
  );
};
