import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PageViewTwoTone from '@material-ui/icons/PageViewTwoTone';
import ChevronLeftTwoTone from '@material-ui/icons/ChevronLeftTwoTone';
import ChevronRightTwoTone from '@material-ui/icons/ChevronRightTwoTone';
import CloseTwoTone from '@material-ui/icons/CloseTwoTone';
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
  },
}));

interface props {
  fileList: IFile[];
  title: string;
  text: string;
}

export interface IFile {
  name: string;
  mimeType?: string;
  data?: string;
  uri?: string;
}

export function Gallery({ title, text, fileList }: props) {
  const classes = useStyles();
  const [isOpen, setOpen] = React.useState(false);
  const [activeImage, setImage] = React.useState(0);
  const [maxHeight, setHeight] = React.useState(window.innerHeight * 0.75);

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

  document.addEventListener('resize', () => {
    setHeight(window.innerHeight * 0.75);
  });

  const getSource = (img: IFile) => {
    if (img) {
      if (img.uri) {
        return img.uri;
      } else if (img.mimeType && img.data) {
        return `data:${img.mimeType};base64,${img.data}`;
      } else {
        return img.data;
      }
    }
  };

  if (fileList[activeImage]) {
    return (
      <div className="w-100">
        <Button
          variant="contained"
          size="large"
          style={{ height: 44, marginBottom: 5 }}
          className="m-b-5 w-100"
          startIcon={<PageViewTwoTone />}
          onClick={toggleOpen}
        >
          {text}
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          className={`${classes.modal}`}
          open={isOpen}
          onClose={toggleOpen}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isOpen}>
            <div className={`${classes.paper} flex-col`}>
              <div className="flex-row justify-evenly align-center">
                <span className="title-text" id="transition-modal-title">
                  {title}
                </span>
                <span className="title-text">
                  {activeImage + 1} of {fileList.length}
                </span>
                <Button
                  onClick={toggleOpen}
                  size="large"
                  className="title-text"
                  style={{ height: 44 }}
                  endIcon={<CloseTwoTone />}
                >
                  Close
                </Button>
              </div>
              <div className="flex-row justify-center">
                {fileList[activeImage].mimeType === 'application/pdf' && (
                  <iframe
                    src={getSource(fileList[activeImage])}
                    width="100%"
                  ></iframe>
                )}
                {fileList[activeImage].mimeType !== 'application/pdf' && (
                  <img
                    src={getSource(fileList[activeImage])}
                    className="w-70 h-70"
                  />
                )}
              </div>
              <div className="flex-row justify-evenly">
                <Button
                  onClick={prevImage}
                  disabled={activeImage === 0}
                  size="large"
                  className="title-text"
                  style={{ height: 44 }}
                  startIcon={<ChevronLeftTwoTone />}
                >
                  Prev
                </Button>
                <Button
                  onClick={nextImage}
                  disabled={activeImage === fileList.length - 1}
                  size="large"
                  className="title-text"
                  style={{ height: 44 }}
                  endIcon={<ChevronRightTwoTone />}
                >
                  Next
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else return null;
}
