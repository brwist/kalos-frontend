import React, { FC } from 'react';
import { Confirm } from '../Confirm';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  kind: string;
  name: string;
}

export const ConfirmDelete: FC<Props> = ({ name, kind, ...props }) => (
  <Confirm title="Confirm delete" {...props}>
    Are you sure, you want to delete {kind} <strong>{name}</strong>?
  </Confirm>
);
