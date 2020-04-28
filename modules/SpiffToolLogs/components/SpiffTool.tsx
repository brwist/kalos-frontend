import React, { FC, useState, useEffect, useCallback } from 'react';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import { User } from '@kalos-core/kalos-rpc/User';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { Option } from '../../ComponentsLibrary/Field';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import {
  getRPCFields,
  timestamp,
  formatDate,
  makeFakeRows,
  loadUserById,
  loadUsersByIds,
} from '../../../helpers';
import { ENDPOINT, ROWS_PER_PAGE, MONTHS_OPTIONS } from '../../../constants';

const TaskClientService = new TaskClient(ENDPOINT);
const SEARCH_PERIODS_TYPES = ['Monthly', 'Weekly'];

type TaskType = Task.AsObject;
type UserType = User.AsObject;
type SearchType = {
  description: string;
  month: number;
  periods: string;
};

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
    { name: 'timeDue', label: 'Claim Date', readOnly: true, type: 'date' },
    {
      name: 'datePerformed',
      label: 'Date Performed',
      type: 'date',
      required: true,
    },
    {
      name: 'spiffAmount',
      label: 'Amount',
      startAdornment: '$',
      type: 'number',
      required: true,
    },
  ],
  [
    {
      name: 'spiffTypeId',
      label: 'Spiff Type',
      options: SPIFF_TYPES,
      required: true,
    },
  ],
  [
    { name: 'briefDescription', label: 'Description' },
    { name: 'spiffJobNumber', label: 'Job #' },
  ],
];

