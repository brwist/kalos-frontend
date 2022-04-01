import { Trip } from '../../../@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { User } from '../../../@kalos-core/kalos-rpc/compiled-protos/user_pb';
import React, { FC, useState, useCallback } from 'react';
import { PerDiemClientService, UserClientService } from '../../../helpers';
import { Button } from '../Button';
import { Schema } from '../Form';
import { Modal } from '../Modal';
import { Form } from '../Form';
import { SectionBar } from '../SectionBar';

interface Props {
  schema: Schema<TripInfo>;
  data: TripInfo;
  onClose: () => any;
  onApprove: (approvedTrip: TripInfo) => any;
  onProcessPayroll: (processedTrip: TripInfo) => any;
  reloadResults: () => void;
  open: boolean;
  fullScreen?: boolean;
  canApprove?: boolean;
  canProcess?: boolean;
}

export type TripInfo = {
  // Could be a way to spread these onto the type or something, these are from Trip.AsObject
  id: number;
  distanceInMiles: number;
  originAddress: string;
  destinationAddress: string;
  perDiemRowId: number;
  fieldMaskList: string[];
  userId: number;
  notes: string;
  payrollProcessed: boolean;
  page: number;
  approved: boolean;
  jobNumber: number;
  homeTravel: boolean;
  distanceInDollars: string;
  weekOf: string;
  date: string;
  nameOfEmployee: string;
  departmentName: string;
};

export const TripViewModal: FC<Props> = ({
  schema,
  data,
  onClose,
  onApprove,
  onProcessPayroll,
  open,
  fullScreen,
  canApprove,
  canProcess,
}) => {
  const [key, setKey] = useState<string>('TripForm');
  const [formData, setFormData] = useState<TripInfo>(data);
  const tripId = data.id;
  const handleChange = useCallback((data: TripInfo) => {
    console.log({ data });
    setFormData(data);
  }, []);
  const SaveChanges = useCallback(
    async (data: TripInfo) => {
      const date = data.date;
      const homeTravel = data.homeTravel;
      const jobNumber = data.jobNumber;
      const req = new Trip();
      req.setDate(date);
      req.setHomeTravel(homeTravel);
      req.setJobNumber(jobNumber);
      req.setId(tripId);
      req.setFieldMaskList(['Date', 'HomeTravel', 'JobNumber']);
      console.log(req);
      const result = await PerDiemClientService.UpdateTrip(req);
      //console.log(result);
    },
    [tripId],
  );
  if (!formData.weekOf)
    PerDiemClientService.getRowDatesFromPerDiemTripInfos([data]).then(
      result => {
        if (result == null) {
          console.error(
            'Could not get week to use due to an error in getting the row dates.',
          );
          return;
        }
        formData.weekOf = result[0].date.split(' ')[0];
        setKey(key + '!');
      },
    );

  if (!formData.nameOfEmployee) {
    let u = new User();
    u.setId(data.userId);
    UserClientService.Get(u).then(result => {
      formData.nameOfEmployee =
        result.getFirstname() + ' ' + result.getLastname();
    });
  }
  return (
    <Modal open={open} onClose={() => onClose()} fullScreen={fullScreen}>
      <>
        <SectionBar
          title="Trip"
          asideContent={
            <>
              <Button
                label="Approve"
                disabled={formData.approved || !canApprove}
                onClick={() => onApprove(data)}
              />

              <Button
                label="Process Payroll"
                disabled={formData.payrollProcessed || !canProcess}
                onClick={() => onProcessPayroll(data)}
              />
            </>
          }
        />
        <Form<TripInfo>
          key={formData.originAddress + formData.destinationAddress}
          title={'Trip Info'}
          schema={schema}
          data={formData}
          onClose={onClose}
          onSave={SaveChanges}
          onChange={setFormData}
          submitLabel="Update Trip"
          cancelLabel="Close"
          disabled={false}
        />
      </>
    </Modal>
  );
};
