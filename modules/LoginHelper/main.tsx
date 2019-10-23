import React from 'react';
import { Login } from '../Login/main';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  },
}));

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

  const classes = useStyles();

  return (
    <>
      <Button onClick={toggleModal} variant="outlined">
        Login
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        className={`${classes.modal}`}
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
