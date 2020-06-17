import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { format } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import FlashOff from '@material-ui/icons/FlashOff';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { PlainForm, Schema, Option } from '../PlainForm';
import { Confirm } from '../Confirm';
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
import { OPTION_ALL } from '../../../constants';

interface Props {}

const COLUMNS: Columns = [
  { name: 'Technician' },
  { name: 'Department' },
  { name: 'Week' },
];

type FormData = Pick<PerDiemType, 'dateStarted' | 'departmentId' | 'userId'>;

const initialFormData: FormData = {
  dateStarted: OPTION_ALL,
  departmentId: 0,
  userId: 0,
};

export const PerDiemsNeedsAuditing: FC<Props> = () => {
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
    const { departmentId, userId, dateStarted } = formData;
    const { resultsList, totalCount } = await loadPerDiemsNeedsAuditing(
      departmentId ? departmentId : undefined,
      userId ? userId : undefined,
      dateStarted !== OPTION_ALL ? dateStarted : undefined,
    );
    setPerDiems(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, formData]);
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
    setFormData(initialFormData);
    setFormKey(formKey + 1);
    setLoaded(false);
  }, [setFormData, setFormKey, formKey, setLoaded]);
  const handleSearch = useCallback(() => setLoaded(false), []);
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
    ? makeFakeRows(3, 5)
    : perDiems.map(entry => {
        const { dateStarted, ownerName, department } = entry;
        const date = new Date(dateStarted);
        return [
          { value: ownerName },
          { value: getDepartmentName(department) },
          {
            value: `Week of ${format(date, 'MMMM')}, ${format(date, 'do')}`,
            actions: [
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
      <SectionBar title="Per Diems Needs Auditing" />
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
          Are you sure, this Per Diem no longer needs auditing?
        </Confirm>
      )}
    </div>
  );
};