const SCHEMA_EXTENDED: Schema<TaskType> = [
  [
    { name: 'spiffToolId', label: 'Spiff ID #', readOnly: true },
    { name: 'referenceUrl', label: 'External URL' },
    { name: 'referenceNumber', label: 'Reference #' },
  ],
  [
    { name: 'timeDue', label: 'Time due', readOnly: true, type: 'date' },
    { name: 'briefDescription', label: 'Description', multiline: true },
    {
      name: 'spiffAmount',
      label: 'Amount',
      startAdornment: '$',
      type: 'number',
      required: true,
    },
  ],
  [
    {
      name: 'spiffTypeId',
      label: 'Spiff Type',
      options: SPIFF_TYPES,
      required: true,
    },
  ],
  [
    { name: 'spiffJobNumber', label: 'Job #' },
    {
      name: 'datePerformed',
      label: 'Date Performed',
      type: 'date',
      required: true,
    },
    { name: 'spiffAddress', label: 'Address', multiline: true },
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
  const getSearchFormInit = () => ({
    description: '',
    month: new Date().getMonth() + 1,
    periods: 'Monthly',
  });
  const [loaded, setLoaded] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<TaskType>();
  const [extendedEditing, setExtendedEditing] = useState<TaskType>();
  const [deleting, setDeleting] = useState<TaskType>();
  const [loggedInUser, setLoggedInUser] = useState<UserType>();
  const [entries, setEntries] = useState<TaskType[]>([]);
  const [users, setUsers] = useState<{ [key: number]: UserType }>({});
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [searchForm, setSearchForm] = useState<SearchType>(getSearchFormInit());
  const [searchFormKey, setSearchFormKey] = useState<number>(0);
  const loadLoggedInUser = useCallback(async () => {
    const loggedInUser = await loadUserById(loggedUserId);
    setLoggedInUser(loggedInUser);
  }, [loggedUserId, setLoggedInUser]);
  const isAdmin = loggedInUser && !!loggedInUser.isAdmin; // FIXME isSpiffAdmin correct?
  const load = useCallback(async () => {
    setLoading(true);
    const req = new Task();
    req.setPageNumber(page);
    req.setIsActive(1);
    req.setExternalId(loggedUserId.toString());
    const { resultsList, totalCount: count } = (
      await TaskClientService.BatchGet(req)
    ).toObject();
    const userIds = resultsList.map(({ externalId }) => +externalId);
    const users = await loadUsersByIds(userIds);
    setCount(count);
    setUsers(users);
    setEntries(resultsList);
    setLoading(false);
  }, [setEntries, setLoading, setUsers, setCount, page]);
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const handleSetExtendedEditing = useCallback(
    (extendedEditing?: TaskType) => () => setExtendedEditing(extendedEditing),
    [setExtendedEditing],
  );
  const handleSetEditing = useCallback(
    (editing?: TaskType) => () => setEditing(editing),
    [setEditing],
  );
  const handleSetDeleting = useCallback(
    (deleting?: TaskType) => () => setDeleting(deleting),
    [setDeleting],
  );
  const handleDelete = useCallback(async () => {
    if (deleting) {
      setLoading(true);
      const req = new Task();
      req.setId(deleting.id);
      setDeleting(undefined);
      await TaskClientService.Delete(req);
      setLoading(false);
      await load();
    }
  }, [deleting, setLoading, setDeleting, load]);
  const handleSave = useCallback(
    async (data: TaskType) => {
      if (editing) {
        setSaving(true);
        const now = timestamp();
        const isNew = !editing.id;
        const req = new Task();
        const fieldMaskList = [];
        if (isNew) {
          req.setTimeCreated(now);
          req.setTimeDue(now);
          req.setDatePerformed(now);
          req.setToolpurchaseDate(now);
          req.setPriorityId(2);
          req.setExternalCode('user');
          req.setExternalId(loggedUserId.toString());
          req.setBillableType('Spiff');
          req.setReferenceNumber('');
          req.setToolpurchaseCost(0);
          fieldMaskList.push(
            'TimeCreated',
            'TimeDue',
            'DatePerformed',
            'ToolpurchaseDate',
            'PriorityId',
            'ExternalCode',
            'ExternalId',
            'BillableType',
            'ReferenceNumber',
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
    [loggedUserId, editing, setSaving, setEditing],
  );
  const handleSaveExtended = useCallback(
    async (data: TaskType) => {
      if (extendedEditing) {
        setSaving(true);
        const req = new Task();
        req.setId(extendedEditing.id);
        const fieldMaskList = [];
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          // @ts-ignore
          req[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        req.setFieldMaskList(fieldMaskList);
        await TaskClientService.Update(req);
        setSaving(false);
        setExtendedEditing(undefined);
        await load();
      }
    },
    [extendedEditing, setSaving, setExtendedEditing],
  );
  const handleSearchFormChange = useCallback(
    (form: SearchType) => setSearchForm(form),
    [],
  );
  const handleMakeSearch = useCallback(() => setLoaded(false), [setLoaded]);
  const handleResetSearch = useCallback(() => {
    setSearchForm(getSearchFormInit());
    setSearchFormKey(searchFormKey + 1);
    setLoaded(false);
  }, [setLoaded, setSearchForm, searchFormKey, setSearchFormKey]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      loadLoggedInUser();
      load();
    }
  }, [loaded, setLoaded]);
  const newTask = new Task();
  newTask.setTimeDue(timestamp());
  newTask.setDatePerformed(timestamp());
  newTask.setSpiffTypeId(+SPIFF_TYPES[0].value);
  const data: Data = loading
    ? makeFakeRows(9, 3)
    : entries.map(entry => {
        const {
          spiffToolId,
          spiffAmount,
          spiffJobNumber,
          datePerformed,
          briefDescription,
          timeDue,
          externalId,
        } = entry;
        const technician = users[+externalId];
        return [
          {
            value: formatDate(timeDue),
          },
          { value: spiffToolId },
          { value: briefDescription },
          { value: formatDate(datePerformed) },
          {
            value: technician
              ? `${technician.firstname} ${technician.lastname}`
              : '',
          },
          { value: spiffJobNumber }, // TODO: Link
          { value: '' }, // FIXME
          { value: '$' + spiffAmount },
          {
            value: '',
            actions: isAdmin
              ? [
                  <IconButton
                    key={0}
                    size="small"
                    onClick={handleSetExtendedEditing(entry)}
                  >
                    <EditIcon />
                  </IconButton>,
                  <IconButton
                    key={1}
                    size="small"
                    onClick={handleSetDeleting(entry)}
                  >
                    <DeleteIcon />
                  </IconButton>,
                ]
              : [
                  <IconButton key={0} size="small">
                    <SearchIcon />
                  </IconButton>,
                ],
          }, // FIXME
        ];
      });
  const SCHEMA_SEARCH: Schema<SearchType> = [
    [
      { name: 'description', label: 'Search Spiffs' },

      {
        name: 'month',
        label: 'Month',
        options: MONTHS_OPTIONS,
      },
      {
        name: 'periods',
        label: 'Periods',
        options: SEARCH_PERIODS_TYPES,
        actions: [
          { label: 'Reset', variant: 'outlined', onClick: handleResetSearch },
          { label: 'Search', onClick: handleMakeSearch },
        ],
      },
    ],
  ];
  return (
    <div>
      <SectionBar
        title="Spiff Report"
        actions={[
          { label: 'Add', onClick: handleSetEditing(newTask.toObject()) },
        ]}
        fixedActions
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
      />
      <PlainForm<SearchType>
        key={searchFormKey}
        data={searchForm}
        schema={SCHEMA_SEARCH}
        onChange={handleSearchFormChange}
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
      {extendedEditing && (
        <Modal open onClose={handleSetExtendedEditing()}>
          <Form<TaskType>
            title="Spiff Request"
            schema={SCHEMA_EXTENDED}
            onClose={handleSetExtendedEditing()}
            data={extendedEditing}
            onSave={handleSaveExtended}
            disabled={saving}
          />
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete
          open
          kind="Spiff"
          name={deleting.briefDescription}
          onConfirm={handleDelete}
          onClose={handleSetDeleting()}
        />
      )}
    </div>
  );
};
