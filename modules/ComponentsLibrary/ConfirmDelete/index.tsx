import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';

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

export const ConfirmDelete = ({
  open,
  onClose,
  onConfirm,
  kind,
  name,
}: Props) => {
  const classes = useStyles();
  return (
    <Modal open={open} onClose={onClose} compact maxWidth={370}>
      <SectionBar
        title="Confirm delete"
        actions={[
          { label: 'Cancel', onClick: onClose, variant: 'outlined' },
          { label: 'Confirm', onClick: onConfirm },
        ]}
        fixedActions
      />
      <Typography className={classes.wrapper}>
        Are you sure, you want to delete {kind} <strong>{name}</strong>?
      </Typography>
    </Modal>
  );
};
