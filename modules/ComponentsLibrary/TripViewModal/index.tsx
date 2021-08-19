import { User } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';
import React, { FC, useState } from 'react';
import { PerDiemClientService, UserClientService } from '../../../helpers';
import { Button } from '../Button';
import { Schema } from '../Form';
import { Modal } from '../Modal';
import { PlainForm } from '../PlainForm';
import { SectionBar } from '../SectionBar';

interface Props {
  schema: Schema<TripInfo>;
  data: TripInfo;
  onClose: () => any;
  onApprove: (approvedTrip: TripInfo) => any;
  onProcessPayroll: (processedTrip: TripInfo) => any;
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
  const [key, setKey] = useState<string>('');

  if (!data.weekOf)
    PerDiemClientService.getRowDatesFromPerDiemTripInfos([data]).then(
      result => {
        if (result == null) {
          console.error(
            'Could not get week to use due to an error in getting the row dates.',
          );
          return;
        }
        data.weekOf = result[0].date.split(' ')[0];
        setKey(key + '!');
      },
    );

  if (!data.nameOfEmployee) {
    let u = new User();
    u.setId(data.userId);
    UserClientService.Get(u).then(result => {
      data.nameOfEmployee = result.getFirstname() + ' ' + result.getLastname();
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
                disabled={data.approved || !canApprove}
                onClick={() => onApprove(data)}
              />
              <Button
                label="Process Payroll"
                disabled={data.payrollProcessed || !canProcess}
                onClick={() => onProcessPayroll(data)}
              />
              <Button
                label="Close"
                variant="outlined"
                onClick={() => onClose()}
              />
            </>
          }
        />
        <PlainForm<TripInfo>
          key={key}
          readOnly
          data={data}
          schema={schema}
          onChange={() => {}}
        />
      </>
    </Modal>
  );
};
