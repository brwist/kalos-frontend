import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import React, { FC, useState, useEffect } from 'react';
import { Button } from '../Button';
import { Form, Schema } from '../Form';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';

interface Props {
  schema: Schema<Trip.AsObject>;
  data: Trip.AsObject;
  onClose: () => any;
  onApprove: (approvedTrip: Trip.AsObject) => any;
  open: boolean;
}

export const TripViewModal: FC<Props> = ({
  schema,
  data,
  onClose,
  onApprove,
  open,
}) => {
  return (
    <Modal open={open} onClose={() => onClose()}>
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
        <Form
          readOnly
          submitLabel="Approve"
          cancelLabel="Close"
          schema={schema}
          data={data}
          onClose={() => onClose()}
          onSave={() => {}}
        />
      </>
    </Modal>
  );
};
