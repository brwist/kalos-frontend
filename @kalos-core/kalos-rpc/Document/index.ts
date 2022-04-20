import { grpc } from '@improbable-eng/grpc-web';
import { DocumentService } from '../compiled-protos/document_pb_service';
import { Document, DocumentList } from '../compiled-protos/document_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { timestamp } from '../Common';
class DocumentClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Document) {
    return new Promise<Document>((resolve, reject) => {
      const opts: UnaryRpcOptions<Document, Document> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DocumentService.Create, opts);
    });
  }

  public async Get(req: Document) {
    return new Promise<Document>((resolve, reject) => {
      const opts: UnaryRpcOptions<Document, Document> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DocumentService.Get, opts);
    });
  }

  public async List(req: Document, cb: (arg: Document) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Document, Document> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Document) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(DocumentService.List, opts);
    });
  }

  public async Update(req: Document) {
    return new Promise<Document>((resolve, reject) => {
      const opts: UnaryRpcOptions<Document, Document> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DocumentService.Update, opts);
    });
  }

  public async Delete(req: Document) {
    return new Promise<Document>((resolve, reject) => {
      const opts: UnaryRpcOptions<Document, Document> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DocumentService.Delete, opts);
    });
  }

  public async BatchGet(req: Document) {
    return new Promise<DocumentList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Document, DocumentList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<DocumentList>) => {
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
      grpc.unary(DocumentService.BatchGet, opts);
    });
  }

  public updateDocumentDescription = async (
    id: number,
    description: string
  ) => {
    const req = new Document();
    req.setId(id);
    req.setDescription(description);
    req.setFieldMaskList(['Description']);
    await this.Update(req);
  };

  public createTaskDocument = async (
    fileName: string,
    taskId: number,
    userId: number,
    description: string
  ) => {
    const req = new Document();
    req.setFilename(fileName);
    req.setDateCreated(timestamp());
    req.setTaskId(taskId);
    req.setUserId(userId);
    req.setDescription(description);
    req.setType(5); // FIXME is 5 correct?
    await this.Create(req);
  };
}

export { Document, DocumentList, DocumentClient };
