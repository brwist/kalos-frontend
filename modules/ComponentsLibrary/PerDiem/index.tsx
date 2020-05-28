import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { startOfWeek, format, addDays } from 'date-fns';
import { PerDiem, PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '../Button';
import { CalendarHeader } from '../CalendarHeader';
import { Calendar } from '../Calendar';
import { CalendarColumn } from '../CalendarColumn';
import { CalendarCard } from '../CalendarCard';
import { Form, Schema } from '../Form';
import { Modal } from '../Modal';
import { ConfirmDelete } from '../ConfirmDelete';
import { SectionBar } from '../SectionBar';
import {
  loadUserById,
  loadPerDiemByUserIdAndDateStarted,
  UserType,
  PerDiemType,
  PerDiemRowType,
  getCustomerName,
  loadTimesheetDepartments,
  TimesheetDepartmentType,
  getDepartmentName,
  upsertPerDiem,
  deletePerDiemById,
  upsertPerDiemRow,
  deletePerDiemRowById,
} from '../../../helpers';
import { JOB_STATUS_COLORS } from '../../../constants';

export interface Props {
  userId: number;
}

const useStyles = makeStyles(theme => ({
  department: {
    marginTop: theme.spacing(),
  },
  calendar: {
    backgroundColor: theme.palette.grey[300],
    paddingBottom: theme.spacing(),
  },
  row: {
    marginBottom: theme.spacing(0.5),
  },
  formFooter: {
    textAlign: 'center',
  },
  button: {
    marginLeft: 0,
  },
}));

const formatDateFns = (date: Date) => format(date, 'yyyy-MM-dd');

const getStatus = (dateApproved: string, dateSubmitted: string) => {
  if (dateApproved)
    return {
      status: APPROVED,
      button: 'Approve Per Diems',
      text: 'Approved',
      color: '#' + JOB_STATUS_COLORS['Completed'],
    };
  if (dateSubmitted)
    return {
      status: PENDING_APPROVE,
      button: 'Approve Per Diems',
      text: 'Pending approve',
      color: '#' + JOB_STATUS_COLORS['Pend Sched'],
    };
  return {
    status: PENDING_SUBMIT,
    button: 'Submit Per Diems',
    text: 'Pending submit',
    color: '#' + JOB_STATUS_COLORS['Incomplete'],
  };
};

const SCHEMA_PER_DIEM_ROW: Schema<PerDiemRowType> = [
  [
    {
      name: 'id',
      type: 'hidden',
    },
  ],
  [
    {
      name: 'perDiemId',
      type: 'hidden',
    },
  ],
  [
    {
      label: 'Date',
      name: 'dateString',
      type: 'date',
      readOnly: true,
    },
  ],
  [
    {
      label: 'Zip Code',
      name: 'zipCode',
      required: true,
    },
  ],
  [
    {
      label: 'Service Call',
      name: 'serviceCallId',
      required: true,
    },
  ],
  [
    {
      label: 'Notes',
      name: 'notes',
      multiline: true,
    },
  ],
  [
    {
      label: 'Meals Only',
      name: 'mealsOnly',
      type: 'checkbox',
    },
  ],
];

const APPROVED = 'APPROVED';
const PENDING_APPROVE = 'PENDING_APPROVE';
const PENDING_SUBMIT = 'PENDING_SUBMIT';

export const PerDiemComponent: FC<Props> = ({ userId }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [pendingPerDiemEdit, setPendingPerDiemEdit] = useState<PerDiemType>();
  const [pendingPerDiemDelete, setPendingPerDiemDelete] = useState<
    PerDiemType
  >();
  const [pendingPerDiemRowDelete, setPendingPerDiemRowDelete] = useState<
    boolean
  >(false);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [dateStarted, setDateStarted] = useState<Date>(
    addDays(startOfWeek(new Date(), { weekStartsOn: 6 }), -7),
  );
  const [pendingPerDiemRowEdit, setPendingPerDiemRowEdit] = useState<
    PerDiemRowType
  >();
  const load = useCallback(async () => {
    setLoading(true);
    const { resultsList } = await loadPerDiemByUserIdAndDateStarted(
      userId,
      formatDateFns(dateStarted),
    );
    setPerDiems(resultsList);
    setLoading(false);
  }, [userId, setLoading, setPerDiems, dateStarted]);
  const loadUser = useCallback(async () => {
    setLoadingUser(true);
    const user = await loadUserById(userId);
    const departments = await loadTimesheetDepartments();
    setUser(user);
    setDepartments(departments);
    setLoadingUser(false);
  }, [userId, setLoadingUser, setUser, setDepartments]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  useEffect(() => {
    if (!userLoaded) {
      setUserLoaded(true);
      loadUser();
    }
  }, [userLoaded, setUserLoaded, loadUser]);
  const handleSetDateStarted = useCallback(
    (value: Date) => {
      if (formatDateFns(value) === formatDateFns(dateStarted)) return;
      setDateStarted(value);
      setLoaded(false);
    },
    [setDateStarted, setLoaded, dateStarted],
  );
  const handlePendingPerDiemRowEditToggle = useCallback(
    (pendingPerDiemRowEdit?: PerDiemRowType) => () =>
      setPendingPerDiemRowEdit(pendingPerDiemRowEdit),
    [setPendingPerDiemRowEdit],
  );
  const handleSavePerDiem = useCallback(
    async (data: PerDiemType) => {
      setSaving(true);
      await upsertPerDiem(data);
      setPendingPerDiemEdit(undefined);
      setSaving(false);
      setLoaded(false);
    },
    [setSaving, setPendingPerDiemEdit, setLoaded],
  );
  const handleSavePerDiemRow = useCallback(
    async (perDiemRow: PerDiemRowType) => {
      setSaving(true);
      await upsertPerDiemRow(perDiemRow);
      setPendingPerDiemRowEdit(undefined);
      setSaving(false);
      setLoaded(false);
    },
    [setSaving, setPendingPerDiemRowEdit, setLoaded],
  );
  const handlePendingPerDiemDeleteToggle = useCallback(
    (pendingPerDiemDelete?: PerDiemType) => () =>
      setPendingPerDiemDelete(pendingPerDiemDelete),
    [setPendingPerDiemDelete],
  );
  const handlePendingPerDiemRowDeleteToggle = useCallback(
    (pendingPerDiemRowDelete: boolean) => () =>
      setPendingPerDiemRowDelete(pendingPerDiemRowDelete),
    [setPendingPerDiemRowDelete],
  );
  const handlePendingPerDiemEditToggle = useCallback(
    (pendingPerDiemEdit?: PerDiemType) => () =>
      setPendingPerDiemEdit(pendingPerDiemEdit),
    [setPendingPerDiemEdit],
  );
  const handleDeletePerDiem = useCallback(async () => {
    if (pendingPerDiemDelete) {
      const { id } = pendingPerDiemDelete;
      setPendingPerDiemDelete(undefined);
      await deletePerDiemById(id);
      setLoaded(false);
    }
  }, [pendingPerDiemDelete, setLoaded, setPendingPerDiemDelete]);
  const handleDeletePerDiemRow = useCallback(async () => {
    if (pendingPerDiemRowDelete && pendingPerDiemRowEdit) {
      const { id } = pendingPerDiemRowEdit;
      setPendingPerDiemRowDelete(false);
      setPendingPerDiemRowEdit(undefined);
      await deletePerDiemRowById(id);
      setLoaded(false);
    }
  }, [
    pendingPerDiemRowDelete,
    setPendingPerDiemRowDelete,
    setPendingPerDiemRowEdit,
    setLoaded,
  ]);
  const departmentsOptions = useMemo(
    () =>
      sortBy(
        departments.map(d => ({
          // TODO: exclude already taken departments
          value: d.id,
          label: getDepartmentName(d),
        })),
        ({ label }) => label,
      ),
    [departments],
  );
  const SCHEMA_PER_DIEM: Schema<PerDiemType> = pendingPerDiemEdit
    ? [
        [
          {
            name: 'id',
            type: 'hidden',
          },
          {
            name: 'userId',
            type: 'hidden',
          },
          {
            name: 'dateStarted',
            type: 'hidden',
          },
        ],
        [
          ...(pendingPerDiemEdit.id
            ? []
            : [
                {
                  name: 'departmentId' as const,
                  label: 'Department',
                  options: departmentsOptions,
                },
              ]),
        ],
        [
          {
            name: 'notes',
            label: 'Notes',
            multiline: true,
          },
        ],
      ]
    : [];
  const makeNewPerDiem = useCallback(() => {
    const req = new PerDiem();
    if (user) {
      req.setUserId(userId);
      req.setDateStarted(formatDateFns(dateStarted));
      req.setDepartmentId(user.employeeDepartmentId);
    }
    return req.toObject();
  }, [userId, dateStarted, user]);
  const makeNewPerDiemRow = useCallback(
    (perDiemId: number, dateString: string) => {
      const req = new PerDiemRow();
      req.setPerDiemId(perDiemId);
      req.setDateString(dateString);
      return req.toObject();
    },
    [],
  );
  return (
    <div>
      <CalendarHeader
        onDateChange={handleSetDateStarted}
        onSubmit={handlePendingPerDiemEditToggle(makeNewPerDiem())}
        selectedDate={dateStarted}
        userName={getCustomerName(user)}
        weekStartsOn={6}
        submitLabel="Add Per Diem"
      />
      {perDiems.map(entry => {
        const {
          id,
          rowsList,
          department,
          dateApproved,
          dateSubmitted,
          notes,
        } = entry;
        const status = getStatus(dateApproved, dateSubmitted);
        return (
          <div key={id} className={classes.department}>
            <SectionBar
              title={`Department: ${getDepartmentName(department)}`}
              actions={[
                {
                  label: 'Edit Per Diem',
                  onClick: handlePendingPerDiemEditToggle(entry),
                },
                {
                  label: 'Delete Per Diem',
                  variant: 'outlined',
                  onClick: handlePendingPerDiemDeleteToggle(entry),
                },
              ]}
              fixedActions
              footer={notes}
            >
              <Calendar className={classes.calendar}>
                {[...Array(7)].map((_, dayOffset) => {
                  const date = formatDateFns(addDays(dateStarted, dayOffset));
                  const rows = rowsList.filter(({ dateString }) =>
                    dateString.startsWith(date),
                  );
                  return (
                    <CalendarColumn
                      key={dayOffset}
                      date={date}
                      loading={loading || loadingUser}
                      loadingRows={2}
                    >
                      <Button
                        label="Add Per Diem Row"
                        compact
                        variant="text"
                        fullWidth
                        className={classes.button}
                        onClick={handlePendingPerDiemRowEditToggle(
                          makeNewPerDiemRow(id, date),
                        )}
                        size="xsmall"
                      />
                      {rows.map(entry => {
                        const {
                          id,
                          notes,
                          zipCode,
                          serviceCallId,
                          mealsOnly,
                        } = entry;
                        return (
                          <CalendarCard
                            key={id}
                            title={status.text.toUpperCase()}
                            statusColor={status.color}
                            onClick={handlePendingPerDiemRowEditToggle(entry)}
                          >
                            <div className={classes.row}>
                              <strong>Zip Code: </strong>
                              {zipCode}
                            </div>
                            <div className={classes.row}>
                              <strong>Service Call Id: </strong>
                              {serviceCallId}
                            </div>
                            <div className={classes.row}>
                              <strong>Meals only: </strong>
                              {mealsOnly ? 'Yes' : 'No'}
                            </div>
                            <div className={classes.row}>
                              <strong>Notes: </strong>
                              {notes}
                            </div>
                          </CalendarCard>
                        );
                      })}
                    </CalendarColumn>
                  );
                })}
              </Calendar>
            </SectionBar>
          </div>
        );
      })}
      {pendingPerDiemEdit && (
        <Modal open onClose={handlePendingPerDiemEditToggle(undefined)}>
          <Form
            title={`${pendingPerDiemEdit.id ? 'Edit' : 'Add'} Per Diem`}
            schema={SCHEMA_PER_DIEM}
            data={pendingPerDiemEdit}
            onClose={handlePendingPerDiemEditToggle(undefined)}
            onSave={handleSavePerDiem}
            disabled={saving}
          />
        </Modal>
      )}
      {pendingPerDiemRowEdit && (
        <Modal open onClose={handlePendingPerDiemRowEditToggle(undefined)}>
          <Form
            title={`${pendingPerDiemRowEdit.id ? 'Edit' : 'Add'} Per Diem Row`}
            schema={SCHEMA_PER_DIEM_ROW}
            data={pendingPerDiemRowEdit}
            onClose={handlePendingPerDiemRowEditToggle(undefined)}
            onSave={handleSavePerDiemRow}
            disabled={saving}
          >
            {!!pendingPerDiemRowEdit.id && (
              <div className={classes.formFooter}>
                <Button
                  label="Delete"
                  onClick={handlePendingPerDiemRowDeleteToggle(true)}
                  disabled={saving}
                  variant="outlined"
                  compact
                  className={classes.button}
                />
              </div>
            )}
          </Form>
        </Modal>
      )}
      {pendingPerDiemDelete && (
        <ConfirmDelete
          open
          onClose={handlePendingPerDiemDeleteToggle(undefined)}
          onConfirm={handleDeletePerDiem}
          kind="Per Diem"
          name={`for department ${getDepartmentName(
            pendingPerDiemDelete.department,
          )}`}
        />
      )}
      {pendingPerDiemRowDelete && pendingPerDiemRowEdit && (
        <ConfirmDelete
          open
          onClose={handlePendingPerDiemRowDeleteToggle(false)}
          onConfirm={handleDeletePerDiemRow}
          kind="this Per Diem Row"
          name=""
        />
      )}
    </div>
  );
};
