import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import PageViewTwoTone from '@material-ui/icons/PageViewTwoTone';
import ChevronLeftTwoTone from '@material-ui/icons/ChevronLeftTwoTone';
import ChevronRightTwoTone from '@material-ui/icons/ChevronRightTwoTone';
import CloseTwoTone from '@material-ui/icons/CloseTwoTone';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
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
  onOpen?(): void;
}

export interface IFile {
  name: string;
  mimeType?: string;
  data?: string;
  uri?: string;
}

export function Gallery({ title, text, fileList, onOpen }: props) {
  const classes = useStyles();
  const [isOpen, setOpen] = React.useState(false);
  const [activeImage, setImage] = React.useState(0);
  const [maxHeight, setHeight] = React.useState(window.innerHeight * 0.75);

  const toggleOpen = () => {
    setOpen(!isOpen);
    if (onOpen && !isOpen) {
      try {
        onOpen();
      } catch (err) {
        console.log(err);
      }
    }
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
      <>
        <Button
          variant="outlined"
          size="large"
          style={{ height: 44, marginBottom: 10 }}
          fullWidth
          startIcon={<PageViewTwoTone />}
          onClick={toggleOpen}
        >
          {text}
        </Button>
        <Dialog
          aria-labelledby="transition-modal-title"
          open={isOpen}
          onClose={toggleOpen}
          fullScreen
        >
          <Grid container item direction="column" alignItems="center">
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              <Typography>{title}</Typography>
              <Typography>
                {activeImage + 1} of {fileList.length}
              </Typography>
              <Button
                onClick={toggleOpen}
                size="large"
                className="title-text"
                style={{ height: 44 }}
                endIcon={<CloseTwoTone />}
              >
                Close
              </Button>
            </Grid>
            <Grid
              container
              item
              direction="row"
              justify="center"
              alignItems="center"
            >
              {fileList[activeImage].mimeType === 'application/pdf' && (
                <iframe
                  src={getSource(fileList[activeImage])}
                  width="100%"
                ></iframe>
              )}
              {fileList[activeImage].mimeType !== 'application/pdf' && (
                <img src={getSource(fileList[activeImage])} />
              )}
            </Grid>
            <Grid
              container
              item
              direction="row"
              justify="center"
              alignItems="center"
            >
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
            </Grid>
          </Grid>
        </Dialog>
      </>
    );
  } else
    return (
      <>
        <Button
          variant="outlined"
          size="large"
          style={{ height: 44, marginBottom: 10 }}
          fullWidth
          startIcon={<PageViewTwoTone />}
          onClick={toggleOpen}
        >
          {text}
        </Button>
      </>
    );
}
