import React, { FC, useState, useEffect, useCallback, useReducer } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RevokeIcon from '@material-ui/icons/History';
import RejectIcon from '@material-ui/icons/Block';
import ApproveIcon from '@material-ui/icons/CheckCircleOutline';
import { SectionBar } from '../../SectionBar';
import { reducer, ACTIONS } from './spiffReducer';
import { InfoTable, Columns, Data } from '../../InfoTable';
import {
  SpiffToolLogEdit,
  SpiffActionsList,
  getStatusFormInit,
} from '../../SpiffToolLogEdit';
import { Modal } from '../../Modal';
import { ConfirmDelete } from '../../ConfirmDelete';
import { Tooltip } from '../../Tooltip';
import { EventType } from '../';
import {
  usd,
  formatDate,
  TaskClientService,
  makeFakeRows,
} from '../../../../helpers';
import { ROWS_PER_PAGE } from '../../../../constants';
import { SpiffType, Task } from '../../../../@kalos-core/kalos-rpc/Task';
import { last } from 'lodash';

interface Props {
  serviceItem: EventType;
  loggedUserId: number;
  loggedUserName: string;
  role: string;
}

export const Spiffs: FC<Props> = ({
  serviceItem,
  loggedUserId,
  role,
  loggedUserName,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    loaded: false,
    entries: [],
    page: 0,
    count: 0,
    spiffTypes: {},
    edited: undefined,
    deleting: undefined,
    status: 0,
  });

  const load = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, data: true });

    const spiffTypes = await TaskClientService.loadSpiffTypes();
    dispatch({
      type: ACTIONS.SET_SPIFF_TYPES,
      data: spiffTypes.reduce(
        (aggr, item) => ({ ...aggr, [item.getId()]: item }),
        {},
      ),
    });
    const { resultsList, count } = await TaskClientService.loadSpiffToolLogs({
      page: state.page,
      type: 'Spiff',
      jobNumber: serviceItem.getLogJobNumber(),
    });
    dispatch({ type: ACTIONS.SET_ENTRIES, data: resultsList });
    dispatch({ type: ACTIONS.SET_COUNT, data: count });
    if (state.edited != undefined) {
      dispatch({
        type: ACTIONS.SET_EDITED,
        data: resultsList.find(task => task.getId() === state.edited!.getId()),
      });
    }
    dispatch({ type: ACTIONS.SET_LOADING, data: false });
  }, [state.page, serviceItem, state.edited]);
  useEffect(() => {
    if (!state.loaded) {
      dispatch({ type: ACTIONS.SET_LOADED, data: true });
      load();
    }
  }, [state.loaded, load]);
  const handlePageChange = useCallback((page: number) => {
    dispatch({ type: ACTIONS.SET_PAGE, data: page });
    dispatch({ type: ACTIONS.SET_LOADED, data: false });
  }, []);
  const handleSetEdited = useCallback(
    (edited?: Task, status?: number) => () => {
      dispatch({ type: ACTIONS.SET_EDITED, data: edited });
      dispatch({ type: ACTIONS.SET_STATUS, data: status });
    },
    [],
  );
  const handleToggleDeleting = useCallback(
    (entry?: Task) => () =>
      dispatch({ type: ACTIONS.SET_DELETING, data: entry }),
    [],
  );
  const handleDelete = useCallback(async () => {
    if (state.deleting) {
      dispatch({ type: ACTIONS.SET_LOADING, data: true });
      await TaskClientService.deleteSpiffTool(state.deleting.getId());
      dispatch({ type: ACTIONS.SET_LOADED, data: false });
      dispatch({ type: ACTIONS.SET_DELETING, data: undefined });
    }
  }, [state.deleting]);
  const COLUMNS: Columns = [
    { name: 'Claim Date' },
    { name: 'Spiff ID' },
    { name: 'Description' },
    { name: 'Spiff Type' },
    { name: 'Claimed By' },
    { name: 'Status' },
    { name: 'Amount' },
    { name: '' },
  ];
  const data: Data = state.loading
    ? makeFakeRows(8, 5)
    : state.entries.map(entry => {
        const lastStatus = entry.getActionsList()[0]
          ? entry.getActionsList()[0].getStatus()
          : 0;
        return [
          { value: formatDate(entry.getDatePerformed()) },
          { value: entry.getSpiffToolId() },
          { value: entry.getBriefDescription() },
          { value: state.spiffTypes[entry.getSpiffTypeId()].getExt() },
          { value: entry.getOwnerName() },
          { value: <SpiffActionsList actionsList={entry.getActionsList()} /> },
          { value: usd(entry.getSpiffAmount()) },

          {
            value: '',
            actions: [
              ...(lastStatus != 0
                ? []
                : [
                    <Tooltip key="approve" content="Approve" placement="bottom">
                      <IconButton
                        size="small"
                        onClick={handleSetEdited(entry, 1)}
                        disabled={role != 'Manager'}
                      >
                        <ApproveIcon />
                      </IconButton>
                    </Tooltip>,
                  ]),
              ...(lastStatus != 0
                ? []
                : [
                    <Tooltip key="reject" content="Reject" placement="bottom">
                      <IconButton
                        size="small"
                        onClick={handleSetEdited(entry, 2)}
                        disabled={role != 'Manager'}
                      >
                        <RejectIcon />
                      </IconButton>
                    </Tooltip>,
                  ]),
              ...(lastStatus != 1
                ? []
                : [
                    <Tooltip key="revoke" content="Revoke" placement="bottom">
                      <IconButton
                        size="small"
                        onClick={handleSetEdited(entry, 3)}
                        disabled={role != 'Manager'}
                      >
                        <RevokeIcon />
                      </IconButton>
                    </Tooltip>,
                  ]),
              <IconButton
                key="delete"
                size="small"
                disabled={entry.getExternalId() != loggedUserId}
                onClick={handleToggleDeleting(entry)}
              >
                <DeleteIcon />
              </IconButton>,
              <IconButton
                key="edit"
                size="small"
                onClick={handleSetEdited(entry)}
              >
                <EditIcon />
              </IconButton>,
            ],
          },
        ];
      });
  return (
    <>
      <SectionBar
        title="Spiffs"
        pagination={{
          count: state.count,
          page: state.page,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: handlePageChange,
        }}
      />
      <InfoTable columns={COLUMNS} data={data} loading={state.loading} />
      {state.edited && (
        <Modal open onClose={handleSetEdited()} fullScreen>
          <SpiffToolLogEdit
            role={role}
            onClose={handleSetEdited()}
            data={state.edited}
            onSave={() => {
              handleSetEdited()();
              dispatch({ type: ACTIONS.SET_LOADED, data: false });
            }}
            onStatusChange={() =>
              dispatch({ type: ACTIONS.SET_LOADED, data: false })
            }
            type="Spiff"
            loggedUserId={loggedUserId}
            loading={state.loading}
            cancelLabel="Close"
            statusEditing={
              state.status
                ? getStatusFormInit(state.status, loggedUserName)
                : undefined
            }
          />
        </Modal>
      )}
      {state.deleting && (
        <ConfirmDelete
          open
          onClose={handleToggleDeleting()}
          kind="Spiff"
          name={[
            `claimed by ${state.deleting.getOwnerName()}`,
            ...(state.deleting.getDatePerformed()
              ? [`at ${formatDate(state.deleting.getDatePerformed())}`]
              : []),
            `for amount ${usd(state.deleting.getSpiffAmount())}`,
          ].join(' ')}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
