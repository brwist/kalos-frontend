import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import './styles.less';

interface Props {
  title?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitLabel?: string;
}

export const Confirm: FC<Props> = ({
  open,
  title,
  onClose,
  onConfirm,
  submitLabel = 'Confirm',
  children,
}) => (
  <Modal open={open} onClose={onClose} compact maxWidth={370}>
    <SectionBar
      title={title}
      actions={[
        { label: submitLabel, onClick: onConfirm },
        { label: 'Cancel', onClick: onClose, variant: 'outlined' },
      ]}
      fixedActions
    />
    <Typography className="Confirm">{children}</Typography>
  </Modal>
);
