import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import './Confirm.module.less';
export interface Props {
  title?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  cancelLabel?: string;
  maxWidth?: number | 'none';
  disabled?: boolean;
}

export const Confirm: FC<Props> = ({
  open,
  title,
  onClose,
  onConfirm,
  submitLabel = 'Confirm',
  submitDisabled = false,
  cancelLabel = 'Cancel',
  maxWidth = 370,
  children,
  disabled = false,
}) => (
  <Modal open={open} onClose={onClose} compact maxWidth={maxWidth}>
    <SectionBar
      title={title}
      actions={[
        {
          label: submitLabel,
          onClick: onConfirm,
          disabled: disabled || submitDisabled,
        },
        { label: cancelLabel, onClick: onClose, variant: 'outlined', disabled },
      ]}
      fixedActions
    />
    <Typography component="div" className="Confirm">
      {children}
    </Typography>
  </Modal>
);
