import React, { FC, useState, useEffect, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RepeatIcon from '@material-ui/icons/History';
import { SectionBar } from '../../SectionBar';
import { InfoTable, Columns, Data } from '../../InfoTable';
import { SpiffToolLogEdit, SpiffActionsList } from '../../SpiffToolLogEdit';
import { Modal } from '../../Modal';
import { EventType } from '../';
import {
  usd,
  formatDate,
  loadSpiffToolLogs,
  makeFakeRows,
  TaskType,
  loadSpiffTypes,
  SpiffTypeType,
} from '../../../../helpers';
import { ROWS_PER_PAGE } from '../../../../constants';

interface Props {
  serviceItem: EventType;
  loggedUserId: number;
}

export const Spiffs: FC<Props> = ({ serviceItem, loggedUserId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [entries, setEntries] = useState<TaskType[]>([]);
  const [spiffTypes, setSpiffTypes] = useState<{
    [key: number]: SpiffTypeType;
  }>({});
  const [edited, setEdited] = useState<TaskType>();
  const load = useCallback(async () => {
    setLoading(true);
    const spiffTypes = await loadSpiffTypes();
    setSpiffTypes(
      spiffTypes.reduce((aggr, item) => ({ ...aggr, [item.id]: item }), {}),
    );
    const { resultsList, count } = await loadSpiffToolLogs({
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
  }, [setLoading, setEntries, setCount, page, edited, setEdited]);
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
    (edited?: TaskType) => () => setEdited(edited),
    [setEdited],
  );
  const COLUMNS: Columns = [
    { name: 'Claim Date' },
    { name: 'Spiff ID' },
    { name: 'Description' },
    { name: 'Spiff Type' },
    { name: 'Claimed By' },
    { name: 'Status' },
    { name: 'Amount' },
  ];
  const data: Data = loading
    ? makeFakeRows(7, 5)
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
        return [
          { value: formatDate(datePerformed) },
          { value: referenceNumber },
          { value: briefDescription },
          { value: spiffTypes[spiffTypeId].ext },
          { value: ownerName },
          { value: <SpiffActionsList actionsList={actionsList} /> },
          {
            value: usd(spiffAmount),
            actions: [
              // TODO handle revoke action
              <IconButton key="revoke" size="small">
                <RepeatIcon />
              </IconButton>,
              // TODO handle delete action
              <IconButton key="delete" size="small">
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
          />
        </Modal>
      )}
    </>
  );
};
