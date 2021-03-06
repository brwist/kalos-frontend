import React, { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { InfoTable } from '../InfoTable';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { CreateNewTeam } from './components/CreateNewTeam';
import { Team } from '../../../@kalos-core/kalos-rpc/Team';
import { TeamClientService } from '../../../helpers';
import { Loader } from '../../Loader/main';
import { Reducer } from './reducer';

interface Props {}

export type State = {
  createTeamModalOpen: boolean;
  loading: boolean;
  teams: Team[];
};

export enum ACTIONS {
  SET_TEAMS = 'set-teams',
  SET_CREATE_TEAM_MODEL_OPEN = 'set-create-team-model-open',
  SET_LOADING = 'set-loading',
}

export type Action =
  | {
      type: ACTIONS.SET_TEAMS;
      payload: Team[];
    }
  | {
      type: ACTIONS.SET_CREATE_TEAM_MODEL_OPEN;
      payload: boolean;
    }
  | {
      type: ACTIONS.SET_LOADING;
      payload: boolean;
    };

const initialState: State = {
  createTeamModalOpen: false,
  loading: true,
  teams: [] as Team[],
};

export const Teams: FC<Props> = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const handleSetCreateTeamModalOpen = useCallback(
    (isOpen: boolean) =>
      dispatch({ type: ACTIONS.SET_CREATE_TEAM_MODEL_OPEN, payload: isOpen }),
    [dispatch],
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
    dispatch({
      type: ACTIONS.SET_TEAMS,
      payload: teams,
    });
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false,
    });
  }, [dispatch]);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <>
      {state.loading && <Loader />}
      {state.createTeamModalOpen && (
        <Modal open={true} onClose={() => handleSetCreateTeamModalOpen(false)}>
          <CreateNewTeam
            onClose={() => handleSetCreateTeamModalOpen(false)}
            onSave={() => handleSetCreateTeamModalOpen(false)}
          />
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
