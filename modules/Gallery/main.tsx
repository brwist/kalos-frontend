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
import { S3Client } from '../../@kalos-core/kalos-rpc/S3File';
import { getMimeType } from '../../@kalos-core/kalos-rpc/Common';
import { ENDPOINT } from '../../constants';

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
  data?: Uint8Array;
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
  const [rotation, setRotation] = React.useState(0);
  const S3 = new S3Client(ENDPOINT);
  let top = 0;

  if ((rotation / 90) % 2 !== 0) {
    console.log('90 deg rotation?');
    top = 150;
  }
  const rotateLeft = () => {
    setRotation(rotation - 90);
  };

  const rotateRight = () => {
    setRotation(rotation + 90);
  };

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
      } else {
        const mimeType = getMimeType(img.name);
        return `data:${mimeType};base64,${img.data}`;
      }
    }
  };

  const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const getHREF = () => {
    const img = fileList[activeImage];
    const blob = new Blob([img.data!], {
      type: getMimeType(img.name) || '.png',
    });
    console.log(img);
    return URL.createObjectURL(blob);
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
          <ImageSearchTwoTone />
        </IconButton>
      </span>
    </Tooltip>
  ) : (
    <Button
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
          alignItems="stretch"
          justifyContent="flex-start"
          wrap="nowrap"
        >
          <Grid
            container
            item
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            {title && <Typography>{title}</Typography>}
            <Typography>
              {activeImage + 1} of {fileList.length}
            </Typography>
            <Button
              onClick={toggleOpen}
              size="large"
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
              justifyContent="center"
              alignItems="stretch"
              style={{
                overflow: 'scroll',
                minHeight: imgHeight,
                maxHeight: window.innerHeight,
                width: '100%',
              }}
            >
              {fileList[activeImage].mimeType === 'application/pdf' && (
                <iframe
                  src={getHREF()}
                  style={{ maxWidth: '100%', height: imgHeight }}
                ></iframe>
              )}
              {fileList[activeImage].mimeType !== 'application/pdf' && (
                <img
                  src={getHREF()}
                  style={{
                    maxWidth: '100%',
                    height: '100%',
                    transform: `rotate(${rotation}deg)`,
                    position: 'relative',
                    top,
                  }}
                  onClick={rotateRight}
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
              style={{ height: imgHeight, width: '100%' }}
            >
              <CircularProgress />
            </Grid>
          )}
          <Grid
            container
            item
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              onClick={prevImage}
              disabled={activeImage === 0}
              size="large"
              style={{ height: 44 }}
              startIcon={<ChevronLeftTwoTone />}
            >
              Prev
            </Button>
            <Button onClick={downloadImg} size="large" style={{ height: 44 }}>
              Download
            </Button>
            <Button
              onClick={nextImage}
              disabled={activeImage === fileList.length - 1}
              size="large"
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

function bufToB64(buffer: Uint8Array): string {
  let bin = '';
  const len = buffer.length;
  for (let i = 0; i < len; i++) {
    bin = `${bin}${String.fromCharCode(buffer[i])}`;
  }
  return bin;
}
