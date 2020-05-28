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
} from '../../../helpers';
import { JOB_STATUS_COLORS } from '../../../constants';

export interface Props {
  userId: number;
  loggedUserId: number;
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
): {
  status: 'APPROVED' | 'PENDING_APPROVE' | 'PENDING_SUBMIT';
  button: string;
  text: string;
  color: string;
} => {
  if (dateApproved)
    return {
      status: 'APPROVED',
      button: 'Approve',
      text: 'Approved',
      color: '#' + JOB_STATUS_COLORS['Completed'],
    };
  if (dateSubmitted)
    return {
      status: 'PENDING_APPROVE',
      button: 'Approve',
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

export const PerDiemComponent: FC<Props> = ({ userId, loggedUserId }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
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
    setDepartments(sortBy(departments, getDepartmentName));
    setLoadingUser(false);
  }, [userId, loggedUserId, setLoadingUser, setUser, setDepartments]);
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
  const makeNewPerDiem = useCallback(() => {
    const req = new PerDiem();
    if (user) {
      req.setUserId(userId);
      req.setDateStarted(formatDateFns(dateStarted));
      const usedDepartments = perDiems.map(({ departmentId }) => departmentId);
      req.setDepartmentId(
        usedDepartments.includes(user.employeeDepartmentId)
          ? (availableDapartments[0] || [{}]).id
          : user.employeeDepartmentId,
      );
    }
    return req.toObject();
  }, [userId, dateStarted, user, perDiems, departments, availableDapartments]);
  const makeNewPerDiemRow = useCallback(
    (perDiemId: number, dateString: string) => {
      const req = new PerDiemRow();
      req.setPerDiemId(perDiemId);
      req.setDateString(dateString);
      return req.toObject();
    },
    [],
  );
  if (loadingUser) return <Loader />;
  const addPerDiemDisabled = availableDapartments.length === 0;
  const isOwner = userId === loggedUserId;
  const isAnyManager = departments
    .map(({ managerId }) => managerId)
    .includes(loggedUserId);
  if (!isOwner && !isAnyManager)
    return (
      <Alert severity="error">
        You don't have permission to view this page
      </Alert>
    );
  const managerDepartmentsIds = departments
    .filter(({ managerId }) => managerId === loggedUserId)
    .map(({ id }) => id);
  const filteredPerDiems = isOwner
    ? perDiems
    : perDiems.filter(({ departmentId }) =>
        managerDepartmentsIds.includes(departmentId),
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
        submitDisabled={loading || saving || addPerDiemDisabled}
      />
      {filteredPerDiems.map(entry => {
        const {
          id,
          rowsList,
          department,
          dateApproved,
          dateSubmitted,
          notes,
          approvedByName,
        } = entry;
        const status = getStatus(dateApproved, dateSubmitted);
        const isManager = !isOwner;
        const buttonDisabled =
          saving ||
          loading ||
          status.status === 'APPROVED' ||
          (isOwner && status.status !== 'PENDING_SUBMIT');
        return (
          <div key={id} className={classes.department}>
            <SectionBar
              title={`Department: ${getDepartmentName(department)}`}
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
                  onClick: isOwner
                    ? handlePendingPerDiemSubmitToggle(entry)
                    : handlePendingPerDiemApproveToggle(entry),
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
                      loading={loading || loadingUser}
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
                              (isOwner && status.status === 'PENDING_SUBMIT') ||
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
