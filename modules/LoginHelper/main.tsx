import React from 'react';
import { Login } from '../Login/main';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
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
      <Modal
        aria-labelledby="transition-modal-title"
        className="LoginHelperModal"
        open={isOpen}
        onClose={toggleModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <Login onSuccess={onSuccess} />
        </Fade>
      </Modal>
    </>
  );
}
