import { grpc } from '@improbable-eng/grpc-web';
import { TransactionDocumentService } from '../compiled-protos/transaction_document_pb_service';
import {
  TransactionDocument,
  TransactionDocumentList,
} from '../compiled-protos/transaction_document_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { S3Client, URLObject, FileObject } from '../S3File';
import { File, FileClient } from '../File';
import { ungzip, deflate } from 'pako';
import { getMimeType } from '../Common';
class TransactionDocumentClient extends BaseClient {
  S3: S3Client;
  FileClient: FileClient;
  constructor(host?: string, userID?: number) {
    super(host, userID);
    this.S3 = new S3Client(host, userID);
    this.FileClient = new FileClient(host, userID);
    this.deleteByName = this.deleteByName.bind(this);
  }

  public async Create(req: TransactionDocument) {
    return new Promise<TransactionDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionDocument, TransactionDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionDocumentService.Create, opts);
    });
  }

  public async Get(req: TransactionDocument) {
    return new Promise<TransactionDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionDocument, TransactionDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionDocumentService.Get, opts);
    });
  }

  public async List(
    req: TransactionDocument,
    cb: (arg: TransactionDocument) => void
  ) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<TransactionDocument, TransactionDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: TransactionDocument) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TransactionDocumentService.List, opts);
    });
  }

  public async Update(req: TransactionDocument) {
    return new Promise<TransactionDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionDocument, TransactionDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionDocumentService.Update, opts);
    });
  }

  public async Delete(req: TransactionDocument) {
    return new Promise<TransactionDocument>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionDocument, TransactionDocument> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TransactionDocumentService.Delete, opts);
    });
  }

  public async BatchGet(req: TransactionDocument) {
    return new Promise<TransactionDocumentList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        TransactionDocument,
        TransactionDocumentList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TransactionDocumentList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.BatchGet(req);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(TransactionDocumentService.BatchGet, opts);
    });
  }

  public async download(txnId: number, reference: string) {
    const urlObj = new URLObject();
    const contentType = getMimeType(reference);
    urlObj.setBucket('kalos-transactions');
    urlObj.setKey(`${txnId}-${reference}`);
    urlObj.setContentType(contentType as string);
    const urlRes = await this.S3.GetDownloadURL(urlObj);
    const downloadRes = await fetch(urlRes.getUrl());
    const res = new FileObject();
    res.setKey(`${txnId}-${reference}`);
    res.setMimeType(contentType as string);
    if (downloadRes.status === 200) {
      const u8 = new Uint8Array(await downloadRes.arrayBuffer());
      if (u8.length > 0) {
        try {
          res.setData(ungzip(u8));
        } catch (err) {
          res.setData(u8);
        }
      }
    }
    return res;
  }

  public async upload(txnId: number, reference: string, fileData: Uint8Array) {
    const contentType = getMimeType(reference);
    const fileKey = `${txnId}-${reference}`;
    const urlObj = new URLObject();
    urlObj.setBucket('kalos-transactions');
    urlObj.setKey(fileKey);
    urlObj.setContentType(contentType as string);
    const urlRes = await this.S3.GetUploadURL(urlObj);
    try {
      fileData = deflate(fileData);
    } catch (err) {}

    const uploadRes = await fetch(urlRes.getUrl(), {
      body: fileData.buffer,
      method: 'PUT',
    });

    if (uploadRes.status === 200) {
      const fileObj = new File();
      fileObj.setBucket('kalos-transactions');
      fileObj.setName(fileKey);
      fileObj.setMimeType(contentType as string);
      const fileRes = await this.FileClient.Create(fileObj);

      const req = new TransactionDocument();
      req.setReference(reference);
      req.setFileId(fileRes.getId());
      req.setTransactionId(txnId);
      const docResult = await this.Create(req);
      return docResult;
    } else {
      console.log(uploadRes);
    }
  }

  public async byTransactionID(id: number) {
    try {
      const req = new TransactionDocument();
      req.setTransactionId(id);
      const res = await this.BatchGet(req);
      return res.getResultsList();
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  upsertTransactionDocument = async (data: TransactionDocument) => {
    const id = data.getId();
    if (id !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    return await this[id ? 'Update' : 'Create'](data);
  };

  public async deleteByName(fileName: string, bucket: string) {
    try {
      const fileReq = new File();
      fileReq.setName(`%${fileName}%`);
      fileReq.setBucket(bucket);
      const fileRes = await this.FileClient.Get(fileReq);
      console.log('Found file: ', fileRes);
      const docReq = new TransactionDocument();

      docReq.setFileId(fileRes.getId());
      const docRes = await this.Get(docReq);
      console.log('Found doc: ', docRes);
      const deleteDocReq = new TransactionDocument();
      deleteDocReq.setId(docRes.getId());
      await this.Delete(deleteDocReq);
      console.log('Deleted doc');
      const fileDeleteReq = new File();
      fileDeleteReq.setId(fileRes.getId());
      await this.FileClient.Delete(fileDeleteReq);
      console.log('Deleted file');
      alert('File deleted successfully');
    } catch (err) {
      alert('File could not be deleted');
      console.log(err);
    }
  }
}

export {
  TransactionDocument,
  TransactionDocumentList,
  TransactionDocumentClient,
};

function diff(n: number) {
  return new Date().valueOf() - n;
}
