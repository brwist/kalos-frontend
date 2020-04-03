import React, { FC } from 'react';
import { Modal } from '../../ComponentsLibrary/Modal';

type Props = {
  onClose: () => void;
};

const EditTimesheetModal: FC<Props> = ({ onClose }): JSX.Element => {
  return (
    <Modal open onClose={onClose}>

    </Modal>
  )
};

export default EditTimesheetModal;
