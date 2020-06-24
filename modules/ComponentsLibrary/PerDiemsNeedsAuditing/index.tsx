import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import sortBy from 'lodash/sortBy';
import { format } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import FlashOff from '@material-ui/icons/FlashOff';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { PlainForm, Schema, Option } from '../PlainForm';
import { Confirm } from '../Confirm';
import { Modal } from '../Modal';
import { PerDiemComponent, getStatus } from '../PerDiem';
import {
  loadPerDiemsNeedsAuditing,
  updatePerDiemNeedsAudit,
  PerDiemType,
  makeFakeRows,
  getDepartmentName,
  getCustomerName,
  getWeekOptions,
  loadTimesheetDepartments,
  TimesheetDepartmentType,
  loadTechnicians,
  UserType,
} from '../../../helpers';
import { OPTION_ALL, ROWS_PER_PAGE } from '../../../constants';

interface Props {}

const COLUMNS: Columns = [
  { name: 'Technician' },
  { name: 'Department' },
  { name: 'Week' },
  { name: 'Status' },
];

type FormData = Pick<
  PerDiemType,
  'dateStarted' | 'departmentId' | 'userId' | 'needsAuditing'
>;

const initialFormData: FormData = {
  needsAuditing: true,
  dateStarted: OPTION_ALL,
  departmentId: 0,
  userId: 0,
};

const formatWeek = (date: string) => {
  const d = new Date(date);
  return `Week of ${format(d, 'MMMM')}, ${format(d, 'do')}`;
};

export const useStyles = makeStyles(theme => ({
  modalBar: {
    marginBottom: theme.spacing(-2),
  },
  status: {
    display: 'inline-block',
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginRight: theme.spacing(),
    borderRadius: '50%',
    verticalAlign: 'middle',
  },
}));

export const PerDiemsNeedsAuditing: FC<Props> = () => {
  const classes = useStyles();
  const weekOptions = useMemo(
    () => [
      { label: OPTION_ALL, value: OPTION_ALL },
      ...getWeekOptions(52, 0, -1),
    ],
    [],
  );
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [perDiemViewed, setPerDiemViewed] = useState<PerDiemType>();
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [technicians, setTechnicians] = useState<UserType[]>([]);
  const [pendingAudited, setPendingAudited] = useState<PerDiemType>();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formKey, setFormKey] = useState<number>(0);
  const initialize = useCallback(async () => {
    const technicians = await loadTechnicians();
    setTechnicians(technicians);
    const departments = await loadTimesheetDepartments();
    setDepartments(sortBy(departments, getDepartmentName));
    setInitialized(true);
  }, [setInitialized, setDepartments]);
  const load = useCallback(async () => {
    setLoading(true);
    const { departmentId, userId, dateStarted, needsAuditing } = formData;
    const { resultsList, totalCount } = await loadPerDiemsNeedsAuditing(
      page,
      needsAuditing,
      departmentId ? departmentId : undefined,
      userId ? userId : undefined,
      dateStarted !== OPTION_ALL ? dateStarted : undefined,
    );
    setPerDiems(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, formData, page]);
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
    if (initialized && !loaded) {
      setLoaded(true);
      load();
    }
  }, [initialized, initialize, loaded, setLoaded, load]);
  const handlePendingAuditedToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPendingAudited(perDiem),
    [setPendingAudited],
  );
  const handlePerDiemViewedToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPerDiemViewed(perDiem),
    [setPerDiemViewed],
  );
  const handleAudit = useCallback(async () => {
    if (pendingAudited) {
      const { id } = pendingAudited;
      setLoading(true);
      setPendingAudited(undefined);
      await updatePerDiemNeedsAudit(id);
      setLoaded(false);
    }
  }, [pendingAudited, setLoading, setPendingAudited, setLoaded]);
  const handleReset = useCallback(() => {
    setPage(0);
    setFormData(initialFormData);
    setFormKey(formKey + 1);
    setLoaded(false);
  }, [setFormData, setFormKey, formKey, setLoaded, setPage]);
  const handleSearch = useCallback(() => {
    setPage(0);
    setLoaded(false);
  }, [setPage]);
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const techniciansOptions: Option[] = useMemo(
    () => [
      { label: OPTION_ALL, value: 0 },
      ...technicians.map(el => ({ label: getCustomerName(el), value: el.id })),
    ],
    [technicians],
  );
  const departmentsOptions: Option[] = useMemo(
    () => [
      { label: OPTION_ALL, value: 0 },
      ...departments.map(el => ({
        label: getDepartmentName(el),
        value: el.id,
      })),
    ],
    [departments],
  );
  const SCHEMA: Schema<FormData> = [
    [
      {
        name: 'needsAuditing',
        label: 'Needs Auditing',
        type: 'checkbox',
      },
      {
        name: 'userId',
        label: 'Technician',
        options: techniciansOptions,
      },
      {
        name: 'departmentId',
        label: 'Department',
        options: departmentsOptions,
      },
      {
        name: 'dateStarted',
        label: 'Week',
        options: weekOptions,
        actions: [
          {
            label: 'Reset',
            variant: 'outlined',
            onClick: handleReset,
          },
          {
            label: 'Search',
            onClick: handleSearch,
          },
        ],
      },
    ],
  ];
  const data: Data = loading
    ? makeFakeRows(4, 5)
    : perDiems.map(entry => {
        const {
          dateStarted,
          ownerName,
          department,
          dateApproved,
          dateSubmitted,
        } = entry;
        const { text, color } = getStatus(dateApproved, dateSubmitted, false);
        return [
          { value: ownerName },
          { value: getDepartmentName(department) },
          { value: formatWeek(dateStarted) },
          {
            value: (
              <>
                <div
                  className={classes.status}
                  style={{ backgroundColor: color }}
                />
                {text}
              </>
            ),
            actions: [
              <IconButton
                key="view"
                size="small"
                onClick={handlePerDiemViewedToggle(entry)}
              >
                <Visibility />
              </IconButton>,
              <IconButton
                key="audit"
                size="small"
                onClick={handlePendingAuditedToggle(entry)}
              >
                <FlashOff />
              </IconButton>,
            ],
          },
        ];
      });
  return (
    <div>
      <SectionBar
        title="Per Diems Auditing"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
      />
      <PlainForm
        key={formKey}
        schema={SCHEMA}
        data={formData}
        onChange={setFormData}
      />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
      {pendingAudited && (
        <Confirm
          title="Confirm Auditing"
          open
          onClose={handlePendingAuditedToggle()}
          onConfirm={handleAudit}
          // submitLabel="Custom label"
        >
          Are you sure, Per Diem of <strong>{pendingAudited.ownerName}</strong>{' '}
          for department{' '}
          <strong>{getDepartmentName(pendingAudited.department)}</strong> for{' '}
          <strong>{formatWeek(pendingAudited.dateStarted)}</strong> no longer
          needs auditing?
        </Confirm>
      )}
      {perDiemViewed && (
        <Modal open onClose={handlePerDiemViewedToggle(undefined)} fullScreen>
          <SectionBar
            title={`Per Diem: ${perDiemViewed.ownerName}`}
            subtitle={
              <>
                Department: {getDepartmentName(perDiemViewed.department)}
                <br />
                {formatWeek(perDiemViewed.dateStarted)}
              </>
            }
            actions={[
              { label: 'Close', onClick: handlePerDiemViewedToggle(undefined) },
            ]}
            fixedActions
            className={classes.modalBar}
          />
          <PerDiemComponent
            onClose={handlePerDiemViewedToggle(undefined)}
            perDiem={perDiemViewed}
          />
        </Modal>
      )}
    </div>
  );
};
