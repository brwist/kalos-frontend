import React, { FC } from 'react';
import { RoleType } from '../Payroll';
import { SectionBar } from '../SectionBar';

export interface Props {
  loggedUserId: number;
}

export const Teams: FC<Props> = () => {
  return (
    <>
      <SectionBar
        title="Team Management"
        actions={[
          {
            label: 'Create New Team',
            onClick: () => alert('Would create a team'),
          },
        ]}
        fixedActions
      />
    </>
  );
};
