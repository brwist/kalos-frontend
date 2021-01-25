import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import React, { FC, useState, useEffect } from 'react';
import { Form, Schema } from '../Form';
import { Modal } from '../Modal';

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
      <Form
        title="Trip"
        submitLabel="Approve"
        cancelLabel="Close"
        schema={schema}
        data={data}
        onClose={() => onClose()}
        onSave={(approved: Trip.AsObject) => onApprove(approved)}
      />
    </Modal>
  );
};
