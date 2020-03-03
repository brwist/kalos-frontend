import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(3),
  },
}));

export const Confirm: FC<Props> = ({
  open,
  title,
  onClose,
  onConfirm,
  children,
}) => {
  const classes = useStyles();
  return (
    <Modal open={open} onClose={onClose} compact maxWidth={370}>
      <SectionBar
        title={title}
        actions={[
          { label: 'Cancel', onClick: onClose, variant: 'outlined' },
          { label: 'Confirm', onClick: onConfirm },
        ]}
        fixedActions
      />
      <Typography className={classes.wrapper}>{children}</Typography>
    </Modal>
  );
};
