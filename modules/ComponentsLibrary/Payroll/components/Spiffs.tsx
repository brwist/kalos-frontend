import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  getMonth,
  getYear,
  getDaysInMonth,
} from 'date-fns';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import { parseISO, subDays } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import { SpiffTool } from '../../../SpiffToolLogs/components/SpiffTool';
import { Form, Schema } from '../../../ComponentsLibrary/Form';
import { Option } from '../../../ComponentsLibrary/Field';
import {
  loadPendingSpiffs,
  TaskType,
  makeFakeRows,
  formatWeek,
  GetPendingSpiffConfig,
  timestamp,
  escapeText,
  SpiffTypeType,
  getRPCFields,
} from '../../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL, ENDPOINT } from '../../../../constants';

const TaskClientService = new TaskClient(ENDPOINT);

interface Props {
  employeeId: number;
  week: string;
  role: string;
  loggedUserId: number;
  departmentId: number;
  option: string;
}

export const Spiffs: FC<Props> = ({
  employeeId,
  week,
  role,
  loggedUserId,
  departmentId,
  option,
}) => {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [spiffs, setSpiffs] = useState<TaskType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<TaskType>();
  const [pendingAdd, setPendingAdd] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(new Date(startDay), 6));

  const [spiffTypes, setSpiffTypes] = useState<SpiffTypeType[]>([]);
  const init = useCallback(async () => {
    const { resultsList: spiffTypes } = (
      await TaskClientService.GetSpiffTypes()
    ).toObject();
    setSpiffTypes(spiffTypes);
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    const filter: GetPendingSpiffConfig = {
      page,
      technicianUserID: employeeId,
      role,
      departmentId,
      option: option === 'Monthly' ? 'Monthly' : 'Weekly',
    };
    if (option === 'Weekly') {
      console.log('we are weekly');
      Object.assign(filter, {
        startDate: format(startDay, 'yyyy-MM-dd'),
        endDate: format(endDay, 'yyyy-MM-dd'),
      });
      console.log(format(startDay, 'yyyy-MM-dd'), format(endDay, 'yyyy-MM-dd'));
    }
    if (option === 'Monthly') {
      console.log('we are monthly');
      const startMonth = getMonth(startDay) - 1;
      const startYear = getYear(startDay);
      const startDate = format(new Date(startYear, startMonth), 'yyy-MM-dd');
      const endDate = format(
        addDays(
          new Date(startYear, startMonth),
          getDaysInMonth(new Date(startYear, startMonth)) - 1,
        ),
        'yyy-MM-dd',
      );
      Object.assign(filter, {
        startDate: startDate,
        endDate: endDate,
      });
      console.log(startDate, endDate);
    }

    const { resultsList, totalCount } = await loadPendingSpiffs(filter);
    setSpiffs(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [page, employeeId, week, role, departmentId, option]);
  useEffect(() => {
    if (!initiated) {
      setInitiated(true);
      init();
    }
    load();
  }, [page, employeeId, week, initiated]);
  const handleTogglePendingView = useCallback(
    (pendingView?: TaskType) => () => setPendingView(pendingView),
    [],
  );
  const handleToggleAdd = useCallback(() => setPendingAdd(!pendingAdd), [
    pendingAdd,
  ]);
  const SPIFF_TYPES_OPTIONS: Option[] = spiffTypes.map(
    ({ type, id: value }) => ({ label: escapeText(type), value }),
  );
  const makeNewTask = useCallback(() => {
    const newTask = new Task();
    newTask.setTimeDue(timestamp());
    newTask.setDatePerformed(timestamp());
    if (SPIFF_TYPES_OPTIONS.length > 0) {
      newTask.setSpiffTypeId(+SPIFF_TYPES_OPTIONS[0].value);
    }
    return newTask.toObject();
  }, [SPIFF_TYPES_OPTIONS]);
  const handleSave = useCallback(
    async (data: TaskType) => {
      setSaving(true);
      const now = timestamp();
      const req = new Task();
      const fieldMaskList = [];
      req.setTimeCreated(now);
      req.setTimeDue(now);
      req.setPriorityId(2);
      req.setExternalCode('user');
      req.setCreatorUserId(loggedUserId);
      req.setBillableType('Spiff');
      req.setReferenceNumber('');
      req.setStatusId(1);
      fieldMaskList.push(
        'TimeCreated',
        'TimeDue',
        'PriorityId',
        'ExternalCode',
        'ExternalId',
        'CreatorUserId',
        'BillableType',
        'ReferenceNumber',
      );
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        req[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      req.setFieldMaskList(fieldMaskList);
      await TaskClientService.Create(req);
      setSaving(false);
      setPendingAdd(false);
      await load();
    },
    [loggedUserId, load],
  );
  const SCHEMA: Schema<TaskType> = [
    [
      {
        name: 'timeDue',
        label: 'Claim Date',
        readOnly: true,
        type: 'date',
      },
      {
        name: 'spiffAmount',
        label: 'Amount',
        startAdornment: '$',
        type: 'number',
        required: true,
      },
      { name: 'spiffJobNumber', label: 'Job #' },
      {
        name: 'datePerformed',
        label: 'Date Performed',
        type: 'date',
        required: true,
      },
    ],
    [
      {
        name: 'externalId',
        label: 'Employee',
        type: 'technician',
        required: true,
      },
      {
        name: 'spiffTypeId',
        label: 'Spiff Type',
        options: SPIFF_TYPES_OPTIONS,
        required: true,
      },
    ],
    [{ name: 'briefDescription', label: 'Description', multiline: true }],
  ];
  return (
    <div>
      <SectionBar
        title="Spiffs"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: setPage,
        }}
        actions={
          role === 'Manager' ? [{ label: 'Add', onClick: handleToggleAdd }] : []
        }
        fixedActions
      />
      <InfoTable
        columns={[{ name: 'Employee' }, { name: 'Week' }]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(2, 3)
            : spiffs.map(e => {
                return [
                  {
                    value: e.ownerName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: formatWeek(
                      format(
                        startOfWeek(parseISO(e.datePerformed), {
                          weekStartsOn: 6,
                        }),
                        'yyyy-MM-dd',
                      ),
                    ),
                    onClick: handleTogglePendingView(e),
                    actions: [
                      <IconButton
                        key="view"
                        onClick={handleTogglePendingView(e)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>,
                    ],
                  },
                ];
              })
        }
      />
      {pendingView && (
        <Modal open onClose={handleTogglePendingView(undefined)} fullScreen>
          <SpiffTool
            loggedUserId={loggedUserId}
            ownerId={pendingView.externalId}
            type="Spiff"
            needsManagerAction={role === 'Manager' ? true : false}
            needsPayrollAction={role === 'Payroll' ? true : false}
            needsAuditAction={role === 'Auditor' ? true : false}
            role={role}
            onClose={handleTogglePendingView(undefined)}
          />
        </Modal>
      )}
      {pendingAdd && (
        <Modal open onClose={handleToggleAdd}>
          <Form<TaskType>
            title="Add Spiff Request"
            schema={SCHEMA}
            onClose={handleToggleAdd}
            data={makeNewTask()}
            onSave={handleSave}
            disabled={saving}
          />
        </Modal>
      )}
    </div>
  );
};
