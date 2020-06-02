import React, { FC, useState, useCallback, useEffect } from 'react';
import { EmployeeFunction } from '@kalos-core/kalos-rpc/EmployeeFunction';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { ConfirmDelete } from '../ConfirmDelete';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import {
  loadEmployeeFunctions,
  EmployeeFunctionType,
  makeFakeRows,
  formatDate,
  loadUserById,
  UserType,
  upsertEmployeeFunction,
  deleteEmployeeFunctionById,
} from '../../../helpers';

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

const SCHEMA: Schema<EmployeeFunctionType> = [
  [{ name: 'id', type: 'hidden' }],
  [{ name: 'name', label: 'Name', required: true }],
  [{ name: 'color', label: 'Color', type: 'color', required: true }],
  [
    {
      name: 'status',
      label: 'Status',
      required: true,
      options: [
        { label: 'Active', value: 0 },
        { label: 'Deactive', value: 1 },
      ],
    },
  ],
];

const useStyles = makeStyles(theme => ({}));

export const EmployeeDepartments: FC<Props> = ({ onClose, loggedUserId }) => {
  const classes = useStyles();
  const [loadingDicts, setLoadingDicts] = useState<boolean>(false);
  const [loadedDicts, setLoadedDicts] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [entries, setEntries] = useState<EmployeeFunctionType[]>([]);
  const [pendingEdit, setPendingEdit] = useState<EmployeeFunctionType>();
  const [pendingDelete, setPendingDelete] = useState<EmployeeFunctionType>();
  const [user, setUser] = useState<UserType>();
  const loadDicts = useCallback(async () => {
    setLoadingDicts(true);
    const user = await loadUserById(loggedUserId);
    setUser(user);
    setLoadingDicts(false);
    setLoadedDicts(true);
  }, [setLoadingDicts, setLoadedDicts, loggedUserId, setUser]);
  const load = useCallback(async () => {
    setLoading(true);
    const entries = await loadEmployeeFunctions();
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
    async (data: EmployeeFunctionType) => {
      setSaving(true);
      await upsertEmployeeFunction(data, loggedUserId);
      setSaving(false);
      setPendingEdit(undefined);
      setLoaded(false);
    },
    [setSaving, setLoaded, loggedUserId],
  );
  const deleteEntry = useCallback(async () => {
    if (pendingDelete) {
      const { id } = pendingDelete;
      setPendingDelete(undefined);
      setLoading(true);
      await deleteEmployeeFunctionById(id);
      setLoaded(false);
    }
  }, [pendingDelete, setLoaded, setLoading]);
  const handlePendingEditToggle = useCallback(
    (entry?: EmployeeFunctionType) => () => setPendingEdit(entry),
    [setPendingEdit],
  );
  const handlePendingDeleteToggle = useCallback(
    (entry?: EmployeeFunctionType) => () => setPendingDelete(entry),
    [setPendingDelete],
  );
  const makeNewEntry = () => {
    const req = new EmployeeFunction();
    req.setIsdeleted(0);
    req.setStatus(0);
    req.setColor('#000000');
    return req.toObject();
  };
  const data: Data =
    loading || loadingDicts || !user
      ? makeFakeRows(4, 3)
      : entries.map(entry => {
          const { name, color, status, addeddate } = entry;
          return [
            {
              value: name,
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
            },
            {
              value: status ? 'Deactive' : 'Active',
            },
            {
              value: formatDate(addeddate),
              actions: user.isAdmin
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
          ...(user?.isAdmin
            ? [
                {
                  label: 'Add Department',
                  onClick: handlePendingEditToggle(makeNewEntry()),
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
          <Form<EmployeeFunctionType>
            title={`${pendingEdit.id ? 'Edit' : 'Add'} Employee Department`}
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
          name={pendingDelete.name}
        />
      )}
    </div>
  );
};
