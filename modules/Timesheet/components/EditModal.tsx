import React, { FC, useCallback, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Button } from '../../ComponentsLibrary/Button';
import { TimesheetLine, TimesheetLineClient } from '@kalos-core/kalos-rpc/TimesheetLine';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
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
  onClose: () => void;
  action: 'create' | 'update' | 'convert' | '';
};

/*const mockData = {
  id: 240271
  eventId: 0
  servicesRenderedId: 455141
  taskEventId: 0
  classCode: 15
  departmentCode: 20
  briefDescription: "New AC tsat is not working - 3131 Pizzaro Place, Clermont, FL 34715"
  referenceNumber: ""
  notes: ""
  adminApprovalUserId: 0
  adminApprovalDatetime: ""
  userApprovalDatetime: ""
  timeStarted: "2020-03-29 00:00:00"
  timeFinished: "2020-03-29 00:30:00"
  technicianUserId: 8418
  isActive: 0
  fieldMaskList: []
  pageNumber: 0
}*/

const EditTimesheetModal: FC<Props> = ({ entry, userId, onClose, action }): JSX.Element => {
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
  const handleSave = useCallback(
    async (data: Entry) => {
      setSaving(true);
      data.timeStarted = `${data.date.trim()} ${data.timeStarted.trim()}`;
      data.timeFinished = `${data.date.trim()} ${data.timeFinished.trim()}`;
      console.log(data.timeStarted, data.timeFinished);
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
      // const entry = await tslClient.Update(req);
      setSaving(false);
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
      const saved = await tslClient.Create(req);
      console.log(saved);
      setSaving(false);
    },
    [
      setSaving,
      entry,
    ],);

  return (
    <Modal open onClose={onClose}>
      <Form<Entry>
        title="Edit Timesheet Line"
        schema={SCHEMA}
        data={entry}
        onSave={action === 'update' ? handleSave : handleCreate}
        onClose={onClose}
        disabled={saving}
      >
        {!!entry?.eventId && (
          <span>Source: {entry?.eventId}</span>
        )}
        <ButtonGroup className={classes.buttonGroup}>
          <Button label="Approve" />
          <Button label="Reject" />
          <Button label="Delete" />
        </ButtonGroup>
      </Form>
    </Modal>
  )
};

export default EditTimesheetModal;
