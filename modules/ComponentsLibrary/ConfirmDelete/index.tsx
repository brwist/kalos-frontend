import React, { FC } from 'react';
import { Confirm, Props as ConfirmProps } from '../Confirm';

interface Props extends ConfirmProps {
  kind: string;
  name: string;
}

export const ConfirmDelete: FC<Props> = ({ name, kind, ...props }) => (
  <Confirm title="Confirm delete" {...props}>
    Are you sure you want to delete {kind}
    {name && <strong> {name}</strong>}?
  </Confirm>
);
