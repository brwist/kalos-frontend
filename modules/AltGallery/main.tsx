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
import { S3Client, FileObject, URLObject } from '@kalos-core/kalos-rpc/S3File';
import {
  TransactionDocument,
  TransactionDocumentClient,
} from '@kalos-core/kalos-rpc/TransactionDocument';

export interface GalleryData {
  key: string;
  bucket: string;
}

interface props {
  fileList: GalleryData[];
  title: string;
  text: string;
  iconButton?: boolean;
  disabled?: boolean;
  onOpen?(): void;
  onDelete?(): void;
}

interface state {
  activeImage: number;
  currentURL: string;
  isOpen: boolean;
  isLoading: boolean;
  fileList: GalleryData[];
}

export class AltGallery extends React.PureComponent<props, state> {
  S3Client: S3Client;
  DocClient: TransactionDocumentClient;

  constructor(props: props) {
    super(props);
    this.state = {
      activeImage: 0,
      currentURL: '',
      isOpen: false,
      isLoading: false,
      fileList: props.fileList,
    };

    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    this.S3Client = new S3Client(0, endpoint);
    this.DocClient = new TransactionDocumentClient(0, endpoint);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.fetch = this.fetch.bind(this);
    this.delete = this.delete.bind(this);
  }

  toggleOpen() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  changeImage(n: number) {
    return () => {
      this.setState(prevState => {
        let newImg = prevState.activeImage + n;
        if (newImg < 0) {
          newImg = 0;
        }
        return {
          activeImage: newImg,
        };
      }, this.fetch);
    };
  }

  nextImage = this.changeImage(1);
  prevImage = this.changeImage(-1);

  delete() {
    this.setState({ isLoading: true }, async () => {
      const { activeImage, fileList } = this.state;
      const data = this.props.fileList[activeImage];
      try {
        await this.DocClient.deleteByName(data.key, data.bucket);
        this.prevImage();
      } catch (err) {
        alert('File could not be deleted');
        this.setState({ isLoading: false });
      }
    });
  }

  fetch() {
    this.setState({ isLoading: true }, async () => {
      const data = this.props.fileList[this.state.activeImage];
      const req = new URLObject();
      req.setBucket(data.bucket);
      req.setKey(data.key);
      const res = await this.S3Client.GetDownloadURL(req);
      this.setState({
        currentURL: res.url,
        isLoading: false,
      });
    });
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { iconButton, text, disabled, title, fileList } = this.props;
    const { isOpen, activeImage, currentURL, isLoading } = this.state;

    const button = iconButton ? (
      <Tooltip title={text} placement="top">
        <IconButton onClick={this.toggleOpen} disabled={disabled}>
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
        onClick={this.toggleOpen}
        disabled={disabled}
      >
        {text}
      </Button>
    );
    const imgHeight = Math.floor(window.innerHeight * 0.8);
    const mimeType = this.S3Client.getMimeType(fileList[activeImage].key);
    return (
      <>
        {button}
        <Dialog
          aria-labelledby="transition-modal-title"
          open={isOpen}
          onClose={this.toggleOpen}
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
                onClick={this.toggleOpen}
                size="large"
                className="title-text"
                style={{ height: 44 }}
                endIcon={<CloseTwoTone />}
              >
                Close
              </Button>
              <Button onClick={this.delete} size="large" style={{ height: 44 }}>
                Delete Image
              </Button>
            </Grid>
            {!isLoading && (
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
                {mimeType === 'application/pdf' && (
                  <iframe
                    src={currentURL}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  ></iframe>
                )}
                {mimeType !== 'application/pdf' && (
                  <img
                    src={currentURL}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                )}
              </Grid>
            )}
            {isLoading && (
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
                onClick={this.prevImage}
                disabled={activeImage === 0}
                size="large"
                className="title-text"
                style={{ height: 44 }}
                startIcon={<ChevronLeftTwoTone />}
              >
                Prev
              </Button>
              {/*<Button
                onClick={this.download}
                size="large"
                className="title-text"
                style={{ height: 44 }}
              >
                Download
              </Button>*/}
              <Button
                onClick={this.nextImage}
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
}
