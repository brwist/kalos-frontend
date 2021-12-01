import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  getMonth,
  getYear,
  getDaysInMonth,
} from 'date-fns';
import {
  TaskClient,
  Task,
  SpiffType,
  GetPendingSpiffConfig,
} from '@kalos-core/kalos-rpc/Task';
import { parseISO, subDays } from 'date-fns/esm';

import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import { SpiffTool } from '../../../SpiffToolLogs/components/SpiffTool';
import { Form, Schema } from '../../../ComponentsLibrary/Form';
import { Option } from '../../../ComponentsLibrary/Field';
import { Button } from '../../Button';
import { SpiffToolAdminAction } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';

import { User } from '@kalos-core/kalos-rpc/User';
import {
  makeFakeRows,
  formatWeek,
  timestamp,
  escapeText,
  getRPCFields,
  EventClientService,
  makeSafeFormObject,
} from '../../../../helpers';
import {
  ROWS_PER_PAGE,
  OPTION_ALL,
  ENDPOINT,
  NULL_TIME,
} from '../../../../constants';

const TaskClientService = new TaskClient(ENDPOINT);

interface Props {
  employeeId: number;
  week: string;
  role: string;
  loggedUserId: number;
  departmentId: number;
}

export const Spiffs: FC<Props> = ({
  employeeId,
  week,
  role,
  loggedUserId,
  departmentId,
}) => {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [spiffs, setSpiffs] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<Task>();
  const [pendingAdd, setPendingAdd] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(new Date(startDay), 7));
  const [toggleButton, setToggleButton] = useState<boolean>(false);
  const [spiffTypes, setSpiffTypes] = useState<SpiffType[]>([]);

  const load = useCallback(async () => {
    setLoading(true); /*
    const filter: GetPendingSpiffConfig = {
      page,
      technicianUserID: employeeId,
      role,
      departmentId,
      //processed: toggleButton === true ? true : undefined,
    };

    Object.assign(filter, {
      startDate: '0001-01-01',
      endDate: format(endDay, 'yyyy-MM-dd'),
    });
    if (week !== OPTION_ALL) {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 7), 'yyyy-MM-dd'),
      });
    }
   const results = await TaskClientService.loadPendingSpiffs(filter);
    console.log(filter);*/

    const req = new Task();
    req.setPageNumber(page);
    req.setIsActive(true);
    req.setOrderBy('date_performed');
    req.setOrderDir('DESC');
    req.setGroupBy('external_id');
    if (departmentId) {
      const u = new User();
      u.setEmployeeDepartmentId(departmentId);
      req.setSearchUser(u);
    }
    if (role === 'Manager' && toggleButton == false) {
      //req.setAdminActionId(0);
      req.setFieldMaskList(['AdminActionId']);
    }
    if (role === 'Manager' && toggleButton == true) {
      req.setAdminActionId(0);
      req.addNotEquals('AdminActionId');
    }
    if (week) {
      if (week != OPTION_ALL) {
        req.setDateRangeList([
          '>=',
          week,
          '<',
          format(addDays(new Date(week), 7), 'yyyy-MM-dd'),
        ]);
        req.setDateTargetList(['date_performed']);
      } else {
        req.setDateRangeList([
          '>=',
          '0001-01-01',
          '<',
          format(endDay, 'yyyy-MM-dd'),
        ]);
        req.setDateTargetList(['date_performed']);
      }
    }

    if (role === 'Payroll' && toggleButton == false) {
      req.setAdminActionId(0);
      req.setPayrollProcessed(true);
      req.setNotEqualsList(['AdminActionId', 'PayrollProcessed']);
      //req.setFieldMaskList(['PayrollProcessed']);
      const action = new SpiffToolAdminAction();
      action.setStatus(1);
      req.setSearchAction(action);
    }
    if (role === 'Payroll' && toggleButton == true) {
      req.setPayrollProcessed(false);
      req.setNotEqualsList(['PayrollProcessed']);
    }
    if (role === 'Auditor') {
      req.setNotEqualsList(['AdminActionId']);
      req.setFieldMaskList(['NeedsAuditing']);
      req.setNeedsAuditing(true);
    }
    if (employeeId) {
      req.setExternalId(employeeId);
    }
    req.setBillableType('Spiff');
    const results = await TaskClientService.BatchGet(req);
    const resultsList = results.getResultsList();
    const totalCount = results.getTotalCount();
    console.log('we are in load');
    setSpiffs(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [page, employeeId, week, role, toggleButton, departmentId, endDay]);
  const init = useCallback(async () => {
    const spiffTypes = await (
      await TaskClientService.GetSpiffTypes()
    ).getResultsList();
    setSpiffTypes(spiffTypes);
    load();
  }, [load]);
  useEffect(() => {
    if (!initiated) {
      setInitiated(true);
      init();
    }
  }, [page, employeeId, week, initiated, init]);

  const handleTogglePendingView = useCallback(
    (pendingView?: Task) => () => setPendingView(pendingView),
    [],
  );
  const handleToggleAdd = useCallback(
    () => setPendingAdd(!pendingAdd),
    [pendingAdd],
  );
  const handleToggleButton = useCallback(() => {
    setToggleButton(!toggleButton);
    setPage(0);
  }, [toggleButton]);

  const SPIFF_TYPES_OPTIONS: Option[] = spiffTypes.map(type => ({
    label: escapeText(type.getType()),
    value: type.getId(),
  }));
  const makeNewTask = useCallback(() => {
    const newTask = new Task();
    newTask.setTimeDue(timestamp());
    newTask.setDatePerformed(timestamp());
    if (SPIFF_TYPES_OPTIONS.length > 0) {
      newTask.setSpiffTypeId(+SPIFF_TYPES_OPTIONS[0].value);
    }
    return newTask;
  }, [SPIFF_TYPES_OPTIONS]);
  const handleSave = useCallback(
    async (data: Task) => {
      setSaving(true);
      const now = timestamp();
      const req = makeSafeFormObject(data, new Task());
      req.setTimeCreated(now);
      req.setTimeDue(now);
      req.setPriorityId(2);
      req.setExternalCode('user');
      req.setCreatorUserId(loggedUserId);
      req.setBillableType('Spiff');
      req.setStatusId(1);
      //req.addFieldMask('AdminActionId');
      let tempEvent;
      try {
        tempEvent = await EventClientService.LoadEventByServiceCallID(
          parseInt(req.getSpiffJobNumber()),
        );
      } catch (err) {
        console.error(
          `An error occurred while loading event by server: ${err}`,
        );
        return;
      }
      if (!tempEvent) {
        console.error(
          `No tempEvent variable was set to set spiff address with, aborting save.`,
        );
        return;
      }
      req.setSpiffAddress(
        tempEvent.getProperty()?.getAddress() === undefined
          ? tempEvent.getCustomer()?.getAddress() === undefined
            ? ''
            : tempEvent.getCustomer()!.getAddress()
          : tempEvent.getProperty()!.getAddress(),
      );

      req.setSpiffJobNumber(tempEvent.getLogJobNumber());
      req.setFieldMaskList([]);
      const res = await TaskClientService.Create(req);
      const id = res.getId();
      const updateReq = new Task();
      updateReq.setId(id);
      updateReq.setFieldMaskList(['AdminActionId']);
      updateReq.setAdminActionId(0);
      await TaskClientService.Update(updateReq);
      setSaving(false);
      setPendingAdd(false);
      await load();
    },
    [loggedUserId, load],
  );
  const SCHEMA: Schema<Task> = [
    [
      {
        name: 'getTimeDue',
        label: 'Claim Date',
        readOnly: true,
        type: 'date',
      },
      {
        name: 'getSpiffAmount',
        label: 'Amount',
        startAdornment: '$',
        type: 'number',
        required: true,
      },
      {
        name: 'getSpiffJobNumber',
        label: 'Job #',
        type: 'eventId',
        required: true,
      },
      {
        name: 'getDatePerformed',
        label: 'Date Performed',
        type: 'date',
        required: true,
      },
    ],
    [
      {
        name: 'getExternalId',
        label: 'Employee',
        type: 'technician',
        required: true,
      },
      {
        name: 'getSpiffTypeId',
        label: 'Spiff Type',
        options: SPIFF_TYPES_OPTIONS,
        required: true,
      },
    ],
    [{ name: 'getBriefDescription', label: 'Description', multiline: true }],
  ];
  return (
    <div>
      <SectionBar
        title="Spiffs"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: setPage,
        }}
        actions={
          role === 'Manager'
            ? [{ label: 'Add Spiff', onClick: handleToggleAdd }]
            : []
        }
        fixedActions
      />
      {role && (
        <Button
          label={
            toggleButton === false && role == 'Payroll'
              ? 'Search For Processed Spiffs'
              : toggleButton === false && role === 'Manager'
              ? 'Search for Approved Spiffs'
              : toggleButton === true && role === 'Manager'
              ? 'Search for Unapproved Spiffs'
              : 'Search For Unprocessed'
          }
          onClick={() => handleToggleButton()}
        ></Button>
      )}
      <InfoTable
        columns={[{ name: 'Employee' }, { name: 'Week' }]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(2, 3)
            : spiffs.map(e => {
                return [
                  {
                    value: e.getOwnerName(),
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: formatWeek(
                      format(
                        startOfWeek(parseISO(e.getDatePerformed()), {
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
            ownerId={pendingView.getExternalId()}
            type="Spiff"
            needsManagerAction={role === 'Manager' ? true : false}
            needsPayrollAction={role === 'Payroll' ? true : false}
            needsAuditAction={role === 'Auditor' ? true : false}
            toggle={toggleButton}
            role={role}
            onClose={handleTogglePendingView(undefined)}
          />
        </Modal>
      )}
      {pendingAdd && (
        <Modal open onClose={handleToggleAdd}>
          <Form<Task>
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
