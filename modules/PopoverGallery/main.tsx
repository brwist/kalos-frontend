import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DownloadIcon from '@material-ui/icons/CloudDownloadSharp';
import ChevronLeftSharp from '@material-ui/icons/ChevronLeftSharp';
import ChevronRightSharp from '@material-ui/icons/ChevronRightSharp';
import CloseSharp from '@material-ui/icons/CloseSharp';
import ImageSearchSharp from '@material-ui/icons/ImageSearchSharp';
import Popover from '@material-ui/core/Popover';
import CircularProgress from '@material-ui/core/CircularProgress';
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import { ENDPOINT } from '../../constants';

interface props {
  fileList: IFile[];
  title: string;
  text: string;
  onOpen?(): Promise<void>;
  iconButton?: boolean;
  disabled?: boolean;
}

export interface IFile {
  name: string;
  mimeType?: string;
  data?: string;
  uri?: string;
}

export function PopoverGallery_DEPRECATED({
  title,
  text,
  fileList,
  onOpen,
  iconButton,
  disabled,
}: props) {
  const [isOpen, setOpen] = React.useState(false);
  const [activeImage, setImage] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const S3 = new S3Client(ENDPOINT);

  const toggleOpen = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!isOpen);
    setAnchorEl(event.currentTarget);
    if (onOpen && !isOpen) {
      try {
        await onOpen();
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

  const getHREF = () => {
    const img = fileList[activeImage];
    const src = S3.b64toBlob(img.data!, img.name);
    return URL.createObjectURL(src);
  };

  const downloadImg = () => {
    const el = document.createElement('a');
    el.download = fileList[activeImage].name;
    el.href = getHREF();
    el.click();
  };

  const button = iconButton ? (
    <Tooltip title={text} placement="top">
      <span>
        <IconButton onClick={toggleOpen} disabled={disabled}>
          <ImageSearchSharp />
        </IconButton>
      </span>
    </Tooltip>
  ) : (
    <Button
      variant="outlined"
      size="large"
      style={{ height: 44, marginBottom: 10 }}
      fullWidth
      startIcon={<ImageSearchSharp />}
      onClick={toggleOpen}
      disabled={disabled}
    >
      {text}
    </Button>
  );
  return (
    <>
      {button}
      <Popover
        aria-labelledby="transition-modal-title"
        open={isOpen}
        anchorEl={anchorEl}
        onClose={toggleOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
          wrap="nowrap"
          style={{ height: 600, width: 600 }}
        >
          {title && (
            <Grid
              item
              container
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Typography>{title}</Typography>
            </Grid>
          )}
          <Grid
            item
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Tooltip title="Download current image" placement="top">
              <IconButton onClick={downloadImg}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Previous image" placement="top">
              <span>
                <IconButton onClick={prevImage} disabled={activeImage === 0}>
                  <ChevronLeftSharp />
                </IconButton>
              </span>
            </Tooltip>
            <Typography>
              {activeImage + 1} of {fileList.length}
            </Typography>
            <Tooltip title="Next image" placement="top">
              <span>
                <IconButton
                  onClick={nextImage}
                  disabled={activeImage === fileList.length - 1}
                >
                  <ChevronRightSharp />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Close gallery" placement="top">
              <IconButton onClick={toggleOpen}>
                <CloseSharp />
              </IconButton>
            </Tooltip>
          </Grid>
          {fileList[activeImage] && (
            <Grid item style={{ height: '100%', width: '100%' }}>
              {fileList[activeImage].mimeType === 'application/pdf' && (
                <iframe
                  src={getHREF()}
                  style={{ width: '100%', height: '100%' }}
                ></iframe>
              )}
              {fileList[activeImage].mimeType !== 'application/pdf' && (
                <img
                  src={getHREF()}
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
            </Grid>
          )}
          {!fileList[activeImage] && (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              style={{ height: '100%', width: '100%' }}
            >
              <CircularProgress />
            </Grid>
          )}
        </Grid>
      </Popover>
    </>
  );
}
