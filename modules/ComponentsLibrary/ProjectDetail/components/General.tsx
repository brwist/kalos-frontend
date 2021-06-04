import { getDepartmentName } from '@kalos-core/kalos-rpc/Common';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { format } from 'date-fns';
import React, { FC, forwardRef } from 'react';
import { EventType } from '../../../../helpers';
import { Data, InfoTable } from '../../InfoTable';

interface Props {
  project: EventType;
  projectDepartment: TimesheetDepartment.AsObject;
}

export const General: FC<Props> = forwardRef(
  ({ project, projectDepartment }, ref) => {
    const deptName = getDepartmentName(projectDepartment);
    const data_project = [
      [
        { label: 'Id', value: project.id },
        { label: 'Name', value: project.name },
        {
          label: 'Is Active?',
          value: project.isActive == 1 ? 'True' : 'False',
        },
      ],
      [
        {
          label: 'Notes',
          value: project.notes,
        },
        { label: 'Description', value: project.description },
      ],
      [
        {
          label: 'Date Started',
          value: format(new Date(project.dateStarted), 'yyyy-MM-dd'),
        },
        {
          label: 'Time Started',
          value: format(new Date(project.dateStarted), 'hh:mm:ss'),
        },
      ],
      [
        {
          label: 'Date Ended',
          value: format(new Date(project.dateEnded), 'yyyy-MM-dd'),
        },
        {
          label: 'Time Ended',
          value: format(new Date(project.dateEnded), 'hh:mm:ss'),
        },
      ],
      [
        {
          label: 'Department',
          value: deptName,
        },
        {
          label: 'Property ID',
          value: project.propertyId,
        },
      ],
      [
        {
          label: 'Date Updated',
          value: format(new Date(project.dateUpdated), 'yyyy-MM-dd'),
        },
        {
          label: 'Date Created',
          value: format(new Date(project.dateCreated), 'yyyy-MM-dd'),
        },
      ],
      [
        {
          label: 'All Day?',
          value: project.isAllDay == 1 ? 'True' : 'False',
        },
        {
          label: 'Is LMPC?',
          value: project.isLmpc == 1 ? 'True' : 'False',
        },
      ],
      [
        {
          label: 'Is Residential?',
          value: project.isResidential,
        },
        {
          label: 'Parent ID',
          value: project.parentId,
        },
      ],
    ] as Data;

    return <InfoTable data={data_project} />;
  },
);
