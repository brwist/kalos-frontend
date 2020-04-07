import React, {FC, ReactElement, ReactNode, useCallback, useState} from 'react';
import { TimesheetLine, TimesheetLineClient } from '@kalos-core/kalos-rpc/compiled-protos/timesheet_line_pb';
import { Modal } from '../../ComponentsLibrary/Modal';
import {Form, Schema} from '../../ComponentsLibrary/Form';
import {getRPCFields} from '../../../helpers';

type Entry = TimesheetLine.AsObject;

type Props = {
  data?: Entry;
  userId: number,
  onClose: () => void;
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

const emptyTimesheetLine = new TimesheetLine().toObject();

const EditTimesheetModal: FC<Props> = ({ data, userId, onClose }): JSX.Element => {
  const [saving, setSaving] = useState<boolean>(false);
  const SCHEMA: Schema<Entry> = [
    [{ label: 'Reference', name: 'referenceNumber' },],
    // [{ label: 'Source', name: 'source', disabled: true },],
    [{ label: 'Brief Description', name: 'briefDescription' },],
    [{ label: 'Class Code', name: 'classCode', type: 'classCode'},],
    [{ label: 'Department', name: 'departmentCode', type: 'department'},],
    // [{ label: 'Date Started/Finish', name: 'dateStarted'}]
    [{ label: 'Notes', name: 'notes', multiline: true },],
  ];
  const { id } = data;
  const handleSave = useCallback(
    async (data: Entry) => {
      setSaving(true);
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
      // const entry = await TimesheetLineClient.Update(req);
      setSaving(false);
    },
    [
      setSaving,
    ],
  );

  return (
    <Modal open onClose={onClose}>
      <Form<Entry>
        title="Edit Timesheet Line"
        schema={SCHEMA}
        data={emptyTimesheetLine}
        onSave={handleSave}
        onClose={onClose}
        disabled={saving}
      />
    </Modal>
  )
};

export default EditTimesheetModal;
