import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import React, { FC, useState, useEffect } from 'react';
import { Button } from '../Button';
import { Form, Schema } from '../Form';
import { Modal } from '../Modal';
import { PlainForm } from '../PlainForm';
import { SectionBar } from '../SectionBar';

interface Props {
  schema: Schema<TripInfo>;
  data: TripInfo;
  onClose: () => any;
  onApprove: (approvedTrip: Trip.AsObject) => any;
  open: boolean;
  fullScreen?: boolean;
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

  distanceInDollars: string;
  weekOf: string;
  nameOfEmployee: string;
};

export const TripViewModal: FC<Props> = ({
  schema,
  data,
  onClose,
  onApprove,
  open,
  fullScreen,
}) => {
  return (
    <Modal open={open} onClose={() => onClose()} fullScreen={fullScreen}>
      <>
        <SectionBar
          title="Trip"
          asideContent={
            <>
              <Button label="Approve" onClick={() => onApprove(data)} />
              <Button
                label="Close"
                variant="outlined"
                onClick={() => onClose()}
              />
            </>
          }
        />
        <PlainForm<TripInfo>
          readOnly
          data={data}
          schema={schema}
          onChange={() => {}}
        />
      </>
    </Modal>
  );
};
