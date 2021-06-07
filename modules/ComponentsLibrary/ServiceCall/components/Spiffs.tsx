import React, { FC, useState, useEffect, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RevokeIcon from '@material-ui/icons/History';
import RejectIcon from '@material-ui/icons/Block';
import ApproveIcon from '@material-ui/icons/CheckCircleOutline';
import { SectionBar } from '../../SectionBar';
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
  TaskType,
  SpiffTypeType,
} from '../../../../helpers';
import { ROWS_PER_PAGE } from '../../../../constants';

interface Props {
  serviceItem: EventType;
  loggedUserId: number;
  loggedUserName: string;
}

export const Spiffs: FC<Props> = ({
  serviceItem,
  loggedUserId,
  loggedUserName,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [entries, setEntries] = useState<TaskType[]>([]);
  const [deleting, setDeleting] = useState<TaskType>();
  const [spiffTypes, setSpiffTypes] = useState<{
    [key: number]: SpiffTypeType;
  }>({});
  const [edited, setEdited] = useState<TaskType>();
  const [status, setStatus] = useState<number>();
  const load = useCallback(async () => {
    setLoading(true);
    const spiffTypes = await TaskClientService.loadSpiffTypes();
    setSpiffTypes(
      spiffTypes.reduce((aggr, item) => ({ ...aggr, [item.id]: item }), {}),
    );
    const { resultsList, count } = await TaskClientService.loadSpiffToolLogs({
      page,
      type: 'Spiff',
      jobNumber: serviceItem.logJobNumber,
    });
    setEntries(resultsList);
    setCount(count);
    if (edited) {
      setEdited(resultsList.find(({ id }) => id === edited.id));
    }
    setLoading(false);
  }, [
    setLoading,
    setEntries,
    setCount,
    page,
    edited,
    setEdited,
    serviceItem.logJobNumber,
  ]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage],
  );
  const handleSetEdited = useCallback(
    (edited?: TaskType, status?: number) => () => {
      setEdited(edited);
      setStatus(status);
    },
    [setEdited, setStatus],
  );
  const handleToggleDeleting = useCallback(
    (entry?: TaskType) => () => setDeleting(entry),
    [setDeleting],
  );
  const handleDelete = useCallback(async () => {
    if (deleting) {
      const { id } = deleting;
      setDeleting(undefined);
      setLoading(true);
      await TaskClientService.deleteSpiffTool(id);
      setLoaded(false);
    }
  }, [deleting, setLoading, setLoaded, setDeleting]);
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
  const data: Data = loading
    ? makeFakeRows(8, 5)
    : entries.map(entry => {
        const {
          datePerformed,
          referenceNumber,
          briefDescription,
          spiffTypeId,
          spiffAmount,
          ownerName,
          actionsList,
        } = entry;
        const lastStatus = actionsList[0] ? actionsList[0].status : 0;
        return [
          { value: formatDate(datePerformed) },
          { value: referenceNumber },
          { value: briefDescription },
          { value: spiffTypes[spiffTypeId].ext },
          { value: ownerName },
          { value: <SpiffActionsList actionsList={actionsList} /> },
          { value: usd(spiffAmount) },
          {
            value: '',
            actions: [
              ...(lastStatus === 1
                ? []
                : [
                    <Tooltip key="approve" content="Approve" placement="bottom">
                      <IconButton
                        size="small"
                        onClick={handleSetEdited(entry, 1)}
                      >
                        <ApproveIcon />
                      </IconButton>
                    </Tooltip>,
                  ]),
              ...(lastStatus === 2
                ? []
                : [
                    <Tooltip key="reject" content="Reject" placement="bottom">
                      <IconButton
                        size="small"
                        onClick={handleSetEdited(entry, 2)}
                      >
                        <RejectIcon />
                      </IconButton>
                    </Tooltip>,
                  ]),
              ...(lastStatus === 3
                ? []
                : [
                    <Tooltip key="revoke" content="Revoke" placement="bottom">
                      <IconButton
                        size="small"
                        onClick={handleSetEdited(entry, 3)}
                      >
                        <RevokeIcon />
                      </IconButton>
                    </Tooltip>,
                  ]),
              <IconButton
                key="delete"
                size="small"
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
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handlePageChange,
        }}
      />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
      {edited && (
        <Modal open onClose={handleSetEdited()} fullScreen>
          <SpiffToolLogEdit
            onClose={handleSetEdited()}
            data={edited}
            onSave={() => {
              handleSetEdited()();
              setLoaded(false);
            }}
            onStatusChange={() => setLoaded(false)}
            type="Spiff"
            loggedUserId={loggedUserId}
            loading={loading}
            cancelLabel="Close"
            statusEditing={
              status ? getStatusFormInit(status, loggedUserName) : undefined
            }
          />
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete
          open
          onClose={handleToggleDeleting()}
          kind="Spiff"
          name={[
            `claimed by ${deleting.ownerName}`,
            ...(deleting.datePerformed
              ? [`at ${formatDate(deleting.datePerformed)}`]
              : []),
            `for amount ${usd(deleting.spiffAmount)}`,
          ].join(' ')}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
