import React, { FC, useCallback, useState } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { format, roundToNearestMinutes, parseISO, isBefore } from 'date-fns';
import { Button } from '../../Button';
import {
  TimesheetLine,
  TimesheetLineClient,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { Modal } from '../../Modal';
import { Form, Schema } from '../../Form';
import { useConfirm } from '../../ConfirmService';
import { ENDPOINT } from '../../../../constants';
import './editModal.less';
import { NULL_TIME_VALUE } from '../constants';
import { makeSafeFormObject } from '../../../../helpers';

const tslClient = new TimesheetLineClient(ENDPOINT);

type Entry = TimesheetLine;

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
    entry: TimesheetLine,
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
  const confirm = useConfirm();
  const [saving, setSaving] = useState<boolean>(false);
  const SCHEMA: Schema<EntryWithDate> = [
    [{ label: 'Job Number', name: 'getReferenceNumber', type: 'eventId' }],
    [{ label: 'Brief Description', name: 'getBriefDescription' }],
    [
      {
        label: 'Class Code',
        name: 'getClassCodeId',
        type: 'classCode',
        required: true,
      },
    ],
    [
      {
        label: 'Department',
        name: 'getDepartmentCode',
        type: 'department',
        required: true,
      },
    ],
    [
      { label: 'Date', name: 'date', type: 'mui-date', required: true },
      {
        label: 'Started',
        name: 'getTimeStarted',
        type: 'mui-time',
        required: true,
      },
      {
        label: 'Finished',
        name: 'getTimeFinished',
        type: 'mui-time',
        required: true,
      },
    ],
    [{ label: 'Notes', name: 'getNotes', multiline: true }],
  ];
  const data = entry;
  const id = data.getId();
  if (defaultDepartment && action === 'create') {
    data.setDepartmentCode(defaultDepartment);
  }
  if (action != 'create' && data.getReferenceNumber()) {
    data.jobId = parseInt(data.getReferenceNumber());
  }
  if (data.getTimeStarted()) {
    data.date = format(parseISO(data.getTimeStarted()), 'yyyy-MM-dd');
    data.setTimeStarted(
      format(
        roundToNearestMinutes(parseISO(data.getTimeStarted()), {
          nearestTo: 15,
        }),
        'yyyy-MM-dd HH:mm',
      ),
    );
    data.setTimeFinished(
      format(
        roundToNearestMinutes(parseISO(data.getTimeFinished()), {
          nearestTo: 15,
        }),
        'yyyy-MM-dd HH:mm',
      ),
    );
  } else {
    data.date = format(new Date(), 'yyyy-MM-dd');
    data.setTimeStarted(
      format(
        roundToNearestMinutes(new Date(), { nearestTo: 15 }),
        'yyyy-MM-dd HH:mm',
      ),
    );
    data.setTimeFinished(
      format(
        roundToNearestMinutes(new Date(), { nearestTo: 15 }),
        'yyyy-MM-dd HH:mm',
      ),
    );
  }
  const handleUpdate = useCallback(
    async (data: EntryWithDate) => {
      setSaving(true);
      const newDate = data.date;
      console.log(data);
      data = makeSafeFormObject(data, new TimesheetLine());

      data.setTimeStarted(
        `${format(
          newDate ? parseISO(newDate) : new Date(),
          'yyyy-MM-dd',
        )} ${format(parseISO(data.getTimeStarted()), 'HH:mm')}`,
      );
      data.setTimeFinished(
        `${format(
          newDate ? parseISO(newDate) : new Date(),
          'yyyy-MM-dd',
        )} ${format(parseISO(data.getTimeFinished()), 'HH:mm')}`,
      );
      if (
        isBefore(
          parseISO(data.getTimeFinished()),
          parseISO(data.getTimeStarted()),
        )
      ) {
        console.log('caught a negative time, lets do something about it here');
      }
      delete data.date;
      const req = new TimesheetLine();
      req.setId(id);
      if (data.getReferenceNumber()) {
        console.log(data.getReferenceNumber());
        req.setReferenceNumber(data.getReferenceNumber().toString());
        req.setEventId(parseInt(data.getReferenceNumber()));
      }
      req.setTimeStarted(data.getTimeStarted());
      req.setTimeFinished(data.getTimeFinished());
      req.setDepartmentCode(data.getDepartmentCode());
      req.setClassCodeId(data.getClassCodeId());
      req.setBriefDescription(data.getBriefDescription());
      req.setNotes(data.getNotes());

      req.setFieldMaskList([
        'ReferenceNumber',
        'TimeStarted',
        'TimeFinished',
        'DepartmentCode',
        'ClassCodeId',
        'BriefDescription',
        'Notes',
      ]);
      console.log(req);
      const result = await tslClient.Update(req);
      setSaving(false);
      onSave(result);
    },
    [setSaving, onSave],
  );

  const handleCreate = useCallback(
    async (data: EntryWithDate) => {
      setSaving(true);
      const newDate = data.date;
      data = makeSafeFormObject(data, new TimesheetLine());
      console.log(data);
      if (data.getReferenceNumber()) {
        data.setReferenceNumber(data.getReferenceNumber().toString());
        data.setEventId(parseInt(data.getReferenceNumber()));
      }
      data.setTimeStarted(
        `${format(
          newDate ? parseISO(newDate) : new Date(),
          'yyyy-MM-dd',
        )} ${format(parseISO(data.getTimeStarted()), 'HH:mm')}`,
      );
      data.setTimeFinished(
        `${format(
          newDate ? parseISO(newDate) : new Date(),
          'yyyy-MM-dd',
        )} ${format(parseISO(data.getTimeFinished()), 'HH:mm')}`,
      );
      delete data.date;
      data.setTechnicianUserId(timesheetOwnerId);

      data.setFieldMaskList([
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
      const result = await tslClient.Create(data);
      setSaving(false);
      onSave(result);
    },
    [setSaving, onSave, timesheetOwnerId],
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
        {!!entry?.getEventId() && <span>Source: {entry?.getEventId()}</span>}
        {action === 'update' && (
          <ButtonGroup
            className="TimesheetEditModalButtonGroup"
            disabled={saving}
          >
            <Button
              label={timesheetAdministration ? 'Approve' : 'Submit'}
              onClick={handleApprove}
              disabled={
                (timesheetAdministration && !entry.getUserApprovalDatetime()) ||
                (role === 'Payroll' && timesheetOwnerId !== userId)
              }
            />
            {role === 'Payroll' && (
              <Button
                className="TimesheetEditModalDelete"
                label={'Process'}
                onClick={handleProcess}
                disabled={
                  !entry.getAdminApprovalDatetime() ||
                  entry.getAdminApprovalUserId() === 0
                }
              />
            )}
            <Button
              label="Delete"
              onClick={handleDelete}
              className="TimesheetEditModalDelete"
            />
            {role === 'Payroll' && (
              <Button
                label="Revoke"
                onClick={handleRevoke}
                className="TimesheetEditModalDelete"
                disabled={
                  role !== 'Payroll' && !entry.getAdminApprovalDatetime()
                }
              />
            )}
          </ButtonGroup>
        )}
      </Form>
    </Modal>
  );
};

export default EditTimesheetModal;
