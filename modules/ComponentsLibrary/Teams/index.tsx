import React, { FC, useCallback, useState } from 'react';
import { Modal } from '../Modal';
import { RoleType } from '../Payroll';
import { SectionBar } from '../SectionBar';
import { AddTeam } from './components/AddTeam';

export interface Props {
  loggedUserId: number;
}

export const Teams: FC<Props> = () => {
  const [newTeamModalOpen, setNewTeamModalOpen] = useState<boolean>();

  const handleSetNewTeamModalOpen = useCallback(
    (isOpen: boolean) => setNewTeamModalOpen(isOpen),
    [setNewTeamModalOpen],
  );

  return (
    <>
      {newTeamModalOpen && (
        <Modal open onClose={() => handleSetNewTeamModalOpen(false)}>
          <AddTeam />
        </Modal>
      )}
      <SectionBar
        title="Team Management"
        actions={[
          {
            label: 'Create New Team',
            onClick: () => handleSetNewTeamModalOpen(true),
          },
        ]}
        fixedActions
      />
    </>
  );
};
