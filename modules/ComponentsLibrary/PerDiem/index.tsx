import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { Alert as AlertPopup } from '../Alert';
import sortBy from 'lodash/sortBy';
import {
  TimesheetDepartment,
  TimesheetDepartmentClient,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
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
  formatDate,
  usd,
  UserClientService,
  PerDiemClientService,
  MapClientService,
  TimesheetDepartmentClientService,
  makeSafeFormObject,
  TimesheetLineClientService,
} from '../../../helpers';
import { User } from '@kalos-core/kalos-rpc/User';
import { JOB_STATUS_COLORS, MEALS_RATE, OPTION_ALL } from '../../../constants';
import './styles.less';
import { NULL_TIME, ENDPOINT } from '@kalos-core/kalos-rpc/constants';
import { RoleType } from '../Payroll';
import { TimesheetLineClient } from '@kalos-core/kalos-rpc/TimesheetLine';

export interface Props {
  loggedUserId: number;
  onClose?: () => void;
  perDiem?: PerDiem;
  ownerId?: number;
}

export const SCHEMA_KALOS_MAP_INPUT_FORM: Schema<Trip> = [
  [
    {
      label: 'Origin Address',
      name: 'getOriginAddress',
      type: 'text',
    },
    {
      label: 'Destination Address',
      name: 'getDestinationAddress',
      type: 'text',
    },
    {
      name: 'getPerDiemRowId',
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

const SCHEMA_PER_DIEM_ROW: Schema<PerDiemRow> = [
  [
    {
      name: 'getId',
      type: 'hidden',
    },
  ],
  [
    {
      name: 'getPerDiemId',
      type: 'hidden',
    },
  ],
  [
    {
      label: 'Date',
      name: 'getDateString',
      type: 'date',
      readOnly: true,
    },
  ],
  [
    {
      label: 'Zip Code',
      name: 'getZipCode',
      required: true,
    },
  ],
  [
    {
      label: 'Service Call ID',
      name: 'getServiceCallId',
      type: 'eventId',
      required: true,
    },
  ],
  [
    {
      label: 'Notes',
      name: 'getNotes',
      multiline: true,
    },
  ],
  [
    {
      label: 'Meals Only',
      name: 'getMealsOnly',
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
  const [user, setUser] = useState<User>();
  const [owner, setOwner] = useState<User>();

  const [perDiems, setPerDiems] = useState<PerDiem[]>([]);
  const [managerPerDiems, setManagerPerDiems] = useState<PerDiem[]>([]);
  const [checkLodging, setCheckLodging] = useState<boolean>(false);
  const [managerPerDiemsOther, setManagerPerDiemsOther] = useState<{
    [key: number]: PerDiem[];
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
  const [pendingPerDiemSubmit, setPendingPerDiemSubmit] = useState<PerDiem>();
  const [pendingPerDiemApprove, setPendingPerDiemApprove] = useState<PerDiem>();
  const [pendingPerDiemEdit, setPendingPerDiemEdit] = useState<PerDiem>();
  const [loadedPerDiem, setLoadedPerDiem] = useState<PerDiem | undefined>(
    perDiem ? perDiem : undefined,
  );

  const [pendingPerDiemDelete, setPendingPerDiemDelete] = useState<PerDiem>();
  const [
    pendingPerDiemRowDelete,
    setPendingPerDiemRowDelete,
  ] = useState<boolean>(false);

  type RowURLs = {
    key: number;
    url: string;
  };
  const [jobLinkList, setJobLinkList] = useState<RowURLs[]>([]);
  const [departments, setDepartments] = useState<TimesheetDepartment[]>([]);
  const [dateStarted, setDateStarted] = useState<Date>(
    addDays(
      startOfWeek(
        loadedPerDiem ? parseISO(loadedPerDiem.getDateStarted()) : new Date(),
        {
          weekStartsOn: 6,
        },
      ),
      -0,
    ),
  );
  const [
    pendingPerDiemRowEdit,
    setPendingPerDiemRowEdit,
  ] = useState<PerDiemRow>();
  const [
    pendingPerDiemEditDuplicated,
    setPendingPerDiemEditDuplicated,
  ] = useState<boolean>(false);
  const initialize = useCallback(async () => {
    if (loadedPerDiem) {
      const year = +format(dateStarted, 'yyyy');
      const month = +format(dateStarted, 'M');
      const zipCodes = [loadedPerDiem]
        .reduce((aggr: PerDiemRow[], pd) => [...aggr, ...pd.getRowsList()], [])
        .map(pd => pd.getZipCode());
      const govPerDiems = await PerDiemClientService.loadGovPerDiem(
        zipCodes,
        year,
        month,
      );
      setGovPerDiems(govPerDiems);
      console.log('we got called');
      const rows = loadedPerDiem.getRowsList();
      const test = [];
      for (let j = 0; j < rows.length; j++) {
        const url = await TimesheetLineClientService.getReferenceURL(
          rows[j].getServiceCallId(),
        );
        const newObject = { key: rows[j].getId(), url };
        test.push(newObject);
      }
      setJobLinkList(test);
    }
    if (loggedUserId) {
      setInitializing(true);
      const user = await UserClientService.loadUserById(loggedUserId);
      setUser(user);
      const owner = await UserClientService.loadUserById(loggedUserId);
      setOwner(owner);
      //const depeartments = await TimesheetDepartmentClientService.loadTimeSheetDepartments() For some reason, this isn't loading data
      const client = new TimesheetDepartmentClient(ENDPOINT);
      const departmentReq = new TimesheetDepartment();
      departmentReq.setIsActive(1);
      const departments = (
        await client.BatchGet(departmentReq)
      ).getResultsList();
      setDepartments(
        sortBy(departments, TimesheetDepartmentClientService.getDepartmentName),
      );
      const role = user
        .getPermissionGroupsList()
        .find(p => p.getType() === 'role');
      if (role) {
        setRole(role.getName() as RoleType);
      }
      //This is where we get the department IDs from permission groups
      const groupDepartments = user
        .getPermissionGroupsList()
        .filter(group => group.getType() === 'department');
      const managerDepartments = departments.filter(
        manager => manager.getManagerId() === loggedUserId,
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
        setManagerDepartmentIds(managerDepartments.map(id => id.getId()));
      }
      setInitializing(false);
    }
    setInitialized(true);
  }, [dateStarted, loggedUserId, loadedPerDiem]);
  const load = useCallback(async () => {
    if (!loggedUserId) return;
    setLoading(true);
    const resultsList = (
      await PerDiemClientService.loadPerDiemByUserIdAndDateStarted(
        loggedUserId,
        formatDateFns(dateStarted),
      )
    ).getResultsList();

    let managerPerDiemsList = [] as PerDiem[];
    let managerPerDiemsOther = {};
    if (managerDepartmentIds.length > 0) {
      const managerPerDiems = await PerDiemClientService.loadPerDiemByDepartmentIdsAndDateStarted(
        managerDepartmentIds,
        formatDateFns(dateStarted),
      );
      managerPerDiemsList = managerPerDiems;
      managerPerDiemsOther = await PerDiemClientService.loadPerDiemByUserIdsAndDateStarted(
        managerPerDiemsList.map(user => user.getUserId()),
        formatDateFns(dateStarted),
      );
    }
    const year = +format(dateStarted, 'yyyy');
    const month = +format(dateStarted, 'M');
    const zipCodes = [...resultsList, ...managerPerDiemsList]
      .reduce((aggr: PerDiemRow[], pd) => [...aggr, ...pd.getRowsList()], [])
      .map(pd => pd.getZipCode());
    const govPerDiems = await PerDiemClientService.loadGovPerDiem(
      zipCodes,
      year,
      month,
    );
    if (!loadedPerDiem) {
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
    loadedPerDiem,
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
    (pendingPerDiemRowEdit?: PerDiemRow) => () => {
      setPendingPerDiemRowEdit(pendingPerDiemRowEdit);
    },
    [setPendingPerDiemRowEdit],
  );
  const handleSavePerDiem = useCallback(
    async (data: PerDiem) => {
      setPendingPerDiemEditDuplicated(false);
      if (
        managerPerDiems.find(
          loadedPerDiem =>
            loadedPerDiem.getUserId() === data.getUserId() &&
            loadedPerDiem.getDepartmentId() === data.getDepartmentId(),
        )
      ) {
        setPendingPerDiemEditDuplicated(true);
        return;
      }
      setSaving(true);
      const temp = makeSafeFormObject(data, new PerDiem());
      await PerDiemClientService.upsertPerDiem(temp);
      setLoadedPerDiem(temp);

      setPendingPerDiemEdit(undefined);
      setSaving(false);
      setInitialized(false);
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
    async (perDiemRow: PerDiemRow) => {
      setSaving(true);
      const temp = makeSafeFormObject(perDiemRow, new PerDiemRow());
      const req = new PerDiemRow();
      if (temp.getId() == 0) {
        await PerDiemClientService.CreateRow(temp);
      } else {
        await PerDiemClientService.UpdateRow(temp);
      }
      const tempPerDiem = loadedPerDiem;
      for (let i = 0; i < tempPerDiem!.getRowsList().length; i++) {
        if (tempPerDiem?.getRowsList()[i].getId() === temp.getId()) {
          const newRowList = tempPerDiem.getRowsList();
          newRowList[i] = temp;
          tempPerDiem.setRowsList(newRowList);
        }
      }
      setLoadedPerDiem(tempPerDiem);
      setPendingPerDiemRowEdit(undefined);
      setInitialized(false);
      setSaving(false);
      setLoaded(false);
    },
    [setSaving, loadedPerDiem, setPendingPerDiemRowEdit, setLoaded],
  );
  const handlePendingPerDiemDeleteToggle = useCallback(
    (pendingPerDiemDelete?: PerDiem) => () =>
      setPendingPerDiemDelete(pendingPerDiemDelete),
    [setPendingPerDiemDelete],
  );
  const handlePendingPerDiemRowDeleteToggle = useCallback(
    (pendingPerDiemRowDelete: boolean) => () =>
      setPendingPerDiemRowDelete(pendingPerDiemRowDelete),
    [setPendingPerDiemRowDelete],
  );
  const handlePendingPerDiemEditToggle = useCallback(
    (pendingPerDiemEdit?: PerDiem) => () => {
      setPendingPerDiemEditDuplicated(false);
      setPendingPerDiemEdit(pendingPerDiemEdit);
    },
    [setPendingPerDiemEdit, setPendingPerDiemEditDuplicated],
  );
  const handlePendingPerDiemSubmitToggle = useCallback(
    (pendingPerDiemSubmit?: PerDiem) => () =>
      setPendingPerDiemSubmit(pendingPerDiemSubmit),
    [setPendingPerDiemSubmit],
  );
  const handlePendingPerDiemApproveToggle = useCallback(
    (pendingPerDiemApprove?: PerDiem) => () =>
      setPendingPerDiemApprove(pendingPerDiemApprove),
    [setPendingPerDiemApprove],
  );
  const submitPerDiem = useCallback(async () => {
    if (pendingPerDiemSubmit) {
      const id = pendingPerDiemSubmit.getId();
      setPendingPerDiemSubmit(undefined);
      setSaving(true);
      await PerDiemClientService.submitPerDiemById(id);
      setSaving(false);
      setLoaded(false);
    }
  }, [setSaving, setLoaded, pendingPerDiemSubmit]);
  const approvePerDiem = useCallback(async () => {
    if (pendingPerDiemApprove) {
      const id = pendingPerDiemApprove.getId();
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
      const id = pendingPerDiemDelete.getId();
      setPendingPerDiemDelete(undefined);
      await PerDiemClientService.deletePerDiemById(id);
      setLoaded(false);
    }
  }, [pendingPerDiemDelete, setLoaded, setPendingPerDiemDelete]);
  const handleDeletePerDiemRow = useCallback(async () => {
    if (pendingPerDiemRowDelete && pendingPerDiemRowEdit) {
      const id = pendingPerDiemRowEdit.getId();
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
    const usedDepartments = perDiems.map(perDiem => perDiem.getDepartmentId());
    return departments
      .filter(id => !usedDepartments.includes(id.getId()))
      .map(d => ({
        value: d.getId(),
        label: TimesheetDepartmentClientService.getDepartmentName(d),
      }));
  }, [departments, perDiems]);
  const usedDepartments = useMemo(
    () => perDiems.map(departmentId => departmentId.getDepartmentId()),
    [perDiems],
  );
  const availableDapartments = useMemo(
    () =>
      sortBy(
        departments.filter(id => !usedDepartments.includes(id.getId())),
        TimesheetDepartmentClientService.getDepartmentName,
      ),
    [usedDepartments, departments],
  );

  const isAnyManager =
    departments
      .map(managerId => managerId.getManagerId())
      .includes(loggedUserId) || role === 'Manager';
  const isOwner = !isAnyManager;
  const addPerDiemDisabled = availableDapartments.length === 0;
  const SCHEMA_PER_DIEM: Schema<PerDiem> = pendingPerDiemEdit
    ? [
        [
          { name: 'getId', type: 'hidden' },
          { name: 'getDateStarted', type: 'hidden' },
        ],
        [
          {
            name: 'getUserId',
            label: 'Technician',
            type:
              isAnyManager && !pendingPerDiemEdit.getId()
                ? 'technician'
                : 'hidden',
            required: true,
          },
        ],
        [
          ...(pendingPerDiemEdit.getId()
            ? []
            : [
                {
                  name: 'getDepartmentId' as const,
                  label: 'Department',
                  options: departmentsOptions,
                  required: true,
                  type: isAnyManager ? ('hidden' as const) : ('text' as const),
                },
              ]),
        ],
        [
          {
            name: 'getNotes',
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
      const usedDepartments = perDiems.map(departmentId =>
        departmentId.getDepartmentId(),
      );
      req.setDepartmentId(
        usedDepartments.includes(user.getEmployeeDepartmentId())
          ? (availableDapartments[0] || [{}]).getId()
          : departments
              .map(id => id.getId())
              .includes(user.getEmployeeDepartmentId())
          ? user.getEmployeeDepartmentId()
          : departments[0].getId(),
      );
    }
    return req;
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
      return req;
    },
    [],
  );
  if (initializing) return <Loader />;
  const filteredPerDiems = loadedPerDiem
    ? [loadedPerDiem]
    : isAnyManager
    ? managerPerDiems.filter(departmentId => {
        if (managerFilterDepartmentId === 0) return true;
        return managerFilterDepartmentId === departmentId.getDepartmentId();
      })
    : perDiems;

  const allRowsList = filteredPerDiems.reduce(
    (aggr, pd) => [...aggr, ...pd.getRowsList()],
    [] as PerDiemRow[],
  );
  const totalMeals = allRowsList.reduce(
    (aggr, pdr) => aggr + govPerDiemByZipCode(pdr.getZipCode()).meals,
    0,
  );
  const totalLodging = allRowsList.reduce(
    (aggr, pdr) =>
      aggr +
      (pdr.getMealsOnly() ? 0 : govPerDiemByZipCode(pdr.getZipCode()).lodging),
    0,
  );
  return (
    <div>
      {loggedUserId > 0 && (
        <CalendarHeader
          onDateChange={handleSetDateStarted}
          onSubmit={
            role === 'Manager' && isOwner == false && loadedPerDiem
              ? handlePendingPerDiemApproveToggle(perDiem)
              : handlePendingPerDiemEditToggle(makeNewPerDiem())
          }
          selectedDate={dateStarted}
          title={UserClientService.getCustomerName(user!)}
          weekStartsOn={6}
          submitLabel={
            role === 'Manager' && isOwner == false && loadedPerDiem
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
                    const department = departments.find(d => d.getId() === id)!;
                    return {
                      label: TimesheetDepartmentClientService.getDepartmentName(
                        department,
                      ),
                      value: department.getId(),
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
                    let tot = current
                      .getTripsList()
                      .reduce((acc: number, trip) => {
                        return acc + trip.getDistanceInMiles();
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
          const isManager = !isOwner || role === 'Manager';
          const status = getStatus(
            entry.getDateApproved(),
            entry.getDateSubmitted(),
            isManager,
          );
          const buttonDisabled =
            saving ||
            loading ||
            status.status === 'APPROVED' ||
            (isOwner && status.status !== 'PENDING_SUBMIT');
          const totalMeals = entry
            .getRowsList()
            .reduce(
              (aggr, pdr) => aggr + govPerDiemByZipCode(pdr.getZipCode()).meals,
              0,
            );
          const totalLodging = entry
            .getRowsList()
            .reduce(
              (aggr, pdr) =>
                aggr +
                (pdr.getMealsOnly()
                  ? 0
                  : govPerDiemByZipCode(pdr.getZipCode()).lodging),
              0,
            );
          return (
            <div key={entry.getId()} className="PerDiemDepartment">
              <SectionBar
                title={
                  perDiem
                    ? ''
                    : isAnyManager && entry.getDepartment() != undefined
                    ? `Department: ${TimesheetDepartmentClientService.getDepartmentName(
                        entry.getDepartment()!,
                      )}, User: ${entry.getOwnerName()}`
                    : `Department: ${TimesheetDepartmentClientService.getDepartmentName(
                        entry.getDepartment()!,
                      )}`
                }
                subtitle={
                  <>
                    <div>Total Meals: {usd(totalMeals)}</div>
                    <div>Total Lodging: {usd(totalLodging)}</div>
                    <strong>
                      {' '}
                      Employee Address:
                      {owner?.getAddress()
                        ? ` ${owner!.getAddress()} `
                        : ' No Address '}
                      {owner?.getCity() ? ` ${owner!.getCity()} ` : ' No City '}
                      {owner?.getState()
                        ? ` ${owner!.getState()} `
                        : ' No State '}
                      {owner?.getZip()
                        ? ` ${owner!.getZip()} `
                        : ' No ZipCode '}
                    </strong>
                    {entry
                      .getRowsList()
                      .reduce((total: any, current, index, arr) => {
                        let tot = current
                          .getTripsList()
                          .reduce((acc: number, trip) => {
                            return acc + trip.getDistanceInMiles();
                          }, 0);

                        if (index == arr.length - 1) {
                          return (
                            <div>
                              Total Miles: {(total + tot).toFixed(2)} miles
                            </div>
                          );
                        }
                        return total + tot;
                      }, 0)}
                    {+entry.getDateSubmitted()[0] > 0 && (
                      <div>
                        Submited Date: {formatDate(entry.getDateSubmitted())}
                      </div>
                    )}
                    {+entry.getDateApproved()[0] > 0 && (
                      <div>
                        Approved Date: {formatDate(entry.getDateApproved())}
                      </div>
                    )}
                    {entry.getApprovedByName() !== '' && (
                      <div>Approved By: {entry.getApprovedByName()}</div>
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
                  entry.getNotes().trim() ? (
                    <span>
                      <strong>Notes: </strong>
                      {entry.getNotes()}
                    </span>
                  ) : null
                }
                uncollapsable={!!perDiem}
              >
                <Calendar className="PerDiemCalendar">
                  {[...Array(7)].map((_, dayOffset) => {
                    const date = formatDateFns(addDays(dateStarted, dayOffset));
                    const rows = entry
                      .getRowsList()
                      .filter(dateString =>
                        dateString.getDateString().startsWith(date),
                      );
                    const isPerDiemRowUndefined =
                      (isAnyManager && !perDiem
                        ? managerPerDiemsOther[entry.getUserId()]
                        : filteredPerDiems
                      )
                        .reduce(
                          (aggr: PerDiemRow[], pd) => [
                            ...aggr,
                            ...pd.getRowsList(),
                          ],
                          [],
                        )
                        .filter(pdr => pdr.getDateString().startsWith(date))
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
                                makeNewPerDiemRow(entry.getId(), date),
                              )}
                              size="xsmall"
                              disabled={loading || saving}
                            />
                          )}
                        {rows.map(entry => {
                          const url = TimesheetLineClientService.getReferenceURL(
                            entry.getServiceCallId(),
                          );
                          return (
                            <CalendarCard
                              key={entry.getId()}
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
                                {entry.getZipCode()}
                              </div>
                              <div
                                className="PerDiemRow"
                                onClick={event => {
                                  event.stopPropagation();
                                  event.preventDefault();
                                  jobLinkList.length > 0
                                    ? window.open(
                                        jobLinkList[
                                          jobLinkList.findIndex(
                                            i => i.key === entry.getId(),
                                          )
                                        ].url,
                                      )
                                    : null;
                                }}
                              >
                                <strong>Service Call Id: </strong>
                                {entry.getServiceCallId()}
                              </div>
                              <div className="PerDiemRow">
                                <strong>Meals only: </strong>
                                {entry.getMealsOnly() ? 'Yes' : 'No'}
                              </div>
                              {govPerDiems[entry.getZipCode()] && (
                                <div className="PerDiemRow">
                                  <strong>Meals: </strong>
                                  {usd(govPerDiems[entry.getZipCode()].meals)}
                                </div>
                              )}
                              {(govPerDiems[entry.getZipCode()] ||
                                entry.getMealsOnly()) && (
                                <div className="PerDiemRow">
                                  <strong>Lodging: </strong>
                                  {usd(
                                    entry.getMealsOnly()
                                      ? 0
                                      : govPerDiems[entry.getZipCode()].lodging,
                                  )}
                                </div>
                              )}
                              {entry
                                .getTripsList()
                                .reduce((total: any, current, index, arr) => {
                                  if (index == arr.length - 1) {
                                    return (
                                      <div>
                                        <strong>Total Miles: </strong>
                                        {(
                                          total + current.getDistanceInMiles()
                                        ).toFixed(2) + ' mi'}
                                      </div>
                                    );
                                  }
                                  return total + current.getDistanceInMiles();
                                }, 0)}
                              <div className="PerDiemRow">
                                <strong>Notes: </strong>
                                {entry.getNotes()}
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
            title={`${pendingPerDiemEdit.getId() ? 'Edit' : 'Add'} Per Diem`}
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
                pendingPerDiemRowEdit.getId() ? 'Edit' : 'Add'
              } Per Diem Row`}
              schema={SCHEMA_PER_DIEM_ROW}
              data={pendingPerDiemRowEdit}
              onClose={handlePendingPerDiemRowEditToggle(undefined)}
              onSave={handleSavePerDiemRow}
              disabled={saving}
            >
              {!!pendingPerDiemRowEdit.getId() && (
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
            pendingPerDiemDelete.getDepartment()!,
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
      {pendingPerDiemSubmit && pendingPerDiemSubmit.getRowsList().length == 0 && (
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
      {pendingPerDiemSubmit && pendingPerDiemSubmit.getRowsList().length > 0 && (
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
