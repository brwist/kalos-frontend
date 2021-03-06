import React from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ImageSearchTwoTone from '@material-ui/icons/ImageSearchTwoTone';
import { S3Client } from '../../@kalos-core/kalos-rpc/S3File';
import { TransactionDocumentClient } from '../../@kalos-core/kalos-rpc/TransactionDocument';
import { Button as ButtonLib } from '../ComponentsLibrary/Button';
import { Tooltip } from '../ComponentsLibrary/Tooltip';
import { Modal } from '../ComponentsLibrary/Modal';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../ComponentsLibrary/ConfirmDelete';
import { RotatedImage, Deg } from '../ComponentsLibrary/RotatedImage';
import { Loader } from '../Loader/main';
import { ENDPOINT, WaiverTypes } from '../../constants';
import './AltGallery.module.less';
import { getMimeType } from '../../helpers';

export interface GalleryData {
  key: string;
  bucket: string;
  description: string;
  typeId: number;
}

interface props {
  fileList: GalleryData[];
  title: string;
  text: string;
  iconButton?: boolean;
  disabled?: boolean;
  onDelete?(): void;
  canDelete?: boolean;
  transactionID: number;
}

interface state {
  activeImage: number;
  currentURL: string;
  isOpen: boolean;
  isLoading: boolean;
  fileList: GalleryData[];
  documentList: DocData[];
  rotation: Deg;
  deleting: boolean;
  imageWidth: number;
  imageHeight: number;
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
      deleting: false,
      imageWidth: 1,
      imageHeight: 1,
    };
    this.S3Client = new S3Client(ENDPOINT);
    this.DocClient = new TransactionDocumentClient(ENDPOINT);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.download = this.download.bind(this);
    this.fetch = this.fetch.bind(this);
    this.delete = this.delete.bind(this);
  }

  setRotation(rotation: Deg) {
    this.setState({ rotation });
  }

  rotateLeft = () => {
    this.setRotation(((this.state.rotation - 90) % 360) as Deg);
  };

  rotateRight = () => {
    this.setRotation(((this.state.rotation + 90) % 360) as Deg);
  };

  toggleOpen() {
    this.setState(prevState => {
      return { isOpen: !prevState.isOpen };
    });
  }

  fetchData() {
    return new Promise(async resolve => {
      const docs = await this.DocClient.byTransactionID(
        this.props.transactionID,
      );
      const reverseDoc = docs.reverse();
      const galleryData = reverseDoc.map(d => {
        return {
          key: `${this.props.transactionID}-${d.getReference()}`,
          description: d.getDescription(),
          bucket: 'kalos-transactions',
          typeId: d.getTypeId(),
        };
      });

      const documentList = reverseDoc.map(d => ({
        reference: d.getReference(),
        id: d.getTransactionId(),
      }));
      this.setState(
        {
          fileList: galleryData,
          documentList: documentList,
        },
        () => resolve(reverseDoc),
      );
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

  changeImage = (newImageIndex: number) => {
    this.setState(
      {
        activeImage: newImageIndex,
        rotation: 0,
        imageWidth: 1,
        imageHeight: 1,
      },
      this.fetch,
    );
  };

  delete() {
    this.setState({ isLoading: true, deleting: false }, async () => {
      const { activeImage, fileList } = this.state;
      const data = fileList[activeImage];
      try {
        await this.DocClient.deleteByName(data.key, data.bucket);
        this.setState(prevState => {
          const fileList = prevState.fileList.filter(f => f.key !== data.key);
          const documentList = prevState.documentList.filter(
            d => `${this.props.transactionID}-${d.reference}` !== data.key,
          );
          let activeImg = 0; //prevState.activeImage - 1;
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
            activeImage: activeImg,
            isOpen,
            isLoading: false,
          };
        }, this.fetch);
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
      type: getMimeType(img.reference) || '.png',
    });
    el.href = URL.createObjectURL(blob);
    el.click();
    el.remove();
  }

  fetch() {
    this.setState({ isLoading: true }, async () => {
      try {
        let data: Uint8Array;
        await this.fetchData();
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

  handleLoadImage = (imageWidth: number, imageHeight: number) =>
    this.setState({ imageWidth, imageHeight });

  render() {
    const { iconButton, text, disabled, title, canDelete } = this.props;
    const {
      isOpen,
      activeImage,
      currentURL,
      isLoading,
      fileList,
      imageHeight,
      imageWidth,
      rotation,
    } = this.state;
    const vertical = imageWidth < imageHeight;
    const button = iconButton ? (
      <Tooltip content={text}>
        <span>
          <IconButton
            size="small"
            onClick={this.toggleOpen}
            disabled={disabled}
          >
            <ImageSearchTwoTone />
          </IconButton>
        </span>
      </Tooltip>
    ) : (
      <ButtonLib onClick={this.toggleOpen} disabled={disabled} label={text} />
    );
    const mimeType = getMimeType(fileList[activeImage]?.key || '');
    let top = 0;
    if ((rotation / 90) % 2 !== 0) {
      top = 150;
    }
    return (
      <>
        {button}

        <Modal
          open={isOpen}
          onClose={this.toggleOpen}
          onOpen={this.fetch}
          fullScreen
          classname="AltGalleryModal"
        >
          <SectionBar
            title={title}
            subtitle={`Transaction Document Type : ${
              fileList[activeImage]?.description === ''
                ? 'No Type Provided'
                : fileList[activeImage]?.description +
                  ', Waiver Status: ' +
                  WaiverTypes.find(
                    a => a.value === fileList[activeImage]?.typeId,
                  )?.label
            }`}
            actions={[
              ...(canDelete
                ? [
                    {
                      label: '',
                      onClick: () => this.setState({ deleting: true }),
                      startIcon: <DeleteIcon />,
                    },
                  ]
                : []),
              {
                label: '',
                onClick: this.download,
                startIcon: <CloudDownloadIcon />,
              },
              { label: 'Close', onClick: this.toggleOpen },
            ]}
            fixedActions
            className="AltGallerySectionBar"
          />

          {isLoading ? (
            <Loader />
          ) : mimeType === 'application/pdf' ? (
            <iframe src={currentURL} className="AltGalleryIframe"></iframe>
          ) : (
            <table
              key={`${rotation}-${imageWidth}-${imageHeight}`}
              className="AltGalleryTable"
              cellPadding={0}
              cellSpacing={0}
            >
              <tbody>
                <tr>
                  <td
                    align="center"
                    valign="middle"
                    className="AltGalleryTd"
                    onClick={this.rotateRight}
                  >
                    <RotatedImage
                      url={currentURL}
                      deg={rotation}
                      onImageSizeLoaded={this.handleLoadImage}
                      styles={
                        (vertical && [0, 180].includes(rotation)) ||
                        (!vertical && [90, 270].includes(rotation))
                          ? { maxWidth: '100vw' }
                          : { maxHeight: 'calc(100vh - 94px)' }
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          <SectionBar
            pagination={{
              count: fileList.length,
              page: activeImage,
              onPageChange: this.changeImage,
            }}
            sticky={false}
            className="AltGalleryFooter"
          />
        </Modal>
        {this.state.deleting && (
          <ConfirmDelete
            open
            onConfirm={this.delete}
            onClose={() => this.setState({ deleting: false })}
            kind="this file"
            name=""
          />
        )}
      </>
    );
  }
}
