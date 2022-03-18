import { grpc } from '@improbable-eng/grpc-web';
import { S3Service } from '../compiled-protos/S3_pb_service';
import {
  FileObject,
  URLObject,
  MoveConfig,
  BucketObject,
} from '../compiled-protos/S3_pb';
import { UnaryRpcOptions } from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';
import { ProtobufMessage } from '@improbable-eng/grpc-web/dist/typings/message';
import { gzip, ungzip, deflate } from 'pako';
import { Empty } from '../compiled-protos/common_pb';
import { b64toBlob, getMimeType } from '../Common';

/**
 * File Client
 */
class S3Client extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }
  public async Get(req: FileObject) {
    return new Promise<FileObject>((resolve, reject) => {
      const opts: UnaryRpcOptions<FileObject, FileObject> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: res => {
          if (res.message) {
            const output = res.message;
            try {
              const unzipped = ungzip(output.getData());
              output.setData(unzipped);
            } catch (err) {
              console.log('s3 content is not gzipped');
            }
            resolve(output);
          } else {
            reject(res.statusMessage);
          }
        },
      };
      grpc.unary(S3Service.Get, opts);
    });
  }

  public async Move(
    source: SimpleFile,
    destination: SimpleFile,
    preserveSource = false
  ) {
    const req = new MoveConfig();
    const sourceObj = new FileObject();
    sourceObj.setKey(source.key);
    sourceObj.setBucket(source.bucket);
    req.setSource(sourceObj);

    const destinationObj = new FileObject();
    destinationObj.setKey(destination.key);
    destinationObj.setBucket(destination.bucket);
    req.setDestination(destinationObj);

    req.setPreserveSource(preserveSource);

    return new Promise<boolean>(resolve => {
      const opts: UnaryRpcOptions<MoveConfig, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: res => {
          if (res.message) {
            resolve(true);
          } else {
            console.log(res.statusMessage);
            resolve(false);
          }
        },
      };
      grpc.unary(S3Service.Move, opts);
    });
  }

  public async Create(req: FileObject, withMessage = false) {
    const data = req.getData();
    try {
      const d = deflate(data);
      req.setData(d);
    } catch (err) {
      console.log('failed to deflate filedata', err);
      console.log('filedata', data);
    }
    return new Promise<FileObject | void>((resolve, reject) => {
      const opts: UnaryRpcOptions<FileObject, FileObject> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: res => {
          if (res.message && withMessage) {
            const output = res.message;
            try {
              const unzipped = ungzip(output.getData());
              output.setData(unzipped);
            } catch (err) {
              console.log('content is not gzipped');
            }
            resolve(output);
          } else {
            reject(res.statusMessage);
          }
        },
      };
      grpc.unary(S3Service.Create, opts);
    });
  }

  public async Delete(req: FileObject) {
    return new Promise<{}>((resolve, reject) => {
      const opts: UnaryRpcOptions<FileObject, ProtobufMessage> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(S3Service.Delete, opts);
    });
  }

  public async GetUploadURL(req: URLObject) {
    return new Promise<URLObject>((resolve, reject) => {
      const opts: UnaryRpcOptions<URLObject, URLObject> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(S3Service.GetUploadURL, opts);
    });
  }

  public async GetDownloadURL(req: URLObject) {
    return new Promise<URLObject>((resolve, reject) => {
      const opts: UnaryRpcOptions<URLObject, URLObject> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(S3Service.GetDownloadURL, opts);
    });
  }

  public async download(fileName: string, bucket: string, doInflate = false) {
    const req = new FileObject();
    req.setBucket(bucket);
    req.setKey(fileName);
    const res = await this.Get(req);
    const data = res.getData();
    const el = document.createElement('a');
    const fd = new Blob([data], { type: getMimeType(fileName) });
    el.href = URL.createObjectURL(fd);
    el.download = fileName;
    el.click();
    el.remove();
  }

  public async downloadAlt(fileName: string, bucket: string) {
    const req = new URLObject();
    req.setBucket(bucket);
    req.setKey(fileName);
    const res = await this.GetDownloadURL(req);
    console.log(res);
    const el = document.createElement('a');
    el.download = fileName;
    el.href = res.getUrl();
    el.click();
    el.remove();
  }

  public b64toBlob(b64Data: string, fileName: string) {
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    const contentType = getMimeType(fileName);

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
  }

  public getFileS3BucketUrl = async (filename: string, bucket: string) => {
    const url = new URLObject();
    url.setKey(filename);
    url.setBucket(bucket);
    const dlURL = await this.GetDownloadURL(url);
    return dlURL.getUrl();
  };

  public deleteFileFromS3Buckets = async (key: string, bucket: string) => {
    const req = new FileObject();
    req.setKey(key);
    req.setBucket(bucket);
    await this.Delete(req);
  };

  public moveFileBetweenS3Buckets = async (
    from: SimpleFile,
    to: SimpleFile,
    preserveSource: boolean = false
  ) => {
    try {
      const res = await this.Move(from, to, preserveSource);
      return res ? 'ok' : 'nok';
    } catch (e) {
      return 'nok';
    }
  };

  public openFile = async (filename: string, bucket: string) => {
    const url = await this.getFileS3BucketUrl(filename, bucket);
    window.open(url, '_blank');
  };

  public uploadFileToS3Bucket = async (
    fileName: string,
    fileData: string,
    bucketName: string,
    tagString?: string
  ) => {
    try {
      const urlObj = new URLObject();
      urlObj.setKey(fileName);
      urlObj.setBucket(bucketName);
      const type = getMimeType(fileName);
      urlObj.setContentType(type || '');
      if (tagString) {
        urlObj.setTagString(tagString);
      }
      const urlRes = await this.GetUploadURL(urlObj);
      const uploadRes = await fetch(urlRes.getUrl(), {
        body: b64toBlob(fileData.split(';base64,')[1], fileName),
        method: 'PUT',
        headers: tagString
          ? {
              'x-amz-tagging': tagString,
            }
          : {},
      });
      if (uploadRes.status === 200) {
        return 'ok';
      }
      return 'nok';
    } catch (e) {
      return 'nok';
    }
  };
}

