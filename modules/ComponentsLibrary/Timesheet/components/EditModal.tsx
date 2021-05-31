import React, { FC, useCallback, useState } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {
  format,
  roundToNearestMinutes,
  parseISO,
  isBefore,
  addDays,
} from 'date-fns';
import { Button } from '../../Button';
import {
  TimesheetLine,
  TimesheetLineClient,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import {
  ServicesRenderedClient,
  ServicesRendered,
} from '@kalos-core/kalos-rpc/ServicesRendered';
import { Modal } from '../../Modal';
import { Form, Schema } from '../../Form';
import { useConfirm } from '../../ConfirmService';
import { ENDPOINT } from '../../../../constants';
import './editModal.less';
import { NULL_TIME_VALUE } from '../constants';
import { UserClientService } from '../../../../helpers';

const srClient = new ServicesRenderedClient(ENDPOINT);
const tslClient = new TimesheetLineClient(ENDPOINT);

type Entry = TimesheetLine.AsObject;

interface EntryWithDate extends Entry {
  date?: string;
  jobId?: number;
}

type Props = {
  entry: EntryWithDate;
  timesheetOwnerId: number;
  userId: number;
  timesheetAdministration: boolean;
  create?: boolean;
  role?: string;
  defaultDepartment?: number;
  action:
    | 'create'
    | 'update'
    | 'convert'
    | 'delete'
    | 'approve'
    | 'reject'
    | '';
  onSave: (
    entry: TimesheetLine.AsObject,
    action?: 'delete' | 'approve' | 'reject',
  ) => void;
  onClose: () => void;
};

const EditTimesheetModal: FC<Props> = ({
  entry,
  timesheetOwnerId,
  userId,
  timesheetAdministration,
  defaultDepartment,
  role,
  action,
  onSave,
  onClose,
}): JSX.Element => {
  console.log(defaultDepartment);
  const confirm = useConfirm();
  const [saving, setSaving] = useState<boolean>(false);
  const SCHEMA: Schema<EntryWithDate> = [
    [{ label: 'Job Number', name: 'jobId', type: 'eventId' }],
    [{ label: 'Brief Description', name: 'briefDescription' }],
    [
      {
        label: 'Class Code',
        name: 'classCodeId',
        type: 'classCode',
        required: true,
      },
    ],
    [
      {
        label: 'Department',
        name: 'departmentCode',
        type: 'department',
        required: true,
      },
    ],
    [
      { label: 'Date', name: 'date', type: 'mui-date', required: true },
      {
        label: 'Started',
        name: 'timeStarted',
        type: 'mui-time',
        required: true,
      },
      {
        label: 'Finished',
        name: 'timeFinished',
        type: 'mui-time',
        required: true,
      },
    ],
    [{ label: 'Notes', name: 'notes', multiline: true }],
  ];
  const { id = 0 } = entry;
  const data = { ...entry };

  if (defaultDepartment && action === 'create')
    data.departmentCode = defaultDepartment;
  if (action != 'create' && data.referenceNumber)
    data.jobId = parseInt(data.referenceNumber);
  console.log(data.jobId);
  if (data.timeStarted) {
    data.date = format(parseISO(data.timeStarted), 'yyyy-MM-dd');
    data.timeStarted = format(
      roundToNearestMinutes(parseISO(data.timeStarted), { nearestTo: 15 }),
      'yyyy-MM-dd HH:mm',
    );
    data.timeFinished = format(
      roundToNearestMinutes(parseISO(data.timeFinished), { nearestTo: 15 }),
      'yyyy-MM-dd HH:mm',
    );
  } else {
    data.date = format(new Date(), 'yyyy-MM-dd');
    data.timeStarted = format(
      roundToNearestMinutes(new Date(), { nearestTo: 15 }),
      'yyyy-MM-dd HH:mm',
    );
    data.timeFinished = format(
      roundToNearestMinutes(new Date(), { nearestTo: 15 }),
      'yyyy-MM-dd HH:mm',
    );
  }
  console.log(data);
  const handleUpdate = useCallback(
    async (data: EntryWithDate) => {
      setSaving(true);
      data.timeStarted = `${format(
        data.date ? parseISO(data.date) : new Date(),
        'yyyy-MM-dd',
      )} ${format(parseISO(data.timeStarted), 'HH:mm')}`;
      data.timeFinished = `${format(
        data.date ? parseISO(data.date) : new Date(),
        'yyyy-MM-dd',
      )} ${format(parseISO(data.timeFinished), 'HH:mm')}`;
      if (isBefore(parseISO(data.timeFinished), parseISO(data.timeStarted))) {
        console.log('caught a negative time, lets do something about it here');
      }
      delete data.date;
      const req = new TimesheetLine();
      req.setId(id);
      console.log(data);
      console.log(entry);
      //reference number,time started,timefinished,departmentcode, class code,brief desc, notes
      if (data.jobId) req.setReferenceNumber(data.jobId.toString());
      console.log(data.jobId);
      req.setTimeStarted(data.timeStarted);
      req.setTimeFinished(data.timeFinished);
      req.setDepartmentCode(data.departmentCode);
      req.setClassCodeId(data.classCodeId);
      req.setBriefDescription(data.briefDescription);
      req.setNotes(data.notes);

      req.setFieldMaskList([
        'ReferenceNumber',
        'TimeStarted',
        'TimeFinished',
        'DepartmentCode',
        'ClassCodeId',
        'BriefDescription',
        'Notes',
      ]);
      const result = await tslClient.Update(req);
      setSaving(false);
      onSave(result);
    },
    [setSaving, id, entry, onSave],
  );

  const handleCreate = useCallback(
    async (data: EntryWithDate) => {
      setSaving(true);
      data.timeStarted = `${format(
        data.date ? parseISO(data.date) : new Date(),
        'yyyy-MM-dd',
      )} ${format(parseISO(data.timeStarted), 'HH:mm')}`;
      data.timeFinished = `${format(
        data.date ? parseISO(data.date) : new Date(),
        'yyyy-MM-dd',
      )} ${format(parseISO(data.timeFinished), 'HH:mm')}`;
      delete data.date;
      console.log(data);
      console.log(entry);
      data.technicianUserId = timesheetOwnerId;
      data.servicesRenderedId = entry.servicesRenderedId;
      data.eventId = entry.eventId;
      const req = new TimesheetLine();
      if (data.jobId) req.setReferenceNumber(data.jobId.toString());
      console.log(data.jobId);
      req.setTimeStarted(data.timeStarted);
      req.setTimeFinished(data.timeFinished);
      req.setDepartmentCode(data.departmentCode);
      req.setClassCodeId(data.classCodeId);
      req.setBriefDescription(data.briefDescription);
      req.setNotes(data.notes);
      req.setTechnicianUserId(data.technicianUserId);
      req.setServicesRenderedId(data.servicesRenderedId);
      req.setEventId(data.eventId);
      req.setFieldMaskList([
        'ReferenceNumber',
        'TimeStarted',
        'TimeFinished',
        'DepartmentCode',
        'ClassCodeId',
        'BriefDescription',
        'Notes',
        'TechnicianUserId',
        'EventId',
        'ServicesRenderedId',
      ]);
      const result = await tslClient.Create(req);
      if (action === 'convert' && result.servicesRenderedId) {
        const reqSR = new ServicesRendered();
        reqSR.setId(result.servicesRenderedId);
        reqSR.setHideFromTimesheet(1);
        reqSR.setFieldMaskList(['HideFromTimesheet']);
        const srResult = await srClient.Update(reqSR);
      }
      setSaving(false);
      onSave(result);
    },
    [setSaving, entry, onSave, timesheetOwnerId, action],
  );

  const handleApprove = useCallback(async () => {
    confirm({
      catchOnCancel: true,
      description: `Are you sure you want to ${
        timesheetAdministration ? 'Approve' : 'Submit'
      } this Timesheet?`,
    }).then(async () => {
      const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      setSaving(true);
      const req = new TimesheetLine();
      req.setId(id);
      if (timesheetAdministration) {
        req.setAdminApprovalUserId(userId);
        req.setAdminApprovalDatetime(dateTime);
        req.setFieldMaskList(['AdminApprovalUserId', 'AdminApprovalDatetime']);
      } else {
        req.setUserApprovalDatetime(dateTime);
        req.setFieldMaskList(['UserApprovalDatetime']);
      }
      const result = await tslClient.Update(req);
      setSaving(false);
      onSave(result);
    });
  }, [id, userId, onSave, confirm, timesheetAdministration]);

  const handleProcess = useCallback(async () => {
    confirm({
      catchOnCancel: true,
      description: `Are you sure you want to Process this Timesheet?`,
    }).then(async () => {
      setSaving(true);
      const req = new TimesheetLine();
      req.setId(id);
      req.setPayrollProcessed(true);
      req.setFieldMaskList(['PayrollProcessed']);
      const result = await tslClient.Update(req);
      setSaving(false);
      onSave(result);
    });
  }, [id, confirm, onSave]);

  const handleRevoke = useCallback(async () => {
    confirm({
      catchOnCancel: true,
      description: `Are you sure you want to Revoke this Timesheet?`,
    }).then(async () => {
      setSaving(true);
      const req = new TimesheetLine();
      req.setId(id);
      req.setPayrollProcessed(false);
      req.setAdminApprovalDatetime(NULL_TIME_VALUE);
      req.setAdminApprovalUserId(0);
      req.setFieldMaskList([
        'AdminApprovalUserId',
        'AdminApprovalDatetime',
        'PayrollProcessed',
      ]);
      const result = await tslClient.Update(req);
      setSaving(false);
      onSave(result);
    });
  }, [id, confirm, onSave]);
  const handleDelete = useCallback(async () => {
    confirm({
      catchOnCancel: true,
      description: 'Are you sure you want to delete this Timecard?',
    })
      .then(async () => {
        setSaving(true);
        const req = new TimesheetLine();
        req.setId(id);
        const result = await tslClient.Delete(req);
        setSaving(false);
        onSave(result, 'delete');
      })
      .catch(() => {});
  }, [setSaving, entry]);

  const handleSave = useCallback(
    data => {
      switch (action) {
        case 'update':
          handleUpdate(data);
          break;
        case 'create':
          handleCreate(data);
          break;
        case 'convert':
          handleCreate(data);
          break;
        default:
          return false;
      }
    },
    [action, handleCreate, handleUpdate],
  );

  return (
    <Modal open onClose={onClose}>
      <Form<EntryWithDate>
        title="Edit Timesheet Line"
        schema={SCHEMA}
        data={data}
        onSave={handleSave}
        onClose={onClose}
        disabled={saving}
      >
        {!!entry?.eventId && <span>Source: {entry?.eventId}</span>}
        {action === 'update' && (
          <ButtonGroup
            className="TimesheetEditModalButtonGroup"
            disabled={saving}
          >
            <Button
              label={timesheetAdministration ? 'Approve' : 'Submit'}
              onClick={handleApprove}
              disabled={
                (timesheetAdministration && !entry.userApprovalDatetime) ||
                (role === 'Payroll' && timesheetOwnerId !== userId)
              }
            />
            {role === 'Payroll' && (
              <Button
                className="TimesheetEditModalDelete"
                label={'Process'}
                onClick={handleProcess}
                disabled={
                  !entry.adminApprovalDatetime ||
                  entry.adminApprovalUserId === 0
                }
              />
            )}
            <Button
              label="Delete"
              onClick={handleDelete}
              className="TimesheetEditModalDelete"
              disabled={role === 'Payroll'}
            />
            {role === 'Payroll' && (
              <Button
                label="Revoke"
                onClick={handleRevoke}
                className="TimesheetEditModalDelete"
                disabled={role !== 'Payroll' && !entry.adminApprovalDatetime}
              />
            )}
          </ButtonGroup>
        )}
      </Form>
    </Modal>
  );
};

export default EditTimesheetModal;
