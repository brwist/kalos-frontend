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
  submitDisabled?: boolean;
  maxWidth?: number | 'none';
}

export const Confirm: FC<Props> = ({
  open,
  title,
  onClose,
  onConfirm,
  submitLabel = 'Confirm',
  submitDisabled = false,
  maxWidth = 370,
  children,
}) => (
  <Modal open={open} onClose={onClose} compact maxWidth={maxWidth}>
    <SectionBar
      title={title}
      actions={[
        { label: submitLabel, onClick: onConfirm, disabled: submitDisabled },
        { label: 'Cancel', onClick: onClose, variant: 'outlined' },
      ]}
      fixedActions
    />
    <Typography component="div" className="Confirm">
      {children}
    </Typography>
  </Modal>
);
