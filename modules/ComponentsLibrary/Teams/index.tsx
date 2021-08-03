import React, { FC, useCallback, useEffect, useState } from 'react';
import { InfoTable } from '../InfoTable';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { CreateNewTeam } from './components/CreateNewTeam';

interface Props {}

export const Teams: FC<Props> = () => {
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState<boolean>();

  const handleSetCreateTeamModalOpen = useCallback(
    (isOpen: boolean) => setCreateTeamModalOpen(isOpen),
    [setCreateTeamModalOpen],
  );

  const load = useCallback(() => {}, []);
  useEffect(() => load(), [load]);
  return (
    <>
      {createTeamModalOpen && (
        <Modal open={true} onClose={() => handleSetCreateTeamModalOpen(false)}>
          <CreateNewTeam onClose={() => handleSetCreateTeamModalOpen(false)} />
        </Modal>
      )}
      <SectionBar
        title="Teams"
        actions={[
          {
            label: 'Create New Team',
            onClick: () => handleSetCreateTeamModalOpen(true),
          },
        ]}
      />
      <InfoTable columns={[{ name: 'Team Name' }, { name: 'Team Admins' }]} />
    </>
  );
};
