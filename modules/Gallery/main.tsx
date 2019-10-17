import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoAlbumTwoTone from '@material-ui/icons/PhotoAlbumTwoTone';
import ChevronLeftTwoTone from '@material-ui/icons/ChevronLeftTwoTone';
import ChevronRightTwoTone from '@material-ui/icons/ChevronRightTwoTone';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

interface props {
  fileList: string[];
  title: string;
}

interface state {}

export function Gallery({ title, fileList }: props) {
  const classes = useStyles();
  const [isOpen, setOpen] = React.useState(false);
  const [activeImage, setImage] = React.useState(0);

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  const nextImage = () => {
    if (activeImage + 1 <= fileList.length) {
      setImage(activeImage + 1);
    }
  };

  const prevImage = () => {
    if (activeImage - 1 >= 0) {
      setImage(activeImage - 1);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<PhotoAlbumTwoTone />}
        onClick={toggleOpen}
      >
        {title}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        className={classes.modal}
        open={isOpen}
        onClose={toggleOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Receipt Photos</h2>
            <img src={fileList[activeImage]} />
            <IconButton onClick={prevImage} disabled={activeImage === 0}>
              <ChevronLeftTwoTone />
            </IconButton>
            <IconButton
              onClick={nextImage}
              disabled={activeImage === fileList.length - 1}
            >
              <ChevronRightTwoTone />
            </IconButton>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
