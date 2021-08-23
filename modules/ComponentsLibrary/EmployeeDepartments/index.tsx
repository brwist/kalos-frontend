import React, { FC, useState, useCallback, useEffect } from 'react';
import { EmployeeFunction } from '@kalos-core/kalos-rpc/EmployeeFunction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { ConfirmDelete } from '../ConfirmDelete';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import {
  makeFakeRows,
  formatDate,
  UserClientService,
  EmployeeFunctionClientService,
} from '../../../helpers';
import { User } from '@kalos-core/kalos-rpc/User';

interface Props {
  loggedUserId: number;
  onClose?: () => void;
}

const COLUMNS: Columns = [
  { name: 'Name' },
  { name: 'Color' },
  { name: 'Status' },
  { name: 'Added Date' },
];

const SCHEMA: Schema<EmployeeFunction> = [
  [{ name: 'getId', type: 'hidden' }],
  [{ name: 'getName', label: 'Name', required: true }],
  [{ name: 'getColor', label: 'Color', type: 'color', required: true }],
  [
    {
      name: 'getStatus',
      label: 'Status',
      required: true,
      options: [
        { label: 'Active', value: 0 },
        { label: 'Deactive', value: 1 },
      ],
    },
  ],
];

export const EmployeeDepartments: FC<Props> = ({ onClose, loggedUserId }) => {
  const [loadingDicts, setLoadingDicts] = useState<boolean>(false);
  const [loadedDicts, setLoadedDicts] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [entries, setEntries] = useState<EmployeeFunction[]>([]);
  const [pendingEdit, setPendingEdit] = useState<EmployeeFunction>();
  const [generateCsv, setGenerateCsv] = useState<EmployeeFunction>();
  const [pendingDelete, setPendingDelete] = useState<EmployeeFunction>();
  const [user, setUser] = useState<User>();
  const loadDicts = useCallback(async () => {
    setLoadingDicts(true);
    const user = await UserClientService.loadUserById(loggedUserId);
    setUser(user);
    setLoadingDicts(false);
    setLoadedDicts(true);
  }, [setLoadingDicts, setLoadedDicts, loggedUserId, setUser]);
  const load = useCallback(async () => {
    setLoading(true);
    const entries = await EmployeeFunctionClientService.loadEmployeeFunctions();
    setEntries(entries);
    setLoading(false);
  }, [setLoading, setEntries]);
  useEffect(() => {
    if (!loaded && loadedDicts) {
      setLoaded(true);
      load();
    }
    if (!loadedDicts) {
      loadDicts();
    }
  }, [loaded, setLoaded, load, loadedDicts, loadDicts]);
  const saveEntry = useCallback(
    async (data: EmployeeFunction) => {
      setSaving(true);
      await EmployeeFunctionClientService.upsertEmployeeFunction(
        data,
        loggedUserId,
      );
      setSaving(false);
      setPendingEdit(undefined);
      setLoaded(false);
    },
    [setSaving, setLoaded, loggedUserId],
  );
  const deleteEntry = useCallback(async () => {
    if (pendingDelete) {
      const id = pendingDelete.getId();
      setPendingDelete(undefined);
      setLoading(true);
      await EmployeeFunctionClientService.deleteEmployeeFunctionById(id);
      setLoaded(false);
    }
  }, [pendingDelete, setLoaded, setLoading]);
  const handlePendingEditToggle = useCallback(
    (entry?: EmployeeFunction) => () => setPendingEdit(entry),
    [setPendingEdit],
  );
  const generateCsvEntry = useCallback(
    async (data: EmployeeFunction) => {
      await EmployeeFunctionClientService.generateCsvFunction(
        data,
      );
    },
    [],
  );
  const handleGenerateCSV = useCallback(
    (entry: EmployeeFunction) => () => generateCsvEntry(entry),
    [generateCsvEntry],
  );
  const handlePendingDeleteToggle = useCallback(
    (entry?: EmployeeFunction) => () => setPendingDelete(entry),
    [setPendingDelete],
  );
  const makeNewEntry = () => {
    const req = new EmployeeFunction();
    req.setIsdeleted(0);
    req.setStatus(0);
    req.setColor('#000000');
    return req;
  };
  const generateCsvEnt = () => {
    const req = new EmployeeFunction();
    return req;
  };
  const data: Data =
    loading || loadingDicts || !user
      ? makeFakeRows(4, 3)
      : entries.map(entry => {
          const name = entry.getName();
          const color = entry.getName();
          const status = entry.getStatus();
          const addeddate = entry.getAddeddate();
          return [
            {
              value: name,
              onClick: user.getIsAdmin()
                ? handlePendingEditToggle(entry)
                : undefined,
            },
            {
              value: (
                <div
                  style={{
                    backgroundColor: color,
                    height: 20,
                    maxWidth: 100,
                  }}
                />
              ),
              onClick: user.getIsAdmin()
                ? handlePendingEditToggle(entry)
                : undefined,
            },
            {
              value: status ? 'Deactive' : 'Active',
              onClick: user.getIsAdmin()
                ? handlePendingEditToggle(entry)
                : undefined,
            },
            {
              value: formatDate(addeddate),
              onClick: user.getIsAdmin()
                ? handlePendingEditToggle(entry)
                : undefined,
              actions: user.getIsAdmin()
                ? [
                    <IconButton
                      key="edit"
                      size="small"
                      onClick={handlePendingEditToggle(entry)}
                    >
                      <EditIcon />
                    </IconButton>,
                    <IconButton
                      key="delete"
                      size="small"
                      onClick={handlePendingDeleteToggle(entry)}
                    >
                      <DeleteIcon />
                    </IconButton>,
                  ]
                : [],
            },
          ];
        });
  return (
    <div>
      <SectionBar
        title="Employee Departments"
        actions={[
          ...(user?.getIsAdmin()
            ? [
                {
                  label: 'Add Department',
                  onClick: handlePendingEditToggle(makeNewEntry()),
                },
              ]
            : []),          
            ...(handleGenerateCSV
            ? [
                {
                  label: 'Generate CSV',
                  onClick: handleGenerateCSV(generateCsvEnt()),
                },
              ]
            : []),
          ...(onClose
            ? [
                {
                  label: 'Close',
                  onClick: onClose,
                },
              ]
            : []),
        ]}
      />
      <InfoTable
        columns={COLUMNS}
        data={data}
        loading={loading || loadingDicts}
      />
      {pendingEdit && (
        <Modal open onClose={handlePendingEditToggle(undefined)}>
          <Form<EmployeeFunction>
            title={`${
              pendingEdit.getId() ? 'Edit' : 'Add'
            } Employee Department`}
            schema={SCHEMA}
            data={pendingEdit}
            onClose={handlePendingEditToggle(undefined)}
            onSave={saveEntry}
            disabled={saving}
          />
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDelete
          open
          onClose={handlePendingDeleteToggle(undefined)}
          onConfirm={deleteEntry}
          kind="Employee Department"
          name={pendingDelete.getName()}
        />
      )}
    </div>
  );
};