enum ACL {
  Private = 0,
  PublicRead = 1,
  PublicReadWrite = 2,
}

interface SimpleFile {
  bucket: string;
  key: string;
}

const CLASSIFICATION = 'Classification';
const SUBJECT = 'Subject';
const RECEIPT_TAG = `${CLASSIFICATION}=Receipt`;
const EDUCATION_TAG = `${CLASSIFICATION}=Education`;
const WORKMANSHIP_TAG = `${CLASSIFICATION}=Workmanship`;
const MAKE_SUBJECT_TAG = (s: string) => `${SUBJECT}=${s}`;
const MAKE_CLASSIFICATION_TAG = (c: string) => `${CLASSIFICATION}=${c}`;
const MAKE_TAG = (key: string, value: string) => `${key}=${value}`;

const CLASSIFICATION_TAGS = [
  {
    label: 'Receipts',
    value: RECEIPT_TAG,
  },
  {
    label: 'Education',
    value: EDUCATION_TAG,
  },
  {
    label: 'Workmanship',
    value: WORKMANSHIP_TAG,
  },
];

const SUBJECT_TAGS_TRANSACTIONS = [
  {
    label: 'Receipt',
    value: MAKE_SUBJECT_TAG('Receipt'),
  },
  {
    label: 'Pick Ticket',
    value: MAKE_SUBJECT_TAG('PickTicket'),
  },
  {
    label: 'Invoice',
    value: MAKE_SUBJECT_TAG('Invoice'),
  },
];

const SUBJECT_TAGS_ACCOUNTS_PAYABLE = [
  ...SUBJECT_TAGS_TRANSACTIONS,
  {
    label: 'Invoice',
    value: MAKE_SUBJECT_TAG('Invoice'),
  },
];

const SUBJECT_TAGS = [
  ...SUBJECT_TAGS_ACCOUNTS_PAYABLE,
  {
    label: 'Data Tag',
    value: MAKE_SUBJECT_TAG('DataTag'),
  },
  {
    label: 'Refrigerant Report',
    value: MAKE_SUBJECT_TAG('RefrigerantReport'),
  },
];

const CHANNELS = [
  {
    label: '#repair-quotes',
    value: 'C0HMJ00P2',
  },
  {
    label: '#sales-calls',
    value: 'C0HEASA06',
  },
];

export {
  FileObject,
  URLObject,
  S3Client,
  ACL,
  SUBJECT_TAGS,
  SUBJECT_TAGS_TRANSACTIONS,
  SUBJECT_TAGS_ACCOUNTS_PAYABLE,
};
