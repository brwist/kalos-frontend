import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Modal } from '../Modal';
import { Confirm } from '../Confirm';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  kind: string;
  name: string;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(3),
  },
}));

export const ConfirmDelete: FC<Props> = ({ name, kind, ...props }) => (
  <Confirm title="Confirm delete" {...props}>
    Are you sure, you want to delete {kind} <strong>{name}</strong>?
  </Confirm>
);
