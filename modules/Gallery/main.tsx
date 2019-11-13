import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChevronLeftTwoTone from '@material-ui/icons/ChevronLeftTwoTone';
import ChevronRightTwoTone from '@material-ui/icons/ChevronRightTwoTone';
import CloseTwoTone from '@material-ui/icons/CloseTwoTone';
import ImageSearchTwoTone from '@material-ui/icons/ImageSearchTwoTone';
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
  iconButton?: boolean;
}

export interface IFile {
  name: string;
  mimeType?: string;
  data?: string;
  uri?: string;
}

export function Gallery({ title, text, fileList, onOpen, iconButton }: props) {
  const classes = useStyles();
  const [isOpen, setOpen] = React.useState(false);
  const [activeImage, setImage] = React.useState(0);

  const toggleOpen = () => {
    setOpen(!isOpen);
    console.log(isOpen);
    if (onOpen && !isOpen) {
      try {
        console.log('calling on open?');
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

  console.log(iconButton);
  console.log(fileList);
  if (fileList[activeImage]) {
    return (
      <>
        {!iconButton && (
          <Button
            variant="outlined"
            size="large"
            style={{ height: 44, marginBottom: 10 }}
            fullWidth
            startIcon={<ImageSearchTwoTone />}
            onClick={toggleOpen}
          >
            {text}
          </Button>
        )}
        {iconButton && (
          <Tooltip title={text}>
            <IconButton onClick={toggleOpen}>
              <ImageSearchTwoTone />
            </IconButton>
          </Tooltip>
        )}
        <Dialog
          aria-labelledby="transition-modal-title"
          open={isOpen}
          onClose={toggleOpen}
          fullScreen
        >
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid
              container
              item
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              {title && <Typography>{title}</Typography>}
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
            <Grid item>
              {fileList[activeImage].mimeType === 'application/pdf' && (
                <iframe
                  src={getSource(fileList[activeImage])}
                  width="100%"
                  style={{ maxWidth: '100%', height: 'auto' }}
                ></iframe>
              )}
              {fileList[activeImage].mimeType !== 'application/pdf' && (
                <img
                  src={getSource(fileList[activeImage])}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
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
        {!iconButton && (
          <Button
            variant="outlined"
            size="large"
            style={{ height: 44, marginBottom: 10 }}
            fullWidth
            startIcon={<ImageSearchTwoTone />}
            onClick={toggleOpen}
          >
            {text}
          </Button>
        )}
        {iconButton && (
          <Tooltip title={text} placement="top">
            <IconButton onClick={toggleOpen}>
              <ImageSearchTwoTone />
            </IconButton>
          </Tooltip>
        )}
      </>
    );
}
