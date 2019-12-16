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
import CircularProgress from '@material-ui/core/CircularProgress';

interface props {
  fileList: IFile[];
  title: string;
  text: string;
  onOpen?(): void;
  iconButton?: boolean;
  disabled?: boolean;
  deleteFn?(name: string, bucket: string, cb?: () => void): Promise<void>;
}

export interface IFile {
  name: string;
  mimeType?: string;
  data?: string;
  uri?: string;
}

export function Gallery({
  title,
  text,
  fileList,
  onOpen,
  iconButton,
  disabled,
  deleteFn,
}: props) {
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

  const onDelete = () => {
    if (fileList.length === 1 || fileList.length === 0) {
      toggleOpen();
    } else {
      if (onOpen) {
        onOpen();
      }
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

  const downloadImg = () => {
    const img = fileList[activeImage];
    const el = document.createElement('a');
    const type = img.mimeType ? img.mimeType.split('/')[1] : 'png';
    const src = getSource(img);
    console.log('src: ', src);
    console.log(fileList);
    el.download = `${img.name}`;
    el.href = src!;
    el.click();
  };

  const button = iconButton ? (
    <Tooltip title={text} placement="top">
      <IconButton onClick={toggleOpen} disabled={disabled}>
        <ImageSearchTwoTone />
      </IconButton>
    </Tooltip>
  ) : (
    <Button
      variant="outlined"
      size="large"
      style={{ height: 44, marginBottom: 10 }}
      fullWidth
      startIcon={<ImageSearchTwoTone />}
      onClick={toggleOpen}
      disabled={disabled}
    >
      {text}
    </Button>
  );
  const imgHeight = Math.floor(window.innerHeight * 0.8);
  return (
    <>
      {button}
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
          justify="flex-start"
          wrap="nowrap"
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
            {deleteFn && (
              <Button
                onClick={() =>
                  deleteFn(
                    fileList[activeImage].name,
                    'kalos-transactions',
                    toggleOpen,
                  )
                }
                size="large"
                style={{ height: 44 }}
              >
                Delete Image
              </Button>
            )}
          </Grid>
          {fileList[activeImage] && (
            <Grid
              item
              container
              direction="column"
              justify="center"
              alignItems="center"
              style={{
                maxHeight: imgHeight,
                overflow: 'scroll',
                height: imgHeight,
              }}
            >
              {fileList[activeImage].mimeType === 'application/pdf' && (
                <iframe
                  src={getSource(fileList[activeImage])}
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
          )}
          {!fileList[activeImage] && (
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              style={{ height: imgHeight, width: '100%' }}
            >
              <CircularProgress />
            </Grid>
          )}
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
              onClick={downloadImg}
              size="large"
              className="title-text"
              style={{ height: 44 }}
            >
              Download
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
}
