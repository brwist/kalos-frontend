import React, { FC, useCallback, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { format } from 'date-fns';
import { Button } from '../../ComponentsLibrary/Button';
import { TimesheetLine, TimesheetLineClient } from '@kalos-core/kalos-rpc/TimesheetLine';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { Confirm } from '../../ComponentsLibrary/Confirm';
import { useConfirm } from '../../ComponentsLibrary/ConfirmService';
import { getRPCFields } from '../../../helpers';
import { ENDPOINT } from '../../../constants';

const tslClient = new TimesheetLineClient(ENDPOINT);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

type Entry = TimesheetLine.AsObject;

type Props = {
  entry: Entry;
  userId: number,
  create: boolean,
  action: 'create' | 'update' | 'convert' | '';
  onSave: (entry: TimesheetLine.AsObject, action?: 'delete' | 'approve' | 'reject') => void;
  onClose: () => void;
};

const EditTimesheetModal: FC<Props> = ({ entry, userId, action, onSave, onClose }): JSX.Element => {
  const confirm = useConfirm();
  const classes = useStyles();
  const [saving, setSaving] = useState<boolean>(false);
  const SCHEMA: Schema<Entry> = [
    [{ label: 'Reference', name: 'referenceNumber' },],
    [{ label: 'Brief Description', name: 'briefDescription' },],
    [{ label: 'Class Code', name: 'classCode', type: 'classCode', required: true},],
    [{ label: 'Department', name: 'departmentCode', type: 'department', required: true},],
    [
      { label: 'Date', name: 'date', type: 'date', required: true },
      { label: 'Started', name: 'timeStarted', type: 'time', required: true},
      { label: 'Finished', name: 'timeFinished', type: 'time', required: true},
    ],
    [{ label: 'Notes', name: 'notes', multiline: true },],
  ];
  const { id = 0 } = entry;
  const data = {...entry};
  if (data.timeStarted) {
    data.date = format(new Date(data.timeStarted), 'yyyy-MM-dd');
    data.timeStarted = format(new Date(data.timeStarted), 'HH:mm');
    data.timeFinished = format(new Date(data.timeFinished), 'HH:mm');
  }
  const handleUpdate = useCallback(
    async (data: Entry) => {
      setSaving(true);
      data.timeStarted = `${data.date.trim()} ${data.timeStarted.trim()}`;
      data.timeFinished = `${data.date.trim()} ${data.timeFinished.trim()}`;
      delete data.date;
      const req = new TimesheetLine();
      // req.setUserId(userID);
      req.setId(id);
      const fieldMaskList = [];
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        //@ts-ignore
        req[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      req.setFieldMaskList(fieldMaskList);
      const result = await tslClient.Update(req);
      setSaving(false);
      onSave(result);
    },
    [
      setSaving,
      entry,
    ],
  );

  const handleCreate = useCallback(
    async (data: Entry) => {
      setSaving(true);
      data.timeStarted = `${data.date.trim()} ${data.timeStarted.trim()}`;
      data.timeFinished = `${data.date.trim()} ${data.timeFinished.trim()}`;
      delete data.date;
      data.technicianUserId = userId;
      const req = new TimesheetLine();
      for (const fieldName in data) {
        const { methodName } = getRPCFields(fieldName);
        //@ts-ignore
        req[methodName](data[fieldName]);
      }
      const result = await tslClient.Create(req);
      setSaving(false);
      onSave(result);
    },
    [
      setSaving,
      entry,
    ],);

  const handleDelete = useCallback(
    async () => {
      confirm({
        catchOnCancel: true,
        title: "Are you sure you want to delete this Timecard?",
        description: "Are you sure you want to delete this Timecard?"
      })
        .then( async () => {
          setSaving(true);
          const req = new TimesheetLine();
          req.setId(id);
          const result = await tslClient.Delete(req);
          setSaving(false);
          onSave(result, 'delete');
        })
        .catch(() => {})
    },
    [
      setSaving,
      entry,
    ],
  );

  return (
    <Modal open onClose={onClose}>
      <Form<Entry>
        title="Edit Timesheet Line"
        schema={SCHEMA}
        data={data}
        onSave={action === 'update' ? handleUpdate : handleCreate}
        onClose={onClose}
        disabled={saving}
      >
        {!!entry?.eventId && (
          <span>Source: {entry?.eventId}</span>
        )}
        <ButtonGroup className={classes.buttonGroup}>
          <Button label="Approve" />
          <Button label="Reject" />
          <Button label="Delete" onClick={handleDelete} />
        </ButtonGroup>
      </Form>
    </Modal>
  )
};

export default EditTimesheetModal;
