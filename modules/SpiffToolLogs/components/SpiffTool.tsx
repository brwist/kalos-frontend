import React, { FC, useState, useEffect, useCallback } from 'react';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { Option } from '../../ComponentsLibrary/Field';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import {
  getRPCFields,
  timestamp,
  formatDate,
  makeFakeRows,
} from '../../../helpers';
import { ENDPOINT } from '../../../constants';

const TaskClientService = new TaskClient(ENDPOINT);

type TaskType = Task.AsObject;

export interface Props {
  loggedUserId: number;
}

const SPIFF_TYPES: Option[] = [
  { label: 'ACJM - A/C Job Manager 1', value: 1 },
  { label: 'ACIN - A/C Install 2', value: 2 },
  { label: 'CNCT - PM Contract / Contract Lead 3', value: 3 },
  { label: 'CMSN - Commission 4', value: 4 },
  { label: 'OUTO - Out of Town 5', value: 5 },
  { label: 'PRMA - PM 6', value: 6 },
  { label: 'PHJM - P/H Job Manager 7', value: 7 },
  { label: 'PHIN - P/H Install 8', value: 8 },
  { label: 'UNCT - Uncategorized 10', value: 10 },
  { label: 'AIRU - Air Knight or UV Light Sales 14', value: 14 },
  { label: 'FITY - Infinity Air Purifier Sale 15', value: 15 },
  { label: 'SWAY - Prop Mngr PM Cnct Lead 16', value: 16 },
  { label: 'CIND - Contract Creation Spiff 17', value: 17 },
  { label: 'BENT - System Sales Commission 18', value: 18 },
  { label: 'ACLD - AC Sale Lead 19', value: 19 },
  { label: 'ROCK - Quoted Repairs Spiff 20', value: 20 },
];

const SCHEMA: Schema<TaskType> = [
  [
    // { name: 'datePerformed', label: 'Claim Date' }, // Claim Date
    { name: 'spiffTypeId', label: 'Spiff Type', options: SPIFF_TYPES },
    // Job Date
    { name: 'briefDescription', label: 'Description' },
  ],
  [
    { name: 'spiffJobNumber', label: 'Job #' },
    {
      name: 'spiffAmount',
      label: 'Amount',
      startAdornment: '$',
      type: 'number',
    },
  ],
];

const COLUMNS: Columns = [
  { name: 'Claim Date' },
  { name: 'Spiff ID #' },
  { name: 'Spiff' },
  { name: 'Job Date' },
  { name: 'Technician' },
  { name: 'Job #' },
  { name: 'Status' },
  { name: 'Amount' },
  { name: 'Duplicates' },
];

export const SpiffTool: FC<Props> = ({ loggedUserId }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<TaskType>();
  const [entries, setEntries] = useState<TaskType[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const req = new Task();
    req.setPageNumber(0);
    req.setIsActive(1);
    req.setExternalId(loggedUserId.toString());
    const { resultsList, totalCount } = (
      await TaskClientService.BatchGet(req)
    ).toObject();
    setEntries(resultsList);
    setLoading(false);
  }, [setEntries, setLoading]);
  const handleSetEditing = useCallback(
    (editing?: TaskType) => () => setEditing(editing),
    [setEditing],
  );
  const handleSave = useCallback(
    async (data: TaskType) => {
      if (editing) {
        setSaving(true);
        const now = timestamp();
        const isNew = !editing.id;
        const req = new Task();
        req.setPriorityId(2);
        req.setExternalCode('user');
        req.setExternalId(loggedUserId.toString());
        req.setBillableType('Spiff');
        req.setReferenceNumber('');
        req.setToolpurchaseCost(0);
        const fieldMaskList = [
          'PriorityId',
          'ExternalCode',
          'ExternalId',
          'BillableType',
          'ReferenceNumber',
        ];
        if (isNew) {
          req.setTimeCreated(now);
          req.setTimeDue(now);
          req.setDatePerformed(now);
          req.setToolpurchaseDate(now);
          fieldMaskList.push(
            'TimeCreated',
            'TimeDue',
            'DatePerformed',
            'ToolpurchaseDate',
          );
        }
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          // @ts-ignore
          req[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        req.setFieldMaskList(fieldMaskList);
        await TaskClientService[isNew ? 'Create' : 'Update'](req);
        setSaving(false);
        setEditing(undefined);
        await load();
      }
    },
    [loggedUserId, editing],
  );
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded]);
  console.log({ entries });
  const data: Data = loading
    ? makeFakeRows(9, 3)
    : entries.map(
        ({
          id,
          spiffAmount,
          spiffJobNumber,
          datePerformed,
          briefDescription,
          timeCreated,
        }) => [
          {
            value: formatDate(timeCreated), // FIXME
          },
          { value: id }, // FIXME
          { value: briefDescription },
          { value: formatDate(datePerformed) },
          { value: 'Krzysztof Olbinski' }, // FIXME
          { value: spiffJobNumber }, // TODO: Link
          { value: '' }, // FIXME
          { value: '$' + spiffAmount },
          {
            value: '',
            actions: [
              <IconButton key={0} size="small">
                <EditIcon />
              </IconButton>,
              <IconButton key={1} size="small">
                <DeleteIcon />
              </IconButton>,
            ],
          }, // FIXME
        ],
      );
  return (
    <div>
      <SectionBar
        title="Spiff Report"
        actions={[
          { label: 'Add', onClick: handleSetEditing(new Task().toObject()) },
        ]}
        fixedActions
      />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
      {editing && (
        <Modal open onClose={handleSetEditing()}>
          <Form<TaskType>
            title="Spiff Request"
            schema={SCHEMA}
            onClose={handleSetEditing()}
            data={editing}
            onSave={handleSave}
            disabled={saving}
          />
        </Modal>
      )}
    </div>
  );
};
