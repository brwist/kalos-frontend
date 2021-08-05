import React, { FC, useCallback, useEffect, useState } from 'react';
import { Form, Schema } from '../../Form';
import { Team } from '@kalos-core/kalos-rpc/Team';
import { Alert } from '../../Alert';
import { makeSafeFormObject, TeamClientService } from '../../../../helpers';

interface Props {
  onClose: () => any;
  onSave: (saved: Team) => any;
}

const SCHEMA_NEW_TEAM: Schema<Team> = [
  [
    {
      name: 'getName',
      label: 'Team Name',
      required: true,
    },
    {
      name: 'getDescription',
      label: 'Description',
      multiline: true,
    },
  ],
  [
    {
      name: 'getColor',
      label: 'Team Color',
      type: 'color',
    },
    {
      name: 'getManagerIds',
      label: 'Managers',
      type: 'technicians',
      required: true,
    },
  ],
]; // TODO just a schema so it opens

export const CreateNewTeam: FC<Props> = ({ onClose, onSave }) => {
  const [team, setTeam] = useState<Team>(new Team()); // TODO
  const [error, setError] = useState<string>('');
  const load = useCallback(() => {}, []);
  const handleSetError = useCallback(
    (newError: string) => setError(newError),
    [setError],
  );
  const handleSaveTeam = useCallback(
    async (team: Team) => {
      if (team.getName() === '' || team.getManagerIds() === '') {
        console.error(
          `User attempted to save team with no name or no manager.`,
        );
        setError('Please add a team name and at least one manager.');
        return;
      }
      try {
        await TeamClientService.Create(team);
        setTeam(new Team());
        onSave(team);
      } catch (err) {
        console.error(`An error occurred while saving a team: ${err}`);
      }
    },
    [setError, onSave],
  );
  useEffect(() => load(), [load]);
  return (
    <>
      {error && (
        <Alert
          title="Error"
          open={error != ''}
          onClose={() => handleSetError('')}
        >
          {error}
        </Alert>
      )}
      <Form
        title="New Team"
        onSave={saved => {
          let safe = makeSafeFormObject(saved, new Team());
          handleSaveTeam(safe);
        }}
        onClose={onClose}
        schema={SCHEMA_NEW_TEAM}
        data={team}
      />
    </>
  );
};
