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
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import { TransactionDocumentClient } from '@kalos-core/kalos-rpc/TransactionDocument';
import { Button as ButtonLib } from '../ComponentsLibrary/Button';
import { ENDPOINT } from '../../constants';
import { getMimeType } from '../../helpers';

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
  onDelete?(): void;
  transactionID: number;
}

interface state {
  activeImage: number;
  currentURL: string;
  isOpen: boolean;
  isLoading: boolean;
  fileList: GalleryData[];
  documentList: DocData[];
  rotation: number;
}

interface DocData {
  reference: string;
  id: number;
  data?: Uint8Array;
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
      documentList: [],
      rotation: 0,
    };

    this.S3Client = new S3Client(ENDPOINT);
    this.DocClient = new TransactionDocumentClient(ENDPOINT);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.download = this.download.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.fetch = this.fetch.bind(this);
    this.delete = this.delete.bind(this);
  }

  setRotation(rotation: number) {
    this.setState({ rotation });
  }

  rotateLeft = () => {
    this.setRotation(this.state.rotation - 90);
  };

  rotateRight = () => {
    this.setRotation(this.state.rotation + 90);
  };

  toggleOpen() {
    let wasClosed: boolean;
    this.setState(prevState => {
      wasClosed = !prevState.isOpen;
      return { isOpen: !prevState.isOpen };
    });
  }

  fetchData() {
    return new Promise(async resolve => {
      const docs = await this.DocClient.byTransactionID(
        this.props.transactionID,
      );

      const galleryData = docs.map(d => {
        return {
          key: `${this.props.transactionID}-${d.reference}`,
          bucket: 'kalos-transactions',
        };
      });

      const documentList = docs.map(d => ({
        reference: d.reference,
        id: d.transactionId,
      }));
      this.setState({ fileList: galleryData, documentList }, resolve);
    });
  }

  fetchDocData(d: DocData) {
    return new Promise<Uint8Array>(async resolve => {
      const data = (
        await this.DocClient.download(d.id, d.reference)
      ).getData() as Uint8Array;
      this.setState(
        prevState => {
          return {
            documentList: prevState.documentList.map(doc => {
              if (doc.reference === d.reference) {
                doc.data = data;
              }
              return doc;
            }),
          };
        },
        () => resolve(data),
      );
    });
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
      const data = fileList[activeImage];
      try {
        await this.DocClient.deleteByName(data.key, data.bucket);
        this.setState(prevState => {
          const fileList = prevState.fileList.filter(f => f.key !== data.key);
          const documentList = prevState.documentList.filter(
            d => `${this.props.transactionID}-${d.reference}` !== data.key,
          );
          let activeImg = prevState.activeImage - 1;
          if (activeImg < 0) {
            activeImg = 0;
          }
          let isOpen = prevState.isOpen;
          if (fileList.length === 0 && documentList.length === 0) {
            isOpen = false;
          }
          return {
            fileList,
            documentList,
            activeImage,
            isOpen,
          };
        });
      } catch (err) {
        alert('File could not be deleted');
        this.setState({ isLoading: false });
      }
    });
  }

  download() {
    const { documentList, activeImage } = this.state;
    const img = documentList[activeImage];
    const el = document.createElement('a');
    el.download = img.reference;

    const blob = new Blob([img.data!], {
      type: this.S3Client.getMimeType(img.reference) || '.png',
    });
    el.href = URL.createObjectURL(blob);
    el.click();
    el.remove();
  }

  fetch() {
    this.setState({ isLoading: true }, async () => {
      try {
        let data: Uint8Array;
        if (this.state.fileList.length === 0) {
          await this.fetchData();
        }
        const doc = this.state.documentList[this.state.activeImage];
        if (doc.data && doc.data.length > 0) {
          data = doc.data;
        } else {
          data = await this.fetchDocData(doc);
        }

        const blob = new Blob([data], {
          type: getMimeType(doc.reference) || '.png',
        });
        const currentURL = URL.createObjectURL(blob);
        this.setState({
          isLoading: false,
          currentURL,
        });
      } catch (err) {
        alert('No documents were found');
        this.toggleOpen();
      }
    });
  }

  render() {
    const { iconButton, text, disabled, title } = this.props;
    const { isOpen, activeImage, currentURL, isLoading, fileList } = this.state;

    const button = iconButton ? (
      <Tooltip title={text} placement="top">
        <span>
          <IconButton onClick={this.toggleOpen} disabled={disabled}>
            <ImageSearchTwoTone />
          </IconButton>
        </span>
      </Tooltip>
    ) : (
      <ButtonLib onClick={this.toggleOpen} disabled={disabled} label={text} />
    );
    const imgHeight = Math.floor(window.innerHeight * 0.8);
    const mimeType = this.S3Client.getMimeType(
      fileList[activeImage]?.key || '',
    );
    let top = 0;
    if ((this.state.rotation / 90) % 2 !== 0) {
      top = 150;
    }
    return (
      <>
        {button}
        <Dialog
          aria-labelledby="transition-modal-title"
          open={isOpen}
          onClose={this.toggleOpen}
          onEnter={this.fetch}
          fullScreen
        >
          <Grid
            container
            direction="column"
            alignItems="stretch"
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
              {/*<Button onClick={this.delete} size="large" style={{ height: 44 }}>
                Delete Image
              </Button>*/}
            </Grid>
            {!isLoading && (
              <Grid
                item
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                style={{
                  overflow: 'scroll',
                  minHeight: imgHeight,
                  maxHeight: window.innerHeight,
                  width: '100%',
                }}
              >
                {mimeType === 'application/pdf' && (
                  <iframe
                    src={currentURL}
                    style={{ maxWidth: '100%', height: imgHeight }}
                  ></iframe>
                )}
                {mimeType !== 'application/pdf' && (
                  <img
                    src={currentURL}
                    style={{
                      maxWidth: '100%',
                      height: '100%',
                      transform: `rotate(${this.state.rotation}deg)`,
                      position: 'relative',
                      top,
                    }}
                    onClick={this.rotateRight}
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
              {
                <Button
                  onClick={this.download}
                  size="large"
                  className="title-text"
                  style={{ height: 44 }}
                >
                  Download
                </Button>
              }
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
