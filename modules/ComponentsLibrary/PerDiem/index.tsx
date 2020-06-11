import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import Alert from '@material-ui/lab/Alert';
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
import { Confirm } from '../Confirm';
import { ConfirmDelete } from '../ConfirmDelete';
import { SectionBar } from '../SectionBar';
import { Loader } from '../../Loader/main';
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
  submitPerDiemById,
  formatDate,
  approvePerDiemById,
  loadPerDiemByDepartmentIdAndDateStarted,
} from '../../../helpers';
import { JOB_STATUS_COLORS } from '../../../constants';

export interface Props {
  loggedUserId: number;
  onClose?: () => void;
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

const getStatus = (
  dateApproved: string,
  dateSubmitted: string,
  isManager: boolean,
): {
  status: 'APPROVED' | 'PENDING_APPROVE' | 'PENDING_SUBMIT';
  button: string;
  text: string;
  color: string;
} => {
  if (dateApproved)
    return {
      status: 'APPROVED',
      button: isManager ? 'Approve' : 'Submit',
      text: 'Approved',
      color: '#' + JOB_STATUS_COLORS['Completed'],
    };
  if (dateSubmitted)
    return {
      status: 'PENDING_APPROVE',
      button: isManager ? 'Approve' : 'Submit',
      text: 'Pending approve',
      color: '#' + JOB_STATUS_COLORS['Pend Sched'],
    };
  return {
    status: 'PENDING_SUBMIT',
    button: 'Submit',
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
      label: 'Service Call ID',
      name: 'serviceCallId',
      type: 'eventId',
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

export const PerDiemComponent: FC<Props> = ({ loggedUserId, onClose }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [managerPerDiems, setManagerPerDiems] = useState<PerDiemType[]>([]);
  const [managerDepartmentId, setManagerDepartmentId] = useState<number>();
  const [pendingPerDiemSubmit, setPendingPerDiemSubmit] = useState<
    PerDiemType
  >();
  const [pendingPerDiemApprove, setPendingPerDiemApprove] = useState<
    PerDiemType
  >();
  const [pendingPerDiemEdit, setPendingPerDiemEdit] = useState<PerDiemType>();
  const [pendingPerDiemDelete, setPendingPerDiemDelete] = useState<
    PerDiemType
  >();
  const [pendingPerDiemRowDelete, setPendingPerDiemRowDelete] = useState<
    boolean
  >(false);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [dateStarted, setDateStarted] = useState<Date>(
    addDays(startOfWeek(new Date(), { weekStartsOn: 6 }), -0),
  );
  const [pendingPerDiemRowEdit, setPendingPerDiemRowEdit] = useState<
    PerDiemRowType
  >();
  const [
    pendingPerDiemEditDuplicated,
    setPendingPerDiemEditDuplicated,
  ] = useState<boolean>(false);
  const initialize = useCallback(async () => {
    setInitializing(true);
    const user = await loadUserById(loggedUserId);
    setUser(user);
    const departments = await loadTimesheetDepartments();
    console.log({ departments });
    setDepartments(sortBy(departments, getDepartmentName));
    const managerDepartment = departments.find(
      ({ managerId }) => managerId === loggedUserId,
    );
    console.log({ managerDepartment, loggedUserId });
    if (managerDepartment) {
      setManagerDepartmentId(managerDepartment.id);
    }
    setInitializing(false);
    setInitialized(true);
  }, [
    loggedUserId,
    setInitializing,
    setUser,
    setDepartments,
    setManagerDepartmentId,
    setInitialized,
  ]);
  const load = useCallback(async () => {
    setLoading(true);
    const { resultsList } = await loadPerDiemByUserIdAndDateStarted(
      loggedUserId,
      formatDateFns(dateStarted),
    );
    setPerDiems(resultsList);
    if (managerDepartmentId) {
      const managerPerDiems = await loadPerDiemByDepartmentIdAndDateStarted(
        managerDepartmentId,
        formatDateFns(dateStarted),
      );
      setManagerPerDiems(managerPerDiems.resultsList);
    }
    setLoading(false);
  }, [
    loggedUserId,
    setLoading,
    setPerDiems,
    dateStarted,
    managerDepartmentId,
    setManagerPerDiems,
  ]);
  useEffect(() => {
    if (!loaded && initialized) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load, initialized]);
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);
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
      data.userId = +data.userId;
      setPendingPerDiemEditDuplicated(false);
      if (
        managerPerDiems.find(
          ({ userId, departmentId }) =>
            userId === data.userId && departmentId === data.departmentId,
        )
      ) {
        setPendingPerDiemEditDuplicated(true);
        return;
      }
      setSaving(true);
      await upsertPerDiem(data);
      setPendingPerDiemEdit(undefined);
      setSaving(false);
      setLoaded(false);
    },
    [
      setSaving,
      setPendingPerDiemEdit,
      setLoaded,
      setPendingPerDiemEditDuplicated,
      managerPerDiems,
    ],
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
    (pendingPerDiemEdit?: PerDiemType) => () => {
      setPendingPerDiemEditDuplicated(false);
      setPendingPerDiemEdit(pendingPerDiemEdit);
    },
    [setPendingPerDiemEdit, setPendingPerDiemEditDuplicated],
  );
  const handlePendingPerDiemSubmitToggle = useCallback(
    (pendingPerDiemSubmit?: PerDiemType) => () =>
      setPendingPerDiemSubmit(pendingPerDiemSubmit),
    [setPendingPerDiemSubmit],
  );
  const handlePendingPerDiemApproveToggle = useCallback(
    (pendingPerDiemApprove?: PerDiemType) => () =>
      setPendingPerDiemApprove(pendingPerDiemApprove),
    [setPendingPerDiemApprove],
  );
  const submitPerDiem = useCallback(async () => {
    if (pendingPerDiemSubmit) {
      const { id } = pendingPerDiemSubmit;
      setPendingPerDiemSubmit(undefined);
      setSaving(true);
      await submitPerDiemById(id);
      setSaving(false);
      setLoaded(false);
    }
  }, [setSaving, setLoaded, pendingPerDiemSubmit]);
  const approvePerDiem = useCallback(async () => {
    if (pendingPerDiemApprove) {
      const { id } = pendingPerDiemApprove;
      setPendingPerDiemApprove(undefined);
      setSaving(true);
      await approvePerDiemById(id, loggedUserId);
      setSaving(false);
      setLoaded(false);
    }
  }, [setSaving, setLoaded, loggedUserId, pendingPerDiemApprove]);
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
  const departmentsOptions = useMemo(() => {
    const usedDepartments = perDiems.map(({ departmentId }) => departmentId);
    return departments
      .filter(({ id }) => !usedDepartments.includes(id))
      .map(d => ({
        value: d.id,
        label: getDepartmentName(d),
      }));
  }, [departments, perDiems]);
  const usedDepartments = useMemo(
    () => perDiems.map(({ departmentId }) => departmentId),
    [perDiems],
  );
  const availableDapartments = useMemo(
    () =>
      sortBy(
        departments.filter(({ id }) => !usedDepartments.includes(id)),
        getDepartmentName,
      ),
    [usedDepartments, departments],
  );
  const addPerDiemDisabled = availableDapartments.length === 0;
  const isAnyManager = departments
    .map(({ managerId }) => managerId)
    .includes(loggedUserId);
  const isOwner = !isAnyManager;
  const SCHEMA_PER_DIEM: Schema<PerDiemType> = pendingPerDiemEdit
    ? [
        [
          { name: 'id', type: 'hidden' },
          { name: 'dateStarted', type: 'hidden' },
        ],
        [
          {
            name: 'userId',
            label: 'Technician',
            type:
              isAnyManager && !pendingPerDiemEdit.id ? 'technician' : 'hidden',
            required: true,
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
                  required: true,
                  type: isAnyManager ? ('hidden' as const) : ('text' as const),
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
      if (!isAnyManager) {
        req.setUserId(loggedUserId);
      }
      req.setDateStarted(formatDateFns(dateStarted));
      const usedDepartments = perDiems.map(({ departmentId }) => departmentId);
      req.setDepartmentId(
        usedDepartments.includes(user.employeeDepartmentId)
          ? (availableDapartments[0] || [{}]).id
          : departments.map(({ id }) => id).includes(user.employeeDepartmentId)
          ? user.employeeDepartmentId
          : departments[0].id,
      );
    }
    return req.toObject();
  }, [
    loggedUserId,
    dateStarted,
    user,
    perDiems,
    departments,
    availableDapartments,
    isAnyManager,
  ]);
  const makeNewPerDiemRow = useCallback(
    (perDiemId: number, dateString: string) => {
      const req = new PerDiemRow();
      req.setPerDiemId(perDiemId);
      req.setDateString(dateString);
      return req.toObject();
    },
    [],
  );
  if (initializing) return <Loader />;
  const filteredPerDiems = isAnyManager ? managerPerDiems : perDiems;
  return (
    <div>
      <CalendarHeader
        onDateChange={handleSetDateStarted}
        onSubmit={handlePendingPerDiemEditToggle(makeNewPerDiem())}
        selectedDate={dateStarted}
        title={getCustomerName(user)}
        weekStartsOn={6}
        submitLabel="Add Per Diem"
        submitDisabled={loading || saving || addPerDiemDisabled}
        actions={onClose ? [{ label: 'Close', onClick: onClose }] : []}
      />
      {loading && <Loader />}
      {!loading && filteredPerDiems.length === 0 && (
        <Alert severity="info">
          {"You don't have any entries for selected week"}
        </Alert>
      )}
      {!loading &&
        filteredPerDiems.map(entry => {
          const {
            id,
            rowsList,
            department,
            dateApproved,
            dateSubmitted,
            notes,
            approvedByName,
            ownerName,
            userId,
          } = entry;
          const isManager = !isOwner;
          const status = getStatus(dateApproved, dateSubmitted, isManager);
          const buttonDisabled =
            saving ||
            loading ||
            status.status === 'APPROVED' ||
            (isOwner && status.status !== 'PENDING_SUBMIT');
          return (
            <div key={id} className={classes.department}>
              <SectionBar
                title={
                  isAnyManager
                    ? ownerName + ' (user id: ' + userId + ')'
                    : `Department: ${getDepartmentName(department)}`
                }
                subtitle={
                  <>
                    {+dateSubmitted[0] > 0 && (
                      <div>Submited Date: {formatDate(dateSubmitted)}</div>
                    )}
                    {+dateApproved[0] > 0 && (
                      <div>Approved Date: {formatDate(dateApproved)}</div>
                    )}
                    {approvedByName && <div>Approved By: {approvedByName}</div>}
                  </>
                }
                actions={[
                  {
                    label: 'Delete',
                    variant: 'outlined',
                    onClick: handlePendingPerDiemDeleteToggle(entry),
                    disabled: buttonDisabled,
                  },
                  {
                    label: 'Edit',
                    variant: 'outlined',
                    onClick: handlePendingPerDiemEditToggle(entry),
                    disabled: buttonDisabled,
                  },
                  {
                    label: status.button,
                    onClick:
                      isAnyManager && status.status === 'PENDING_APPROVE'
                        ? handlePendingPerDiemApproveToggle(entry)
                        : handlePendingPerDiemSubmitToggle(entry),
                    disabled: buttonDisabled,
                  },
                ]}
                footer={
                  notes.trim() ? (
                    <span>
                      <strong>Notes: </strong>
                      {notes}
                    </span>
                  ) : null
                }
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
                        loading={loading}
                        loadingRows={2}
                      >
                        {((isOwner && status.status === 'PENDING_SUBMIT') ||
                          (isManager && status.status !== 'APPROVED')) && (
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
                            disabled={loading || saving}
                          />
                        )}
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
                              onClick={
                                (isOwner &&
                                  status.status === 'PENDING_SUBMIT') ||
                                (isManager && status.status !== 'APPROVED')
                                  ? handlePendingPerDiemRowEditToggle(entry)
                                  : undefined
                              }
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
            error={
              pendingPerDiemEditDuplicated
                ? 'This technician already have Per Diem for that week in that department.'
                : ''
            }
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
      {pendingPerDiemSubmit && (
        <Confirm
          open
          onClose={handlePendingPerDiemSubmitToggle(undefined)}
          onConfirm={submitPerDiem}
          title="Confirm Submit"
          submitLabel="Submit"
        >
          Are you sure, you want to submit this Per Diem?
        </Confirm>
      )}
      {pendingPerDiemApprove && (
        <Confirm
          open
          onClose={handlePendingPerDiemApproveToggle(undefined)}
          onConfirm={approvePerDiem}
          title="Confirm Approve"
          submitLabel="Approve"
        >
          Are you sure, you want to approve this Per Diem?
        </Confirm>
      )}
    </div>
  );
};
