import { getDepartmentName } from '@kalos-core/kalos-rpc/Common';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { format } from 'date-fns';
import React, { FC, forwardRef } from 'react';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Data, InfoTable } from '../../InfoTable';

interface Props {
  project: Event;
  projectDepartment: TimesheetDepartment;
}

export const General: FC<Props> = forwardRef(
  ({ project, projectDepartment }, ref) => {
    const deptName = getDepartmentName(projectDepartment);
    let data_project: Data | undefined;
    try {
      data_project = [
        [
          { label: 'Id', value: project.getId() },
          { label: 'Name', value: project.getName() },
          {
            label: 'Is Active?',
            value: project.getIsActive() == 1 ? 'True' : 'False',
          },
        ],
        [
          {
            label: 'Notes',
            value: project.getNotes(),
          },
          { label: 'Description', value: project.getDescription() },
        ],
        [
          {
            label: 'Date Started',
            value: format(new Date(project.getDateStarted()), 'yyyy-MM-dd'),
          },
          {
            label: 'Time Started',
            value: format(new Date(project.getDateStarted()), 'hh:mm:ss'),
          },
        ],
        [
          {
            label: 'Date Ended',
            value: format(new Date(project.getDateEnded()), 'yyyy-MM-dd'),
          },
          {
            label: 'Time Ended',
            value: format(new Date(project.getDateEnded()), 'hh:mm:ss'),
          },
        ],
        [
          {
            label: 'Department',
            value: deptName,
          },
          {
            label: 'Property ID',
            value: project.getPropertyId(),
          },
        ],
        [
          {
            label: 'Date Updated',
            value: format(new Date(project.getDateUpdated()), 'yyyy-MM-dd'),
          },
          {
            label: 'Date Created',
            value: format(new Date(project.getDateCreated()), 'yyyy-MM-dd'),
          },
        ],
        [
          {
            label: 'All Day?',
            value: project.getIsAllDay() == 1 ? 'True' : 'False',
          },
          {
            label: 'Is LMPC?',
            value: project.getIsLmpc() == 1 ? 'True' : 'False',
          },
        ],
        [
          {
            label: 'Is Residential?',
            value: project.getIsResidential(),
          },
          {
            label: 'Parent ID',
            value: project.getParentId(),
          },
        ],
      ] as Data;
    } catch (err) {
      console.error(
        `An error occurred while rendering the data for the general tab: ${err}`,
      );
    }

    if (!data_project)
      return (
        <>
          Something went wrong while creating the data for the project. Please
          inform the webtech team.
        </>
      );

    return <InfoTable data={data_project} />;
  },
);
