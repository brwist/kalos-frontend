import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import './styles.less';

interface Props {
  title?: string;
  open: boolean;
  onClose: () => void;
  label?: string;
  maxWidth?: number;
}

export const Alert: FC<Props> = ({
  open,
  title,
  onClose,
  label = 'Okay',
  maxWidth = 370,
  children,
}) => (
  <Modal open={open} onClose={onClose} compact maxWidth={maxWidth}>
    <SectionBar
      title={title}
      actions={[{ onClick: onClose, label }]}
      fixedActions
    />
    <Typography className="Alert" component={'div'} variant={'body2'}>
      {children}
    </Typography>
  </Modal>
);
