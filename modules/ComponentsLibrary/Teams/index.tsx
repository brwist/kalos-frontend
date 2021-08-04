import React, { FC, useCallback, useEffect, useState } from 'react';
import { InfoTable } from '../InfoTable';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { CreateNewTeam } from './components/CreateNewTeam';
import { Team } from '@kalos-core/kalos-rpc/Team';
import { TeamClientService } from '../../../helpers';
import { Loader } from '../../Loader/main';

interface Props {}

export const Teams: FC<Props> = () => {
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const [teams, setTeams] = useState<Team[]>([]);

  const handleSetCreateTeamModalOpen = useCallback(
    (isOpen: boolean) => setCreateTeamModalOpen(isOpen),
    [setCreateTeamModalOpen],
  );

  const load = useCallback(async () => {
    let teams: Team[] = [];
    try {
      let req = new Team();
      teams = (await TeamClientService.BatchGet(req)).getResultsList();
    } catch (err) {
      console.error(`An error occurred while batch-getting teams: ${err}`);
      // TODO implement better logging here for errors
    }
    console.log('Teams gotten: ', teams);
    setTeams(teams);
    setLoading(false);
  }, [setTeams, setLoading]);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <>
      {loading && <Loader />}
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
