import React from 'react';
import { Login } from '../Login/main';
import Button from '@material-ui/core/Button';
import { Modal } from '../ComponentsLibrary/Modal';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import './styles.less';

export function LoginHelper() {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const onSuccess = () => {
    try {
      window.location.reload();
    } catch (err) {
      toggleModal();
    }
  };
  return (
    <>
      <Button onClick={toggleModal} variant="outlined">
        Login
      </Button>
      <Modal open={isOpen} onClose={toggleModal}>
        <SectionBar
          title="Login"
          actions={[{ label: 'Close', onClick: toggleModal }]}
          fixedActions
        />
        <div className="LoginHelperModal">
          <Login onSuccess={onSuccess} />
        </div>
      </Modal>
    </>
  );
}
