import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { Alert as AlertPopup } from '../Alert';
import sortBy from 'lodash/sortBy';
import { startOfWeek, format, addDays, parseISO } from 'date-fns';
import { PerDiem, PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';
import { Button } from '../Button';
import { CalendarHeader } from '../CalendarHeader';
import { Calendar } from '../Calendar';
import { CalendarColumn } from '../CalendarColumn';
import { CalendarCard } from '../CalendarCard';
import { Form, Schema } from '../Form';
import { Field } from '../Field';
import { Modal } from '../Modal';
import { Confirm } from '../Confirm';
import { ConfirmDelete } from '../ConfirmDelete';
import { SectionBar } from '../SectionBar';
import { LodgingByZipCode } from '../LodgingByZipCode';
import { Loader } from '../../Loader/main';
import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import {
  UserType,
  PerDiemType,
  PerDiemRowType,
  TimesheetDepartmentType,
  formatDate,
  usd,
  UserClientService,
  PerDiemClientService,
  MapClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { JOB_STATUS_COLORS, MEALS_RATE, OPTION_ALL } from '../../../constants';
import './styles.less';
import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';
import { RoleType } from '../Payroll';

export interface Props {
  loggedUserId: number;
  onClose?: () => void;
  perDiem?: PerDiemType;
  ownerId?: number;
}

export const SCHEMA_KALOS_MAP_INPUT_FORM: Schema<Trip.AsObject> = [
  [
    {
      label: 'Origin Address',
      name: 'originAddress',
      type: 'text',
    },
    {
      label: 'Destination Address',
      name: 'destinationAddress',
      type: 'text',
    },
    {
      name: 'perDiemRowId',
      type: 'hidden',
    },
  ],
];

const formatDateFns = (date: Date) => format(date, 'yyyy-MM-dd');

const handleGetTripDistance = async (origin: string, destination: string) => {
  try {
    await MapClientService.getTripDistance(origin, destination);
  } catch (error: any) {
    console.error(
      'An error occurred while calculating the trip distance: ',
      error,
    );
    alert(
      'An error occurred while calculating the trip distance. Please try again, or contact your administrator if this error persists.',
    );
  }
};

export const getStatus = (
  dateApproved: string,
  dateSubmitted: string,
  isManager: boolean,
): {
  status: 'APPROVED' | 'PENDING_APPROVE' | 'PENDING_SUBMIT';
  button: string;
  text: string;
  color: string;
} => {
  if (dateApproved != NULL_TIME)
    return {
      status: 'APPROVED',
      button: isManager ? 'Approve' : 'Submit',
      text: 'Approved',
      color: '#' + JOB_STATUS_COLORS['Completed'],
    };
  if (dateSubmitted != NULL_TIME)
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

export const PerDiemComponent: FC<Props> = ({
  loggedUserId = 0,
  onClose,
  perDiem,
  ownerId,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [managerPerDiems, setManagerPerDiems] = useState<PerDiemType[]>([]);
  const [checkLodging, setCheckLodging] = useState<boolean>(false);
  const [managerPerDiemsOther, setManagerPerDiemsOther] = useState<{
    [key: number]: PerDiemType[];
  }>({});
  const [managerDepartmentIds, setManagerDepartmentIds] = useState<number[]>(
    [],
  );
  const [role, setRole] = useState<RoleType>();
  const [
    managerFilterDepartmentId,
    setManagerFilterDepartmentId,
  ] = useState<number>(0);
  const [govPerDiems, setGovPerDiems] = useState<{
    [key: string]: {
      meals: number;
      lodging: number;
    };
  }>({});
  const [
    pendingPerDiemSubmit,
    setPendingPerDiemSubmit,
  ] = useState<PerDiemType>();
  const [
    pendingPerDiemApprove,
    setPendingPerDiemApprove,
  ] = useState<PerDiemType>();
  const [pendingPerDiemEdit, setPendingPerDiemEdit] = useState<PerDiemType>();
  const [
    pendingPerDiemDelete,
    setPendingPerDiemDelete,
  ] = useState<PerDiemType>();
  const [
    pendingPerDiemRowDelete,
    setPendingPerDiemRowDelete,
  ] = useState<boolean>(false);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [dateStarted, setDateStarted] = useState<Date>(
    addDays(
      startOfWeek(perDiem ? parseISO(perDiem.dateStarted) : new Date(), {
        weekStartsOn: 6,
      }),
      -0,
    ),
  );
  const [
    pendingPerDiemRowEdit,
    setPendingPerDiemRowEdit,
  ] = useState<PerDiemRowType>();
  const [
    pendingPerDiemEditDuplicated,
    setPendingPerDiemEditDuplicated,
  ] = useState<boolean>(false);
  const initialize = useCallback(async () => {
    if (perDiem) {
      const year = +format(dateStarted, 'yyyy');
      const month = +format(dateStarted, 'M');
      const zipCodes = [perDiem]
        .reduce(
          (aggr, { rowsList }) => [...aggr, ...rowsList],
          [] as PerDiemRowType[],
        )
        .map(({ zipCode }) => zipCode);
      const govPerDiems = await PerDiemClientService.loadGovPerDiem(
        zipCodes,
        year,
        month,
      );
      setGovPerDiems(govPerDiems);
    }
    if (loggedUserId) {
      setInitializing(true);
      const user = await UserClientService.loadUserById(loggedUserId);
      setUser(user);
      const departments = await TimesheetDepartmentClientService.loadTimeSheetDepartments();
      setDepartments(
        sortBy(departments, TimesheetDepartmentClientService.getDepartmentName),
      );
      console.log({ user });
      const role = user.permissionGroupsList.find(p => p.type === 'role');
      if (role) {
        setRole(role.name as RoleType);
      }
      //This is where we get the department IDs from permission groups
      const groupDepartments = user.permissionGroupsList.filter(
        group => group.type === 'department',
      );
      const managerDepartments = departments.filter(
        ({ managerId }) => managerId === loggedUserId,
      );
      const totalDepartments = [];
      //New method, based on permission groups, where we setState the new department IDs
      //Since Not everyone has a permission group yet, this will be on hold for now.
      //Uncomment when ready.
      //if (groupDepartments.length > 0) {
      //  for (let i = 0; i < groupDepartments.length; i++) {
      //    totalDepartments.push(groupDepartments[i].id);
      //  }
      //  setManagerDepartmentIds(totalDepartments);
      //}
      //Current method for getting department IDS
      if (managerDepartments.length > 0) {
        setManagerDepartmentIds(managerDepartments.map(({ id }) => id));
      }
      setInitializing(false);
    }
    setInitialized(true);
  }, [dateStarted, loggedUserId, perDiem]);
  const load = useCallback(async () => {
    if (!loggedUserId) return;
    setLoading(true);
    const {
      resultsList,
    } = await PerDiemClientService.loadPerDiemByUserIdAndDateStarted(
      loggedUserId,
      formatDateFns(dateStarted),
    );
    let managerPerDiemsList = [] as PerDiemType[];
    let managerPerDiemsOther = {};
    if (managerDepartmentIds.length > 0) {
      const managerPerDiems = await PerDiemClientService.loadPerDiemByDepartmentIdsAndDateStarted(
        managerDepartmentIds,
        formatDateFns(dateStarted),
      );
      managerPerDiemsList = managerPerDiems;
      managerPerDiemsOther = await PerDiemClientService.loadPerDiemByUserIdsAndDateStarted(
        managerPerDiemsList.map(({ userId }) => userId),
        formatDateFns(dateStarted),
      );
    }
    const year = +format(dateStarted, 'yyyy');
    const month = +format(dateStarted, 'M');
    const zipCodes = [...resultsList, ...managerPerDiemsList]
      .reduce(
        (aggr, { rowsList }) => [...aggr, ...rowsList],
        [] as PerDiemRowType[],
      )
      .map(({ zipCode }) => zipCode);
    const govPerDiems = await PerDiemClientService.loadGovPerDiem(
      zipCodes,
      year,
      month,
    );
    if (!perDiem) {
      setGovPerDiems(govPerDiems);
    }
    setPerDiems(resultsList);
    setManagerPerDiemsOther(managerPerDiemsOther);
    setManagerPerDiems(managerPerDiemsList);
    setLoading(false);
  }, [
    loggedUserId,
    setLoading,
    setPerDiems,
    perDiem,
    dateStarted,
    managerDepartmentIds,
    setManagerPerDiems,
    setGovPerDiems,
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
  const govPerDiemByZipCode = useCallback(
    (zipCode: string) => {
      const govPerDiem = govPerDiems[zipCode];
      if (govPerDiem) return govPerDiem;
      return {
        meals: MEALS_RATE,
        lodging: 0,
      };
    },
    [govPerDiems],
  );
  const handleSetDateStarted = useCallback(
    (value: Date) => {
      if (formatDateFns(value) === formatDateFns(dateStarted)) return;
      setDateStarted(value);
      setLoaded(false);
    },
    [setDateStarted, setLoaded, dateStarted],
  );
  const handlePendingPerDiemRowEditToggle = useCallback(
    (pendingPerDiemRowEdit?: PerDiemRowType) => () => {
      setPendingPerDiemRowEdit(pendingPerDiemRowEdit);
    },
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
      await PerDiemClientService.upsertPerDiem(data);
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
      console.log('we are');
      setSaving(true);
      await PerDiemClientService.upsertPerDiemRow(perDiemRow);
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
      await PerDiemClientService.submitPerDiemById(id);
      setSaving(false);
      setLoaded(false);
    }
  }, [setSaving, setLoaded, pendingPerDiemSubmit]);
  const approvePerDiem = useCallback(async () => {
    if (pendingPerDiemApprove) {
      const { id } = pendingPerDiemApprove;
      setPendingPerDiemApprove(undefined);
      setSaving(true);
      await PerDiemClientService.approvePerDiemById(id, loggedUserId);
      setSaving(false);
      setLoaded(false);
      if (onClose) onClose();
    }
  }, [setSaving, onClose, setLoaded, loggedUserId, pendingPerDiemApprove]);
  const handleDeletePerDiem = useCallback(async () => {
    if (pendingPerDiemDelete) {
      const { id } = pendingPerDiemDelete;
      setPendingPerDiemDelete(undefined);
      await PerDiemClientService.deletePerDiemById(id);
      setLoaded(false);
    }
  }, [pendingPerDiemDelete, setLoaded, setPendingPerDiemDelete]);
  const handleDeletePerDiemRow = useCallback(async () => {
    if (pendingPerDiemRowDelete && pendingPerDiemRowEdit) {
      const { id } = pendingPerDiemRowEdit;
      setPendingPerDiemRowDelete(false);
      setPendingPerDiemRowEdit(undefined);
      await PerDiemClientService.deletePerDiemRowById(id);
      setLoaded(false);
    }
  }, [pendingPerDiemRowEdit, pendingPerDiemRowDelete]);
  const handleToggleCheckLodging = useCallback(
    (checkLodging: boolean) => () => setCheckLodging(checkLodging),
    [setCheckLodging],
  );

  /*const handleConfirmTripDelete = useCallback(
    (confirmTripDelete: Trip | undefined) => {
      setConfirmTripDelete(confirmTripDelete);
    },
    [setConfirmTripDelete],
  );
  const handleDeleteTrip = async (trip: Trip) => {
    try {
      await PerDiemClientService.DeleteTrip(trip);
    } catch (err: any) {
      console.error('An error occurred while deleting a trip: ', err);
      alert(
        'The trip was not able to be deleted. Please try again, or if this keeps happening please contact your administrator.',
      );
      handleConfirmTripDelete(undefined);
      return Error(err);
    }
    //alert('The trip was deleted successfully!');
    handleConfirmTripDelete(undefined);
    getTrips();
  };
  const handleDeleteAllTripsInRow = async (row: number) => {
    try {
      let i32 = new Int32();
      i32.setValue(row);
      //@ts-ignore
      await PerDiemClientService.BatchDeleteTrips(i32);
    } catch (err: any) {
      console.error(
        'An error occurred while deleting the trips for this week: ',
        err,
      );
      alert(
        'The trips were not able to be deleted. Please try again, or if this keeps happening please contact your administrator.',
      );
      handleConfirmTripDeleteAll(false);
      return;
    }
    handleConfirmTripDeleteAll(false);
    getTrips();
  };
  const handleConfirmTripDeleteAll = useCallback(
    (confirmTripDeleteAll: boolean) =>
      setConfirmTripDeleteAll(confirmTripDeleteAll),
    [setConfirmTripDeleteAll],
  );*/
  const departmentsOptions = useMemo(() => {
    const usedDepartments = perDiems.map(({ departmentId }) => departmentId);
    return departments
      .filter(({ id }) => !usedDepartments.includes(id))
      .map(d => ({
        value: d.id,
        label: TimesheetDepartmentClientService.getDepartmentName(d),
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
        TimesheetDepartmentClientService.getDepartmentName,
      ),
    [usedDepartments, departments],
  );

  const isAnyManager =
    departments.map(({ managerId }) => managerId).includes(loggedUserId) ||
    role === 'Manager';
  const isOwner = !isAnyManager;
  const addPerDiemDisabled = availableDapartments.length === 0;
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
      if (loggedUserId && ownerId) {
        req.setUserId(ownerId);
      } else {
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
    ownerId,
    perDiems,
    departments,
    availableDapartments,
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
  const filteredPerDiems = perDiem
    ? [perDiem]
    : isAnyManager
    ? managerPerDiems.filter(({ departmentId }) => {
        if (managerFilterDepartmentId === 0) return true;
        return managerFilterDepartmentId === departmentId;
      })
    : perDiems;
  const allRowsList = filteredPerDiems.reduce(
    (aggr, { rowsList }) => [...aggr, ...rowsList],
    [] as PerDiemRowType[],
  );
  const totalMeals = allRowsList.reduce(
    (aggr, { zipCode }) => aggr + govPerDiemByZipCode(zipCode).meals,
    0,
  );

  const totalLodging = allRowsList.reduce(
    (aggr, { zipCode, mealsOnly }) =>
      aggr + (mealsOnly ? 0 : govPerDiemByZipCode(zipCode).lodging),
    0,
  );

  return (
    <div>
      {loggedUserId > 0 && (
        <CalendarHeader
          onDateChange={handleSetDateStarted}
          onSubmit={
            role === 'Manager' && isOwner == false && perDiem
              ? handlePendingPerDiemApproveToggle(perDiem)
              : handlePendingPerDiemEditToggle(makeNewPerDiem())
          }
          selectedDate={dateStarted}
          title={UserClientService.getCustomerName(user!)}
          weekStartsOn={6}
          submitLabel={
            role === 'Manager' && isOwner == false && perDiem
              ? 'Approve Per Diem'
              : 'Add Per Diem'
          }
          submitDisabled={loading || saving || addPerDiemDisabled}
          actions={[
            {
              label: 'Check lodging by zip code',
              onClick: handleToggleCheckLodging(true),
            },
            ...(onClose ? [{ label: 'Close', onClick: onClose }] : []),
          ]}
          asideTitle={
            isAnyManager ? (
              <Field
                label="Department"
                className="PerDiemManagerDepartment"
                name="managerDepartment"
                value={managerFilterDepartmentId}
                onChange={val => setManagerFilterDepartmentId(+val)}
                options={[
                  { label: OPTION_ALL, value: 0 },
                  ...managerDepartmentIds.map(id => {
                    const department = departments.find(d => d.id === id)!;
                    return {
                      label: TimesheetDepartmentClientService.getDepartmentName(
                        department,
                      ),
                      value: department.id,
                    };
                  }),
                ]}
                white
              />
            ) : undefined
          }
        >
          {!loading && (
            <>
              <Typography variant="subtitle2">
                All {isAnyManager ? 'Technicians' : 'Departments'} Total Meals:
                <strong> {usd(totalMeals)}</strong>
              </Typography>
              <Typography variant="subtitle2">
                All {isAnyManager ? 'Technicians' : 'Departments'} Total
                Lodging:
                <strong> {usd(totalLodging)}</strong>
              </Typography>
              <Typography variant="subtitle2">
                All {isAnyManager ? 'Technicians' : 'Departments'} Total Miles
                for Trips:
                <strong>
                  {' '}
                  {allRowsList.reduce((total: any, current, index, arr) => {
                    let tot = current.tripsList.reduce((acc: number, trip) => {
                      return acc + trip.distanceInMiles;
                    }, 0);

                    if (index == arr.length - 1) {
                      return (total + tot).toFixed(2);
                    }
                    return total + tot;
                  }, 0)}
                </strong>
              </Typography>
            </>
          )}
        </CalendarHeader>
      )}
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
          const isManager = !isOwner || role === 'Manager';
          const status = getStatus(dateApproved, dateSubmitted, isManager);
          const buttonDisabled =
            saving ||
            loading ||
            status.status === 'APPROVED' ||
            (isOwner && status.status !== 'PENDING_SUBMIT');
          const totalMeals = rowsList.reduce(
            (aggr, { zipCode }) => aggr + govPerDiemByZipCode(zipCode).meals,
            0,
          );
          const totalLodging = rowsList.reduce(
            (aggr, { zipCode, mealsOnly }) =>
              aggr + (mealsOnly ? 0 : govPerDiemByZipCode(zipCode).lodging),
            0,
          );
          return (
            <div key={id} className="PerDiemDepartment">
              <SectionBar
                title={
                  perDiem
                    ? ''
                    : isAnyManager && department
                    ? `Department: ${TimesheetDepartmentClientService.getDepartmentName(
                        department,
                      )}, User: ${ownerName}`
                    : `Department: ${TimesheetDepartmentClientService.getDepartmentName(
                        department!,
                      )}`
                }
                subtitle={
                  <>
                    <div>Total Meals: {usd(totalMeals)}</div>
                    <div>Total Lodging: {usd(totalLodging)}</div>
                    {rowsList.reduce((total: any, current, index, arr) => {
                      let tot = current.tripsList.reduce(
                        (acc: number, trip) => {
                          return acc + trip.distanceInMiles;
                        },
                        0,
                      );

                      if (index == arr.length - 1) {
                        return (
                          <div>
                            Total Miles: {(total + tot).toFixed(2)} miles
                          </div>
                        );
                      }
                      return total + tot;
                    }, 0)}
                    {+dateSubmitted[0] > 0 && (
                      <div>Submited Date: {formatDate(dateSubmitted)}</div>
                    )}
                    {+dateApproved[0] > 0 && (
                      <div>Approved Date: {formatDate(dateApproved)}</div>
                    )}
                    {approvedByName !== '' && (
                      <div>Approved By: {approvedByName}</div>
                    )}
                  </>
                }
                actions={
                  perDiem && role! != 'Manager'
                    ? []
                    : [
                        {
                          label: 'Delete',
                          variant: 'outlined',
                          onClick: handlePendingPerDiemDeleteToggle(entry),
                          disabled: buttonDisabled && role != 'Manager',
                        },
                        {
                          label: 'Edit',
                          variant: 'outlined',
                          onClick: handlePendingPerDiemEditToggle(entry),
                          disabled: buttonDisabled && role != 'Manager',
                        },
                        {
                          label: status.button,
                          onClick:
                            isAnyManager && status.status === 'PENDING_APPROVE'
                              ? handlePendingPerDiemApproveToggle(entry)
                              : handlePendingPerDiemSubmitToggle(entry),
                          disabled: buttonDisabled && role != 'Manager',
                        },
                      ]
                }
                footer={
                  notes.trim() ? (
                    <span>
                      <strong>Notes: </strong>
                      {notes}
                    </span>
                  ) : null
                }
                uncollapsable={!!perDiem}
              >
                <Calendar className="PerDiemCalendar">
                  {[...Array(7)].map((_, dayOffset) => {
                    const date = formatDateFns(addDays(dateStarted, dayOffset));
                    const rows = rowsList.filter(({ dateString }) =>
                      dateString.startsWith(date),
                    );
                    const isPerDiemRowUndefined =
                      (isAnyManager && !perDiem
                        ? managerPerDiemsOther[userId]
                        : filteredPerDiems
                      )
                        .reduce(
                          (aggr, { rowsList }) => [...aggr, ...rowsList],
                          [] as PerDiemRowType[],
                        )
                        .filter(({ dateString }) => dateString.startsWith(date))
                        .length === 0;
                    return (
                      <CalendarColumn
                        key={dayOffset}
                        date={date}
                        loading={loading}
                        loadingRows={2}
                      >
                        {!isPerDiemRowUndefined && rows.length === 0 && (
                          <CalendarCard
                            title=""
                            statusColor="white"
                            className="PerDiemOtherDepartmentCard"
                          >
                            <div className="PerDiemOtherDepartmentText">
                              Per Diem
                              <br />
                              in other
                              <br />
                              Department
                            </div>
                          </CalendarCard>
                        )}
                        {((isOwner && status.status === 'PENDING_SUBMIT') ||
                          (isManager && status.status !== 'APPROVED')) &&
                          isPerDiemRowUndefined && (
                            <Button
                              label="Add Per Diem Day"
                              compact
                              variant="text"
                              fullWidth
                              className="PerDiemButton"
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
                            tripsList,
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
                              <div className="PerDiemRow">
                                <strong>Zip Code: </strong>
                                {zipCode}
                              </div>
                              <div className="PerDiemRow">
                                <strong>Service Call Id: </strong>
                                {serviceCallId}
                              </div>
                              <div className="PerDiemRow">
                                <strong>Meals only: </strong>
                                {mealsOnly ? 'Yes' : 'No'}
                              </div>
                              {govPerDiems[zipCode] && (
                                <div className="PerDiemRow">
                                  <strong>Meals: </strong>
                                  {usd(govPerDiems[zipCode].meals)}
                                </div>
                              )}
                              {(govPerDiems[zipCode] || mealsOnly) && (
                                <div className="PerDiemRow">
                                  <strong>Lodging: </strong>
                                  {usd(
                                    mealsOnly
                                      ? 0
                                      : govPerDiems[zipCode].lodging,
                                  )}
                                </div>
                              )}
                              {tripsList.reduce(
                                (total: any, current, index, arr) => {
                                  if (index == arr.length - 1) {
                                    return (
                                      <div>
                                        <strong>Total Miles: </strong>
                                        {(
                                          total + current.distanceInMiles
                                        ).toFixed(2) + ' mi'}
                                      </div>
                                    );
                                  }
                                  return total + current.distanceInMiles;
                                },
                                0,
                              )}
                              <div className="PerDiemRow">
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
        <>
          <Modal open onClose={handlePendingPerDiemRowEditToggle(undefined)}>
            <Form
              title={`${
                pendingPerDiemRowEdit.id ? 'Edit' : 'Add'
              } Per Diem Row`}
              schema={SCHEMA_PER_DIEM_ROW}
              data={pendingPerDiemRowEdit}
              onClose={handlePendingPerDiemRowEditToggle(undefined)}
              onSave={handleSavePerDiemRow}
              disabled={saving}
            >
              {!!pendingPerDiemRowEdit.id && (
                <div className="PerDiemFormFooter">
                  <Button
                    label="Delete"
                    onClick={handlePendingPerDiemRowDeleteToggle(true)}
                    disabled={saving}
                    variant="outlined"
                    compact
                    className="PerDiemButton"
                  />
                </div>
              )}
              {/*<Button
                label="Add Trip"
                size="medium"
                variant="contained"
                compact
                onClick={handleTripEditOpen(makeNewTrip())}
              />*/}
              {/*
                <>
                  <SectionBar
                    title="Total Miles This Week"
                    footer={
                      totalTripMiles != undefined && totalTripMiles != 0.0
                        ? totalTripMiles?.toFixed(1) + ' miles'
                        : 'None'
                    }
                    small
                  />
                  <InfoTable
                    columns={[
                      { name: 'Origin' },
                      { name: 'Destination' },
                      {
                        name: 'Miles',
                        actions: [
                          {
                            label: 'Delete All Trips For This Week',
                            compact: false,
                            variant: 'outlined',
                            onClick: () => {
                              handleConfirmTripDeleteAll(true);
                            },
                          },
                        ],
                      },
                    ]}
                    data={
                      loading
                        ? makeFakeRows(3, 1)
                        : trips!
                            .getResultsList()
                            .filter((trip: Trip) => {
                              return (
                                trip.getPerDiemRowId() ==
                                pendingPerDiemRowEdit.perDiemId
                              );
                            })
                            .map((currentTrip: Trip) => {
                              setTotalTripDistance(
                                pendingPerDiemRowEdit.perDiemId,
                              );
                              return [
                                { value: currentTrip.getOriginAddress() },
                                { value: currentTrip.getDestinationAddress() },
                                {
                                  value: currentTrip
                                    .getDistanceInMiles()
                                    .toFixed(1),
                                  actions: [
                                    <IconButton
                                      key={currentTrip.getId() + 'edit'}
                                      size="small"
                                      onClick={() =>
                                        handleConfirmTripDelete(currentTrip)
                                      }
                                    >
                                      <DeleteIcon />
                                    </IconButton>,
                                  ],
                                },
                              ];
                            })
                    }
                    compact
                  />
                </>
                  */}
            </Form>
            {/*<TripInfoTable
              canAddTrips
              canDeleteTrips
              perDiemRowIds={[pendingPerDiemRowEdit.perDiemId]}
              loggedUserId={loggedUserId}
              onNoPerDiem={() => {
                setPendingPerDiemEdit(undefined);
                load();
              }}
            />*/}
          </Modal>
        </>
      )}
      {pendingPerDiemDelete && (
        <ConfirmDelete
          open
          onClose={handlePendingPerDiemDeleteToggle(undefined)}
          onConfirm={handleDeletePerDiem}
          kind="Per Diem"
          name={`for department ${TimesheetDepartmentClientService.getDepartmentName(
            pendingPerDiemDelete.department!,
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
      {pendingPerDiemSubmit && pendingPerDiemSubmit.rowsList.length == 0 && (
        <AlertPopup
          open
          onClose={handlePendingPerDiemSubmitToggle(undefined)}
          title="Error"
          label="Okay"
        >
          Empty per diems are not valid. Please add details to each day that you
          are requesting per diems for by clicking the ADD PER DIEM DAY button.
        </AlertPopup>
      )}
      {pendingPerDiemSubmit && pendingPerDiemSubmit.rowsList.length > 0 && (
        <Confirm
          open
          onClose={handlePendingPerDiemSubmitToggle(undefined)}
          onConfirm={submitPerDiem}
          title="Confirm Submit"
          submitLabel="Submit"
        >
          Are you sure you want to submit this Per Diem?
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
          Are you sure you want to approve this Per Diem?
        </Confirm>
      )}
      {checkLodging && (
        <Modal open onClose={handleToggleCheckLodging(false)} fullScreen>
          <LodgingByZipCode onClose={handleToggleCheckLodging(false)} />
        </Modal>
      )}
    </div>
  );
};
